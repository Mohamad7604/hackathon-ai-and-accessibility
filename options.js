// ──────────────────────────────────────────────────────────────────────────
//   options.js
//   Handles saving/loading/deleting user presets via chrome.storage.sync
// ──────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("preset-form");
  const presetsUl = document.getElementById("presets-ul");

  // Utility: Render the current presets list
  function renderPresetsList(presets) {
    presetsUl.innerHTML = ""; // clear
    for (const [name, settings] of Object.entries(presets)) {
      const li = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = name;
      li.appendChild(label);

      // “Apply” button
      const applyBtn = document.createElement("button");
      applyBtn.textContent = "Apply";
      applyBtn.addEventListener("click", () => {
        // Send to active tab to update styles
        chrome.tabs.query(
          { active: true, currentWindow: true },
          (tabs) => {
            if (!tabs[0]) return;
            chrome.storage.sync.set(settings, () => {
              chrome.tabs.sendMessage(
                tabs[0].id,
                { type: "updateStyles", settings },
                () => {
                  /* nothing further */
                }
              );
            });
          }
        );
      });
      li.appendChild(applyBtn);

      // “Delete” button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.style.marginLeft = "8px";
      delBtn.style.background = "#ff3333";
      delBtn.addEventListener("click", () => {
        chrome.storage.sync.get({ presets: {} }, (data) => {
          const allPresets = data.presets;
          delete allPresets[name];
          chrome.storage.sync.set({ presets: allPresets }, () => {
            renderPresetsList(allPresets);
          });
        });
      });
      li.appendChild(delBtn);

      presetsUl.appendChild(li);
    }

    if (Object.keys(presets).length === 0) {
      const emptyMsg = document.createElement("li");
      emptyMsg.textContent = "No presets saved yet.";
      emptyMsg.style.fontStyle = "italic";
      emptyMsg.style.color = "#666666";
      presetsUl.appendChild(emptyMsg);
    }
  }

  // On load: fetch and display existing presets
  chrome.storage.sync.get({ presets: {} }, (data) => {
    renderPresetsList(data.presets);
  });

  // On form submit: save a new preset
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document
      .getElementById("preset-name")
      .value.trim();
    if (!name) return;

    const font = document.getElementById("font").value;
    const bg = document.getElementById("bg-color").value;
    const textColor = document.getElementById("text-color").value;
    const letterSpacing = parseFloat(
      document.getElementById("letter-spacing").value
    );
    const lineHeight = parseFloat(
      document.getElementById("line-height").value
    );
    const theme = document.getElementById("theme-select")
      .value;

    // Build settings object
    const settings = {
      fontFamily: font,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight,
      theme: theme,
      // If you want to store bg/text-color as well, add them to applyStyles
      bgColor: bg,
      textColor: textColor,
    };

    // Fetch existing presets, add/update
    chrome.storage.sync.get({ presets: {} }, (data) => {
      const allPresets = data.presets;
      allPresets[name] = settings; // override if same name
      chrome.storage.sync.set({ presets: allPresets }, () => {
        renderPresetsList(allPresets);
        form.reset();
      });
    });
  });
});

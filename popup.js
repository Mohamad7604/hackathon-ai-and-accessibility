// ──────────────────────────────────────────────────────────────────────────
//   popup.js
//   Handles tab switching and button clicks in the toolbar popup.
// ──────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Deactivate all tabs/contents
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      // Activate clicked tab & its content
      tab.classList.add("active");
      document
        .getElementById(tab.getAttribute("data-tab"))
        .classList.add("active");
    });
  });

  // ─── Simplify Button ───────────────────────────────
  document
    .getElementById("simplify-button")
    .addEventListener("click", () => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
          if (!tabs[0]) return;
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["dist/aiSimplification.bundle.js"],
          });
        }
      );
      window.close();
    });

  // ─── Customize (Apply Settings) ────────────────────
  document
    .getElementById("save-settings")
    .addEventListener("click", () => {
      const font = document.getElementById("fontFamily").value;
      const letterSpacing = parseFloat(
        document.getElementById("letterSpacing").value
      );
      const lineHeight = parseFloat(
        document.getElementById("lineHeight").value
      );
      const theme = document.getElementById("theme").value;

      const newSettings = {
        fontFamily: font,
        letterSpacing: letterSpacing,
        lineHeight: lineHeight,
        theme: theme,
      };

      // Save to chrome.storage, then notify the page
      chrome.storage.sync.set(newSettings, () => {
        // Send a message to the active tab’s content script
        chrome.tabs.query(
          { active: true, currentWindow: true },
          (tabs) => {
            if (!tabs[0]) return;
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                type: "updateStyles",
                settings: newSettings,
              },
              () => {
                // close popup after applying
                window.close();
              }
            );
          }
        );
      });
    });

  // ─── Text-to-Speech Button ────────────────────────
  document.getElementById("tts-button").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["dist/textToSpeech.bundle.js"],
      });
    });
    window.close();
  });

  // ─── Vocabulary Helper Button ─────────────────────
  document
    .getElementById("vocabulary-button")
    .addEventListener("click", () => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
          if (!tabs[0]) return;
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["dist/vocabularyHelper.bundle.js"],
          });
        }
      );
      window.close();
    });
});

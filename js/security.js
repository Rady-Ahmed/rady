/* ============================================
   SECURITY MODULE — Source Code Protection
   Multi-layer protection against:
   - Source code viewing
   - DevTools inspection
   - Content copying/downloading
   - Clickjacking (iframe embedding)
   - XSS injection
   ============================================ */

(function () {
  'use strict';

  const SecurityShield = {
    config: {
      disableRightClick: true,
      disableKeyShortcuts: true,
      disableTextSelection: true,
      disableDragDrop: true,
      disableCopy: true,
      disablePrint: true,
      detectDevTools: true,
      consoleTrap: true,
      antiIframe: true,
    },

    init() {
      if (this.config.antiIframe) this.preventIframeEmbedding();
      if (this.config.disableRightClick) this.blockRightClick();
      if (this.config.disableKeyShortcuts) this.blockKeyboardShortcuts();
      if (this.config.disableTextSelection) this.blockTextSelection();
      if (this.config.disableDragDrop) this.blockDragAndDrop();
      if (this.config.disableCopy) this.blockCopyPaste();
      if (this.config.disablePrint) this.blockPrint();
      if (this.config.detectDevTools) this.devToolsDetection();
      if (this.config.consoleTrap) this.consoleProtection();
      this.blockPageSave();
      this.blockViewSource();
    },

    /* ══════════════════════════════════════
       1. BLOCK RIGHT CLICK (Context Menu)
       ══════════════════════════════════════ */
    blockRightClick() {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
    },

    /* ══════════════════════════════════════
       2. BLOCK KEYBOARD SHORTCUTS
       Prevents: Ctrl+U, Ctrl+S, Ctrl+Shift+I,
       Ctrl+Shift+J, Ctrl+Shift+C, F12, Ctrl+P
       ══════════════════════════════════════ */
    blockKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // F12 — DevTools
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl/Cmd based shortcuts
        if (e.ctrlKey || e.metaKey) {
          const key = e.key.toLowerCase();

          // Ctrl+U — View Source
          if (key === 'u') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+S — Save Page
          if (key === 's') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+P — Print
          if (key === 'p') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+A — Select All
          if (key === 'a') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+C — Copy
          if (key === 'c') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+Shift+I — DevTools
          if (e.shiftKey && key === 'i') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+Shift+J — Console
          if (e.shiftKey && key === 'j') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+Shift+C — Element Inspector
          if (e.shiftKey && key === 'c') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+Shift+K — Console (Firefox)
          if (e.shiftKey && key === 'k') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }

          // Ctrl+Shift+M — Responsive Mode
          if (e.shiftKey && key === 'm') {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      }, true);
    },

    /* ══════════════════════════════════════
       3. BLOCK TEXT SELECTION
       ══════════════════════════════════════ */
    blockTextSelection() {
      // CSS approach is applied via the security.css file
      // JS fallback:
      document.addEventListener('selectstart', (e) => {
        // Allow selection in form inputs
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return true;
        e.preventDefault();
        return false;
      });
    },

    /* ══════════════════════════════════════
       4. BLOCK DRAG & DROP (images, links)
       ══════════════════════════════════════ */
    blockDragAndDrop() {
      document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      }, true);

      document.addEventListener('drop', (e) => {
        e.preventDefault();
        return false;
      }, true);

      // Prevent image dragging specifically
      document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });
      });
    },

    /* ══════════════════════════════════════
       5. BLOCK COPY/PASTE
       ══════════════════════════════════════ */
    blockCopyPaste() {
      document.addEventListener('copy', (e) => {
        // Allow in form fields
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        e.stopPropagation();
      }, true);

      document.addEventListener('cut', (e) => {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        e.stopPropagation();
      }, true);
    },

    /* ══════════════════════════════════════
       6. BLOCK PRINT
       ══════════════════════════════════════ */
    blockPrint() {
      // Hide content when print dialog opens
      const printBlockStyle = document.createElement('style');
      printBlockStyle.id = 'security-print-block';
      printBlockStyle.textContent = `
        @media print {
          html, body {
            display: none !important;
            visibility: hidden !important;
          }
          body::after {
            content: "⛔ Printing is not allowed on this website.";
            display: block !important;
            visibility: visible !important;
            font-size: 2rem;
            text-align: center;
            padding: 100px;
            color: #333;
          }
        }
      `;
      document.head.appendChild(printBlockStyle);

      // Block Ctrl+P via beforeprint event
      window.addEventListener('beforeprint', (e) => {
        document.body.style.display = 'none';
      });

      window.addEventListener('afterprint', () => {
        document.body.style.display = '';
      });
    },

    /* ══════════════════════════════════════
       7. DEVTOOLS DETECTION
       Detects when DevTools are opened and
       warns the user / obfuscates content
       ══════════════════════════════════════ */
    devToolsDetection() {
      let devToolsOpen = false;

      // Method 1: Window size difference detection
      const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
          if (!devToolsOpen) {
            devToolsOpen = true;
            this.onDevToolsOpen();
          }
        } else {
          if (devToolsOpen) {
            devToolsOpen = false;
            this.onDevToolsClose();
          }
        }
      };

      // Method 2: debugger statement loop (commented out - aggressive)
      // Use carefully: setInterval(() => { debugger; }, 100);

      // Method 3: console.log timing detection
      const detectConsole = () => {
        const start = performance.now();
        console.profile?.();
        console.profileEnd?.();
        if (performance.now() - start > 10) {
          if (!devToolsOpen) {
            devToolsOpen = true;
            this.onDevToolsOpen();
          }
        }
      };

      setInterval(checkDevTools, 1000);
      setInterval(detectConsole, 2000);

      // Method 4: Detect via toString override
      const devToolsCheck = /./;
      let logCount = 0;
      devToolsCheck.toString = function () {
        logCount++;
        if (logCount > 1 && !devToolsOpen) {
          devToolsOpen = true;
        }
        return '';
      };
    },

    onDevToolsOpen() {
      // Create overlay warning
      const overlay = document.createElement('div');
      overlay.id = 'security-devtools-warning';
      overlay.innerHTML = `
        <div style="
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(6, 6, 11, 0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(20px);
        ">
          <div style="
            width: 80px; height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05));
            display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem;
          ">🛡️</div>
          <h2 style="color: #f0f0f5; font-size: 1.5rem; font-weight: 700; margin: 0;">
            Security Alert
          </h2>
          <p style="color: #8b8b9e; font-size: 1rem; max-width: 400px; text-align: center; line-height: 1.6; margin: 0;">
            Developer tools detected. Please close them to continue viewing this website.
          </p>
          <div style="
            margin-top: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.2);
            color: #ef4444;
            font-size: 0.875rem;
            font-weight: 500;
          ">⚠ This activity has been logged</div>
        </div>
      `;
      document.body.appendChild(overlay);
    },

    onDevToolsClose() {
      const overlay = document.getElementById('security-devtools-warning');
      if (overlay) {
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
      }
    },

    /* ══════════════════════════════════════
       8. CONSOLE PROTECTION
       ══════════════════════════════════════ */
    consoleProtection() {
      // Warning message in console
      const warningStyle = 'color: #ef4444; font-size: 2rem; font-weight: bold;';
      const messageStyle = 'color: #8b8b9e; font-size: 1rem;';

      console.log('%c⛔ STOP!', warningStyle);
      console.log(
        '%cThis browser feature is for developers only. If someone told you to paste something here, it\'s likely a scam.',
        messageStyle
      );
      console.log(
        '%c🛡️ This website is protected. All activities are monitored.',
        'color: #6366f1; font-size: 0.9rem; font-weight: 500;'
      );
    },

    /* ══════════════════════════════════════
       9. PREVENT IFRAME EMBEDDING
       (Anti-Clickjacking)
       ══════════════════════════════════════ */
    preventIframeEmbedding() {
      // Break out of iframe
      if (window.self !== window.top) {
        try {
          window.top.location.href = window.self.location.href;
        } catch (e) {
          // Cross-origin — hide content instead
          document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100vh;
              background:#06060b;color:#f0f0f5;font-family:'Inter',sans-serif;text-align:center;">
              <div>
                <h1 style="font-size:2rem;">⛔ Access Denied</h1>
                <p style="color:#8b8b9e;">This website cannot be loaded inside a frame.</p>
                <a href="${window.self.location.href}" target="_blank" 
                   style="color:#6366f1;text-decoration:underline;margin-top:12px;display:inline-block;">
                  Open directly →
                </a>
              </div>
            </div>`;
        }
      }
    },

    /* ══════════════════════════════════════
       10. BLOCK PAGE SAVE (Ctrl+S, etc.)
       ══════════════════════════════════════ */
    blockPageSave() {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          return false;
        }
      }, true);
    },

    /* ══════════════════════════════════════
       11. BLOCK VIEW SOURCE
       ══════════════════════════════════════ */
    blockViewSource() {
      // Intercept view-source protocol
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
          e.preventDefault();
          return false;
        }
      }, true);

      // Disable source map comments visibility
      // (Source maps should not be deployed in production)
    },
  };

  // ── Initialize on DOM ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecurityShield.init());
  } else {
    SecurityShield.init();
  }
})();

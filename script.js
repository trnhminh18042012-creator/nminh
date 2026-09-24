(function () {
  "use strict";

  const CONFIG = {
    devtools: {
      enabled: true,
      checkIntervalMs: 500,
      thresholdDelta: 160,
      action: "overlay",
      redirectUrl: "about:blank",
      overlayMessage: "Kích hoạt chặn Developer Tools",
    },
    shortcuts: {
      enabled: true,
    },
    contextMenu: {
      enabled: true,
    },
    textSelection: {
      enabled: true,
    },
    dragDrop: {
      enabled: true,
    },
    consoleWarning: {
      enabled: true,
      title: "CẢNH BÁO MỐI NGUY HIỂM!",
      text: "Kích hoạt bảo vệ mã nguồn",
    },
  };

  let overlayElement = null;

  function createOverlayElement() {
    if (!overlayElement) {
      overlayElement = document.createElement("div");
      overlayElement.id = "__sec_protection_overlay__";
      overlayElement.style.position = "fixed";
      overlayElement.style.top = "0";
      overlayElement.style.left = "0";
      overlayElement.style.width = "100vw";
      overlayElement.style.height = "100vh";
      overlayElement.style.backgroundColor = "#0d1117";
      overlayElement.style.color = "#11beea";
      overlayElement.style.zIndex = "2147483647";
      overlayElement.style.display = "flex";
      overlayElement.style.alignItems = "center";
      overlayElement.style.justifyContent = "center";
      overlayElement.style.fontSize = "22px";
      overlayElement.style.fontWeight = "bold";
      overlayElement.style.fontFamily = "system-ui, -apple-system, sans-serif";
      overlayElement.style.textAlign = "center";
      overlayElement.style.padding = "20px";
      overlayElement.style.userSelect = "none";
      overlayElement.innerText = CONFIG.devtools.overlayMessage;
    }
    return overlayElement;
  }

  function setProtectionState(isDevToolsOpen) {
    if (isDevToolsOpen) {
      if (CONFIG.devtools.action === "redirect") {
        window.location.replace(CONFIG.devtools.redirectUrl);
      } else if (CONFIG.devtools.action === "blank") {
        document.documentElement.innerHTML = "";
      } else if (CONFIG.devtools.action === "overlay") {
        const el = createOverlayElement();
        const parentNode = document.body || document.documentElement;
        if (parentNode && !parentNode.contains(el)) {
          parentNode.appendChild(el);
        }
      }
    } else {
      if (overlayElement && overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement);
      }
    }
  }

  function preventDefaultHandler(event) {
    event.preventDefault();
    return false;
  }

  function initializeContextMenuBlock() {
    if (CONFIG.contextMenu.enabled) {
      window.addEventListener("contextmenu", preventDefaultHandler, true);
    }
  }

  function initializeDragDropBlock() {
    if (CONFIG.dragDrop.enabled) {
      window.addEventListener("dragstart", preventDefaultHandler, true);
    }
  }

  function initializeSelectionBlock() {
    if (!CONFIG.textSelection.enabled) return;
    window.addEventListener("selectstart", preventDefaultHandler, true);

    const customStyle = document.createElement("style");
    customStyle.textContent =
      "* { -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important; }";

    if (document.head) {
      document.head.appendChild(customStyle);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.head.appendChild(customStyle);
      });
    }
  }

  function initializeShortcutBlock() {
    if (!CONFIG.shortcuts.enabled) return;

    window.addEventListener(
      "keydown",
      function (event) {
        const isCmdOrCtrl = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;
        const isAlt = event.altKey;
        const pressedKey = event.key ? event.key.toUpperCase() : "";
        const keyCode = event.keyCode;

        const isF12 = keyCode === 123 || pressedKey === "F12";
        const isDevToolsCombo =
          isCmdOrCtrl &&
          isShift &&
          (pressedKey === "I" ||
            pressedKey === "J" ||
            pressedKey === "C" ||
            keyCode === 73 ||
            keyCode === 74 ||
            keyCode === 67);
        const isMacDevToolsCombo =
          isCmdOrCtrl &&
          isAlt &&
          (pressedKey === "I" ||
            pressedKey === "J" ||
            pressedKey === "C" ||
            keyCode === 73 ||
            keyCode === 74 ||
            keyCode === 67);
        const isViewSourceCombo =
          isCmdOrCtrl && (pressedKey === "U" || keyCode === 85);
        const isSaveCombo =
          isCmdOrCtrl && (pressedKey === "S" || keyCode === 83);

        if (
          isF12 ||
          isDevToolsCombo ||
          isMacDevToolsCombo ||
          isViewSourceCombo ||
          isSaveCombo
        ) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      },
      true,
    );
  }

  function displaySelfXssWarning() {
    if (!CONFIG.consoleWarning.enabled) return;
    setTimeout(function () {
      console.log(
        "%c" + CONFIG.consoleWarning.title,
        "color: #ff0000; font-size: 40px; font-weight: bold; -webkit-text-stroke: 1px black;",
      );
      console.log(
        "%c" + CONFIG.consoleWarning.text,
        "font-size: 16px; color: #222222; font-weight: 500;",
      );
    }, 100);
  }

  function monitorDevToolsState() {
    if (!CONFIG.devtools.enabled) return;

    setInterval(function () {
      let isOpen = false;

      const widthDifference = window.outerWidth - window.innerWidth;
      const heightDifference = window.outerHeight - window.innerHeight;
      if (
        widthDifference > CONFIG.devtools.thresholdDelta ||
        heightDifference > CONFIG.devtools.thresholdDelta
      ) {
        isOpen = true;
      }

      const trackerImage = new Image();
      Object.defineProperty(trackerImage, "id", {
        get: function () {
          isOpen = true;
          return "detected";
        },
      });
      console.log("%c", trackerImage);

      setProtectionState(isOpen);
    }, CONFIG.devtools.checkIntervalMs);
  }

  function bootProtectionSuite() {
    displaySelfXssWarning();
    initializeContextMenuBlock();
    initializeDragDropBlock();
    initializeSelectionBlock();
    initializeShortcutBlock();
    monitorDevToolsState();
  }

  bootProtectionSuite();
})();

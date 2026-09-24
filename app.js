const homeSection = document.getElementById("homeSection");
const premiumSection = document.getElementById("premiumSection");
const monitorSection = document.getElementById("monitorSection");
const boosterSection = document.getElementById("boosterSection");
const homeBottom = document.getElementById("homeBottom");
const functionBottom = document.getElementById("functionBottom");
const monitorBottom = document.getElementById("monitorBottom");
const boosterBottom = document.getElementById("boosterBottom");
const noLinkButtons = document.querySelectorAll("[data-no-link]");
const soundToggles = document.querySelectorAll(".sound-toggle");
const modalBackdrop = document.getElementById("modalBackdrop");
const limitModal = document.getElementById("limitModal");
let modalTimer;
let audioContext;

function updateFeatureState(toggle) {
  const card = toggle.closest(".feature-item");
  if (!card) return;
  card.classList.toggle("is-on", toggle.checked);
}

function openLimitModal() {
  document.body.classList.add("modal-open");
  if (modalTimer) {
    clearTimeout(modalTimer);
  }
  modalTimer = setTimeout(() => {
    document.body.classList.remove("modal-open");
  }, 3000);
}

const AC = window.AudioContext || window.webkitAudioContext;
let ctx = new AC();

function playToggleSound(){
  if(ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 6.0; 
  master.connect(ctx.destination);

  function note(freq, delay, duration){
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.setValueAtTime(freq, now + delay);

    o.connect(g);
    g.connect(master);

    const t0 = now + delay;
    const t1 = t0 + duration;

    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t1);

    o.start(t0);
    o.stop(t1 + 0.02);
  }
  note(1480, 0.00, 0.16);
  note(1820, 0.07, 0.18);
}

function bindEvents() {
  if (functionBottom) {
    functionBottom.addEventListener("click", (event) => {
      event.preventDefault();
      showSection("premium");
    });
  }

  if (homeBottom) {
    homeBottom.addEventListener("click", (event) => {
      event.preventDefault();
      showSection("home");
    });
  }

  if (monitorBottom) {
    monitorBottom.addEventListener("click", (event) => {
      event.preventDefault();
      showSection("monitor");
    });
  }

  if (boosterBottom) {
    boosterBottom.addEventListener("click", (event) => {
      event.preventDefault();
      showSection("booster");
    });
  }

  noLinkButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const message = button.getAttribute("data-no-link") || "Chưa có liên kết";
      alert(message);
    });
  });

  soundToggles.forEach((toggle) => {
    toggle.addEventListener("change", playToggleSound);
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        const enabledCount = document.querySelectorAll(".sound-toggle:checked").length;
        if (enabledCount > 100) {
          toggle.checked = false;
          updateFeatureState(toggle);
          openLimitModal();
          return;
        }
      }
      updateFeatureState(toggle);
    });
    updateFeatureState(toggle);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", () => {
      document.body.classList.remove("modal-open");
    });
  }
}

function showSection(type) {
  const isPremium = type === "premium";
  const isHome = type === "home";
  const isBooster = type === "booster";
  if (homeSection) {
    homeSection.classList.toggle("is-hidden", !isHome);
    homeSection.style.display = isHome ? "" : "none";
  }
  if (premiumSection) {
    premiumSection.classList.toggle("is-hidden", !isPremium);
    premiumSection.style.display = isPremium ? "" : "none";
  }
  if (monitorSection) {
    monitorSection.classList.toggle("is-hidden", type !== "monitor");
    monitorSection.style.display = type === "monitor" ? "" : "none";
  }
  if (boosterSection) {
    boosterSection.classList.toggle("is-hidden", !isBooster);
    boosterSection.style.display = isBooster ? "" : "none";
  }
  if (functionBottom) functionBottom.classList.toggle("is-active", isPremium);
  if (monitorBottom) monitorBottom.classList.toggle("is-active", type === "monitor");
  if (boosterBottom) boosterBottom.classList.toggle("is-active", isBooster);
  if (homeBottom) homeBottom.classList.toggle("is-active", isHome);

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

bindEvents();
showSection("home");

function initFireflies() {
  const layer = document.createElement("div");
  layer.className = "firefly-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  const total = 34;
  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement("span");
    dot.className = "firefly";
    dot.style.setProperty("--x", `${Math.random() * 100}%`);
    dot.style.setProperty("--y", `${20 + Math.random() * 95}%`);
    dot.style.setProperty("--size", `${2 + Math.random() * 4}px`);
    dot.style.setProperty("--duration", `${11 + Math.random() * 13}s`);
    dot.style.setProperty("--delay", `${Math.random() * -18}s`);
    dot.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    dot.style.setProperty("--glow", `${14 + Math.random() * 24}px`);
    layer.appendChild(dot);
  }
}

initFireflies();

function initAppTextProtection() {
  const allowedSelector = "input, textarea, [contenteditable='true']";
  document.addEventListener("copy", (event) => {
    if (!event.target.closest(allowedSelector)) event.preventDefault();
  });
  document.addEventListener("cut", (event) => {
    if (!event.target.closest(allowedSelector)) event.preventDefault();
  });
  document.addEventListener("selectstart", (event) => {
    if (!event.target.closest(allowedSelector)) event.preventDefault();
  });
  document.addEventListener("contextmenu", (event) => {
    if (!event.target.closest(allowedSelector)) event.preventDefault();
  });
}

initAppTextProtection();

function initRealtimeMonitor() {
  const consoleView = document.getElementById("consoleView");
  const cpuCanvas = document.getElementById("cpuCanvas");
  const ramCanvas = document.getElementById("ramCanvas");
  if (!consoleView || !cpuCanvas || !ramCanvas) return;

  const mLogs = document.getElementById("mLogs");
  const mErrs = document.getElementById("mErrs");
  const mFps = document.getElementById("mFps");
  const mFrame = document.getElementById("mFrame");
  const mCpu = document.getElementById("mCpu");
  const mRam = document.getElementById("mRam");
  const mStatus = document.getElementById("mStatus");
  const mTarget = document.getElementById("mTarget");

  const btnLock = document.getElementById("btnLock");
  const btnClearConsole = document.getElementById("btnClearConsole");
  const btnCleanRam = document.getElementById("btnCleanRam");
  const btnCleanCpu = document.getElementById("btnCleanCpu");
  const btnOptRam = document.getElementById("btnOptRam");
  const btnOptCpu = document.getElementById("btnOptCpu");
  const btnOptFps = document.getElementById("btnOptFps");
  const cmd = document.getElementById("cmd");
  const btnExec = document.getElementById("btnExec");

  const MAX_LOG_LINES = 400;
  let logCount = 0;
  let errCount = 0;
  const logLines = [];

  function ts() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    return `${hh}:${mm}:${ss}.${ms}`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function renderConsole() {
    let html = "";
    for (let i = 0; i < logLines.length; i++) {
      const line = logLines[i];
      const raw = String(line.text);
      const splitIndex = raw.indexOf(" > ");
      let body = escapeHtml(raw);
      if (splitIndex !== -1) {
        const prefix = escapeHtml(raw.slice(0, splitIndex));
        const rest = escapeHtml(raw.slice(splitIndex + 3));
        body = `<span class="prefix">${prefix}</span> <span class="prefix">&gt;</span> ${rest}`;
      }
      html += `<p class="logLine ${line.level}"><span class="t">[${line.time}]</span> ${body}</p>`;
    }
    consoleView.innerHTML = html;
    consoleView.scrollTop = consoleView.scrollHeight;
    if (mLogs) mLogs.textContent = String(logCount);
    if (mErrs) mErrs.textContent = String(errCount);
  }

  function pushLine(level, text) {
    logLines.push({ level, text: String(text), time: ts() });
    if (logLines.length > MAX_LOG_LINES) {
      logLines.splice(0, logLines.length - MAX_LOG_LINES);
    }
    renderConsole();
  }

  function updateLine(index, text) {
    if (!logLines[index]) return;
    logLines[index].text = String(text);
    renderConsole();
  }

  function buildSnippets(mode) {
    const base = [
      "init: sync state -> verify checksum -> handoff to runtime",
      "cache: warm layers -> align buffers -> prefetch hot paths",
      "graph: update nodes -> rebuild edges -> commit topology",
      "scheduler: tick -> re-order tasks -> apply budget guard",
      "buffer: reuse pools -> clear stale refs -> seal frame",
      "signal: smooth sample -> clamp noise -> emit spectrum",
      "metrics: commit frame -> write counters -> flush telemetry",
      "kernel: apply filters -> normalize output -> release locks",
      "io: flush queue -> ack packets -> update latency map",
      "core: stabilize loop -> reduce jitter -> sync cadence",
    ];
    const ram = [
      "mem: scan heap -> mark free -> schedule compaction",
      "mem: compact blocks -> merge regions -> defrag map",
      "mem: clear temp buffers -> drop refs -> request GC hint",
      "mem: release cache -> shrink slabs -> free arenas",
      "mem: trim pools -> rebalance buckets -> reduce churn",
      "mem: align pages -> adjust allocator -> optimize layout",
      "mem: reduce churn -> throttle alloc -> stabilize heap",
    ];
    const cpu = [
      "cpu: balance load -> reassign workers -> smooth peaks",
      "cpu: coalesce tasks -> batch ops -> cut overhead",
      "cpu: throttle spikes -> cap bursts -> normalize frame",
      "cpu: reduce jitter -> align cycles -> lock cadence",
      "cpu: align cycles -> optimize loop -> stabilize budget",
      "cpu: stabilize budget -> reduce stalls -> commit sync",
    ];
    const fps = [
      "fps: lock timing -> set target -> clamp drift",
      "fps: stabilize cadence -> smooth delta -> reduce jitter",
      "fps: clamp drift -> align frame -> snap pacing",
      "fps: sync v-blank -> align swap -> reduce tear",
      "fps: optimize pacing -> tune budget -> steady loop",
    ];
    if (mode === "clean-ram") return base.concat(ram, ["gc: sweep", "gc: finalize"]);
    if (mode === "clean-cpu") return base.concat(cpu, ["thread: park idle"]);
    if (mode === "opt-ram") return base.concat(ram, ["heap: optimize layout"]);
    if (mode === "opt-cpu") return base.concat(cpu, ["pipeline: optimize"]);
    if (mode === "opt-fps") return base.concat(fps, ["frame: optimize path"]);
    return base;
  }

  function runProgress(label, mode) {
    const total = 40 + Math.floor(Math.random() * 31);
    const durationMs = 5000;
    const intervalMs = Math.floor(durationMs / total);
    const lineIndex = logLines.length;
    pushLine("info", `${label}: 0%`);
    const snippets = buildSnippets(mode);
    const levels = ["info", "info", "info", "warn", "error"];
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      const percent = Math.min(100, Math.round((current / total) * 100));
      updateLine(lineIndex, `${label}: ${percent}%`);
      const pick = snippets[Math.floor(Math.random() * snippets.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      pushLine(level, `${label} > ${pick}`);
      if (current >= total) {
        clearInterval(timer);
      }
    }, intervalMs);
  }

  const native = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
  };

  function log(...args) {
    logCount += 1;
    pushLine("info", args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" "));
    native.log(...args);
  }

  function warn(...args) {
    logCount += 1;
    pushLine("warn", args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" "));
    native.warn(...args);
  }

  function err(...args) {
    logCount += 1;
    errCount += 1;
    pushLine("error", args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" "));
    native.error(...args);
  }

  console.log = log;
  console.warn = warn;
  console.error = err;
  console.info = log;

  window.addEventListener("error", (event) => {
    err(`Uncaught: ${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`);
  });
  window.addEventListener("unhandledrejection", (event) => {
    err(`UnhandledRejection: ${event.reason}`);
  });

  window.log = log;
  window.warn = warn;
  window.err = err;
  window.help = () => {
    log("Commands:", "log(x), warn(x), err(x)", "burn(ms) - bận CPU giả lập", "alloc(mb) - tạo rác RAM (demo)", "clearConsole()");
  };

  let tempTrash = [];
  window.burn = (ms = 8) => {
    const t0 = performance.now();
    while (performance.now() - t0 < ms) {

    }
    log(`burn(${ms}) done`);
  };

  window.alloc = (mb = 20) => {
    const bytes = Math.max(1, mb) * 1024 * 1024;
    const chunk = new Uint8Array(bytes);
    chunk[0] = 1;
    tempTrash.push(chunk);
    log(`alloc(${mb}MB) -> tempTrash chunks = ${tempTrash.length}`);
  };

  window.clearConsole = () => {
    logLines.length = 0;
    consoleView.innerHTML = "";
    logCount = 0;
    errCount = 0;
    if (mLogs) mLogs.textContent = "0";
    if (mErrs) mErrs.textContent = "0";
  };

  const cpuCtx = cpuCanvas.getContext("2d", { alpha: false, desynchronized: true });
  const ramCtx = ramCanvas.getContext("2d", { alpha: false, desynchronized: true });
  const N = 240;
  const cpuBuf = new Float32Array(N);
  const ramBuf = new Float32Array(N);
  let idx = 0;

  let running = true;
  let lock90 = true;
  let targetFps = 90;
  let targetDt = 1000 / targetFps;

  let lastFpsT = performance.now();
  let frames = 0;
  let fps = 0;
  let fpsSim = 75;
  let fpsSimFree = 46;
  let cpuEst = 0;
  let sampleAcc = 0;
  const sampleInterval = 140;
  let targetAcc = 0;
  const targetInterval = 900;
  let cpuScale = 1;
  let ramScale = 1;
  let waveJitter = 0.02;
  let ramSmooth = 0;
  let ramPhase = 0;
  let ramDrift = 0;

  function setTrend(mode) {
    switch (mode) {
      case "clean-ram":
        ramScale = 0.6;
        waveJitter = 0.015;
        log("Trend: Dọn RAM -> sóng RAM giảm dần.");
        break;
      case "clean-cpu":
        cpuScale = 0.65;
        waveJitter = 0.012;
        log("Trend: Dọn CPU -> sóng CPU giảm dần.");
        break;
      case "opt-ram":
        ramScale = 0.8;
        waveJitter = 0.012;
        log("Trend: Tối ưu RAM -> dao động thấp hơn.");
        break;
      case "opt-cpu":
        cpuScale = 0.8;
        waveJitter = 0.012;
        log("Trend: Tối ưu CPU -> dao động ổn định hơn.");
        break;
      case "opt-fps":
        cpuScale = 0.85;
        ramScale = 0.9;
        waveJitter = 0.01;
        log("Trend: Tối ưu FPS -> sóng mượt và ổn định.");
        break;
      default:
        cpuScale = 1;
        ramScale = 1;
        waveJitter = 0.02;
    }
  }
  const hasMem = !!(performance && performance.memory && performance.memory.usedJSHeapSize);
  if (!hasMem) {
    warn("performance.memory khong co. RAM realtime se hien thi N/A.");
  }

  function resizeCanvasToDPR(canvas, ctx) {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width * dpr));
    const h = Math.max(140, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function drawWave(ctx, canvas, buf, colorStroke, label, valueText, autoScale = true) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#0a0f16";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gx = 6;
    const gy = 4;
    for (let i = 1; i < gx; i++) {
      const x = (w * i) / gx;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let j = 1; j < gy; j++) {
      const y = (h * j) / gy;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    let maxV = 1;
    if (autoScale) {
      let mv = 0.0001;
      for (let i = 0; i < N; i++) {
        const v = buf[i];
        if (v > mv) mv = v;
      }
      maxV = Math.max(1, mv);
    }

    ctx.strokeStyle = colorStroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = w / (N - 1);
    for (let i = 0; i < N; i++) {
      const bi = (idx + i) % N;
      const v = buf[bi] / maxV;
      const x = i * step;
      const y = h - v * (h - 18) - 10;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(215,226,240,0.90)";
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    ctx.fillText(label, 10, 16);

    ctx.fillStyle = "rgba(127,147,173,0.95)";
    ctx.fillText(valueText, 10, h - 10);
  }

  let lastT = performance.now();
  let accumulator = 0;
  let lastRenderT = lastT;

  function loop(t) {
    if (!running) return;
    const dt = t - lastT;
    lastT = t;
    accumulator += dt;
    sampleAcc += dt;

    if (lock90) {
      if (accumulator < targetDt) {
        requestAnimationFrame(loop);
        return;
      }
      accumulator %= targetDt;
    }

    const workStart = performance.now();
    resizeCanvasToDPR(cpuCanvas, cpuCtx);
    resizeCanvasToDPR(ramCanvas, ramCtx);

    const frameMs = t - lastRenderT;
    lastRenderT = t;

    frames += 1;
    if (t - lastFpsT >= 800) {
      fps = Math.round((frames * 1000) / (t - lastFpsT));
      frames = 0;
      lastFpsT = t;
      if (lock90) {
        const target = 60 + Math.random() * 25;
        fpsSim = fpsSim * 0.9 + target * 0.1;
        if (mFps) mFps.textContent = String(Math.round(fpsSim));
      } else if (mFps) {
        const target = 35 + Math.random() * 22;
        fpsSimFree = fpsSimFree * 0.9 + target * 0.1;
        mFps.textContent = String(Math.round(fpsSimFree));
      }
    }
    if (mFrame) mFrame.textContent = frameMs.toFixed(1);

    let usedMB = NaN;
    if (hasMem) {
      usedMB = performance.memory.usedJSHeapSize / 1048576;
      if (mRam) mRam.textContent = `${usedMB.toFixed(0)} MB`;
    } else {
      ramPhase += dt * 0.0009;
      ramDrift += (Math.random() - 0.5) * 0.18;
      ramDrift = Math.max(-6, Math.min(6, ramDrift));
      const sim = 190 + 12 * Math.sin(ramPhase) + 6 * Math.sin(ramPhase * 0.35) + ramDrift;
      usedMB = Math.max(120, sim);
      if (mRam) mRam.textContent = `${usedMB.toFixed(0)} MB`;
    }

    const workEnd = performance.now();
    const busyMs = workEnd - workStart;
    const budget = lock90 ? targetDt : 16.67;
    const cpuNow = Math.max(0, Math.min(100, (busyMs / budget) * 100));
    cpuEst = cpuEst * 0.88 + cpuNow * 0.12;

    if (sampleAcc >= sampleInterval) {
      sampleAcc %= sampleInterval;
      const drift = 0.18 + 0.12 * Math.sin(t / 700) + 0.06 * Math.sin(t / 2100);
      const cpuNoise = (Math.random() - 0.5) * waveJitter * 2;
      const cpuValue = Math.max(
        0.05,
        Math.min(0.95, (cpuEst / 100) * 0.5 * cpuScale + drift + cpuNoise)
      );
      cpuBuf[idx] = cpuValue;

      const ramValue = Number.isFinite(usedMB) ? usedMB : ramSmooth;
      ramSmooth = ramSmooth ? ramSmooth * 0.96 + ramValue * 0.04 : ramValue;
      ramBuf[idx] = ramSmooth * ramScale;
      idx = (idx + 1) % N;
    }

    drawWave(cpuCtx, cpuCanvas, cpuBuf, "rgba(255,42,42,0.95)", "CPU est (%)", `FPS: ${fps} | Frame: ${frameMs.toFixed(1)}ms`, false);
    drawWave(ramCtx, ramCanvas, ramBuf, "rgba(255,92,92,0.95)", "RAM (MB)", hasMem ? `Heap Used: ${usedMB.toFixed(0)} MB` : "Heap Used: N/A", true);

    if (mCpu) mCpu.textContent = String(Math.round(cpuEst));
    if (mTarget) {
      targetAcc += dt;
      if (targetAcc >= targetInterval) {
        targetAcc = 0;
        const targetValue = lock90
          ? 80 + Math.round(Math.random() * 10)
          : 45 + Math.round(Math.random() * 15);
        mTarget.textContent = String(targetValue);
      }
    }

    if (mStatus) {
      if (cpuEst < 55 && fps >= (lock90 ? 80 : 50)) {
        mStatus.textContent = "Ổn định";
        mStatus.className = "v ok";
      } else if (cpuEst < 85) {
        mStatus.textContent = "Đang Tải";
        mStatus.className = "v";
      } else {
        mStatus.textContent = "Căng CPU";
        mStatus.className = "v";
      }
    }

    requestAnimationFrame(loop);
  }


  btnLock.addEventListener("click", () => {
playToggleSound();
    lock90 = !lock90;
    btnLock.textContent = `UnLock 120 FPS: ${lock90 ? "OFF" : "ON"}`;
    btnLock.classList.toggle("toggleOn", lock90);
    log("UnLock FPS:", lock90 ? "OFF (native rAF)" : "ON (120 FPS)");
  });

  btnClearConsole.addEventListener("click", () => {
playToggleSound();
    window.clearConsole();
    log("Console cleared.");
  });

  if (btnCleanRam) {
    btnCleanRam.addEventListener("click", () => {
playToggleSound();
      tempTrash = [];
      ramBuf.fill(0);
      idx = 0;
      log("Dọn RAM: xóa bộ nhớ giả lập và reset RAM wave.");
      setTrend("clean-ram");
      runProgress("Dọn RAM", "clean-ram");
    });
  }

  if (btnCleanCpu) {
    btnCleanCpu.addEventListener("click", () => {
playToggleSound();
      cpuBuf.fill(0);
      idx = 0;
      log("Dọn CPU: reset CPU wave và giảm tải demo.");
      setTrend("clean-cpu");
      runProgress("Dọn CPU", "clean-cpu");
    });
  }

  if (btnOptRam) {
    btnOptRam.addEventListener("click", () => {
playToggleSound();
      tempTrash = [];
      ramBuf.fill(0);
      idx = 0;
      log("Tối ưu RAM: dọn dữ liệu giả lập, ưu tiên heap sạch.");
      setTrend("opt-ram");
      runProgress("Tối ưu RAM", "opt-ram");
    });
  }

  if (btnOptCpu) {
    btnOptCpu.addEventListener("click", () => {
playToggleSound();
      cpuBuf.fill(0);
      idx = 0;
      log("Tối Ưu CPU: reset wave, ưu tiên frame ổn định.");
      setTrend("opt-cpu");
      runProgress("Tối Ưu CPU", "opt-cpu");
    });
  }

  if (btnOptFps) {
    btnOptFps.addEventListener("click", () => {
playToggleSound();
      lock90 = true;
      targetFps = 120;
      targetDt = 1000 / targetFps;
      btnLock.textContent = "UnLock 120 FPS: ON";
      btnLock.classList.add("toggleOn");
      log("Tối Ưu FPS : Bật UnLock 120 FPS.");
      setTrend("opt-fps");
      runProgress("Tối Ưu FPS", "opt-fps");
    });
  }

  function execCmd() {
    const value = cmd.value.trim();
    if (!value) return;
    cmd.value = "";
    try {
      const fn = new Function("log", "warn", "err", `"use strict"; return (${value});`);
      const out = fn(log, warn, err);
      if (out !== undefined) log(out);
    } catch (error) {
      try {
        const fn2 = new Function("log", "warn", "err", `"use strict"; ${value}`);
        const out2 = fn2(log, warn, err);
        if (out2 !== undefined) log(out2);
      } catch (error2) {
        err(String(error2));
      }
    }
  }

  cmd.addEventListener("keydown", (event) => {
    if (event.key === "Enter") execCmd();
  });
  btnExec.addEventListener("click", execCmd);

  log("Ready. Type help() to see commands.");
  requestAnimationFrame(loop);
}

initRealtimeMonitor();

const ANDROID = /Android/i.test(navigator.userAgent);
const IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const FF_PLAY = "https://play.google.com/store/apps/details?id=com.dts.freefireth";
const FFM_PLAY = "https://play.google.com/store/apps/details?id=com.dts.freefiremax";

const FF_APPSTORE = "https://apps.apple.com/vn/app/free-fire/id1300146617";
const FFM_APPSTORE = "https://apps.apple.com/vn/app/free-fire-max/id1480516829";
function openFF() {
  const link = "freefire://";
  document.body.style.opacity = "0.85";
  window.location.href = link;
  setTimeout(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = link;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 800);
  }, 100);
}
function openFFM() {
  const link = "freefiremax://";

  document.body.style.opacity = "0.85";

  window.location.href = link;

  setTimeout(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = link;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 800);
  }, 100);
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "boost-toast";
  toast.innerText = text;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

function playSound() {
  const sound = document.getElementById("clickSound");
  if (!sound) return;

  sound.currentTime = 0;
  sound.volume = 0.5;
  sound.play();
}
function openFF() {
  const link = "freefire://";

  playSound();
  showToast("Launching Free Fire ...");

  document.body.style.opacity = "0.8";

  setTimeout(() => {
    window.location.href = link;
  }, 400);
}
function openFFM() {
  const link = "freefiremax://";

  playSound();
  showToast("Launching Free Fire Max...");

  document.body.style.opacity = "0.8";

  setTimeout(() => {
    window.location.href = link;
  }, 400);
}

/* =========================================================
   Blaze Tech V12 — GAME BOOSTER HUB / APP STORE + DEEP LINK
   ========================================================= */
(function initFlameGameHub(){
  const listEl = document.getElementById('gameList');
  const featuredEl = document.getElementById('featuredGame');
  const searchEl = document.getElementById('gameSearch');
  const countEl = document.getElementById('gameCount');
  const emptyEl = document.getElementById('gameEmpty');
  const tabsEl = document.getElementById('gameTabs');
  if(!listEl || !featuredEl) return;

  const games = [
    {name:'Free Fire MAX', category:'battle', tag:'TOP BOOST', publisher:'Garena International I', query:'Free Fire MAX', scheme:'freefiremax://', featured:true},
    {name:'Free Fire', category:'battle', tag:'BATTLE ROYALE', publisher:'Garena International I', query:'Free Fire', scheme:'freefire://'},
    {name:'PUBG MOBILE', category:'battle', tag:'BATTLE ROYALE', publisher:'Level Infinite', query:'PUBG MOBILE', scheme:'pubgmobile://'},
    {name:'Roblox', category:'all', tag:'PLATFORM', publisher:'Roblox Corporation', query:'Roblox', scheme:'roblox://'},
    {name:'Liên Quân Mobile', category:'moba', tag:'MOBA', publisher:'Garena Mobile', query:'Garena Liên Quân Mobile'},
    {name:'Mobile Legends: Bang Bang', category:'moba', tag:'MOBA', publisher:'MOONTON', query:'Mobile Legends Bang Bang'},
    {name:'Brawl Stars', category:'all', tag:'ACTION', publisher:'Supercell', query:'Brawl Stars', scheme:'brawlstars://'},
    {name:'Call of Duty: Mobile', category:'fps', tag:'FPS', publisher:'Activision Publishing', query:'Call of Duty Mobile'},
    {name:'Blood Strike', category:'fps', tag:'FPS', publisher:'NetEase Games', query:'Blood Strike'},
    {name:'Delta Force', category:'fps', tag:'FPS', publisher:'Level Infinite', query:'Delta Force'},
    {name:'Arena Breakout', category:'fps', tag:'FPS', publisher:'Level Infinite', query:'Arena Breakout'},
    {name:'Standoff 2', category:'fps', tag:'FPS', publisher:'AXLEBOLT', query:'Standoff 2'},
    {name:'Minecraft', category:'all', tag:'SANDBOX', publisher:'Mojang', query:'Minecraft', scheme:'minecraft://'},
    {name:'Clash of Clans', category:'all', tag:'STRATEGY', publisher:'Supercell', query:'Clash of Clans', scheme:'clashofclans://'},
    {name:'Clash Royale', category:'all', tag:'STRATEGY', publisher:'Supercell', query:'Clash Royale'},
    {name:'Genshin Impact', category:'all', tag:'RPG', publisher:'COGNOSPHERE PTE. LTD.', query:'Genshin Impact'},
    {name:'Honkai: Star Rail', category:'all', tag:'RPG', publisher:'COGNOSPHERE PTE. LTD.', query:'Honkai Star Rail'},
    {name:'Asphalt Legends Unite', category:'all', tag:'RACING', publisher:'Gameloft', query:'Asphalt Legends Unite'},
    {name:'EA SPORTS FC Mobile', category:'all', tag:'SPORTS', publisher:'Electronic Arts', query:'EA SPORTS FC Mobile'},
    {name:'8 Ball Pool', category:'all', tag:'SPORTS', publisher:'Miniclip.com', query:'8 Ball Pool'}
  ];

  let activeCategory = 'all';
  let query = '';
  let selectedFeatured = games.find(g=>g.featured) || games[0];

  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function makeFallbackIcon(game){
    const letters = game.name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff314d"/><stop offset="1" stop-color="#180207"/></linearGradient></defs><rect width="160" height="160" rx="38" fill="url(#g)"/><circle cx="80" cy="70" r="42" fill="#090a0e" opacity=".72"/><text x="80" y="88" text-anchor="middle" font-family="Arial" font-size="34" font-weight="900" fill="white">${letters}</text><text x="80" y="122" text-anchor="middle" font-family="Arial" font-size="10" font-weight="700" letter-spacing="2" fill="#ff9ca8">FLAME</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  async function hydrateGame(game){
    try{
      const url = 'https://itunes.apple.com/search?term=' + encodeURIComponent(game.query) + '&entity=software&country=vn&limit=8';
      const res = await fetch(url, {cache:'force-cache'});
      if(!res.ok) throw new Error('store');
      const data = await res.json();
      const hit = (data.results || []).find(x => x.kind === 'software' && /game/i.test(x.primaryGenreName || '') ) || data.results?.[0];
      if(hit){
        game.image = (hit.artworkUrl512 || hit.artworkUrl100 || '').replace('100x100','512x512');
        game.appUrl = hit.trackViewUrl || game.appUrl;
        game.publisher = hit.sellerName || hit.artistName || game.publisher;
      }
    }catch(e){}
    game.image = game.image || makeFallbackIcon(game);
    return game;
  }

  function visibleGames(){
    const q = query.trim().toLowerCase();
    return games.filter(g => {
      const categoryOk = activeCategory === 'all' || g.category === activeCategory;
      const text = (g.name + ' ' + g.publisher + ' ' + g.tag).toLowerCase();
      return categoryOk && (!q || text.includes(q));
    });
  }

  function renderFeatured(){
    const g = selectedFeatured;
    featuredEl.innerHTML = `<div class="featured-inner">
      <img class="featured-art" src="${escapeHtml(g.image || makeFallbackIcon(g))}" alt="${escapeHtml(g.name)}">
      <div class="featured-copy">
        <span class="boost-badge">${escapeHtml(g.tag || 'TOP BOOST')}</span>
        <div class="featured-name">${escapeHtml(g.name)}</div>
        <div class="featured-desc">${escapeHtml(g.publisher || 'App Store')} • Flame Boost Ready</div>
      </div>
      <button class="optimize-btn" type="button" data-game="${escapeHtml(g.name)}">Optimize</button>
    </div>`;
    featuredEl.querySelector('.optimize-btn')?.addEventListener('click', ()=>launchGame(g, featuredEl));
  }

  function renderList(){
    const items = visibleGames();
    countEl.textContent = String(items.length);
    emptyEl.hidden = items.length !== 0;
    listEl.innerHTML = items.map(g => `<div class="game-row">
      <img class="game-icon" src="${escapeHtml(g.image || makeFallbackIcon(g))}" alt="${escapeHtml(g.name)}">
      <div class="game-info">
        <div class="game-name">${escapeHtml(g.name)}</div>
        <div class="game-meta">Games • ${escapeHtml(g.publisher || 'App Store')}</div>
        <span class="game-tag">${escapeHtml(g.tag || 'GAME')}</span>
      </div>
      <button class="optimize-btn" type="button">Optimize</button>
    </div>`).join('');

    listEl.querySelectorAll('.game-row').forEach((row, i)=>{
      const game = items[i];
      row.querySelector('.optimize-btn')?.addEventListener('click', ()=>launchGame(game, row));
      row.querySelector('.game-icon')?.addEventListener('error', e=>{e.currentTarget.src=makeFallbackIcon(game)});
      row.addEventListener('click', e=>{
        if(e.target.closest('button')) return;
        selectedFeatured = game;
        renderFeatured();
        featuredEl.scrollIntoView({behavior:'smooth',block:'nearest'});
      });
    });
  }

  function launchGame(game, visual){
    if(!game || !visual) return;

    const btn = visual.querySelector('.optimize-btn');
    if(!btn || btn.dataset.boosting === '1') return;

    const originalText = btn.textContent || 'Optimize';
    btn.dataset.boosting = '1';
    btn.disabled = true;
    visual.classList.remove('boost-launching','boost-ready','boost-done');
    void visual.offsetWidth;
    visual.classList.add('boost-launching');

    if(typeof playSound === 'function') playSound();

    // Show a short, deterministic optimization animation.
    btn.innerHTML = '<span class="boost-spinner" aria-hidden="true"></span><span class="boost-btn-text">OPTIMIZING</span>';

    const finish = () => {
      visual.classList.remove('boost-launching');
      visual.classList.add('boost-ready','boost-done');

      btn.innerHTML = '<span class="boost-check" aria-hidden="true">✓</span><span class="boost-btn-text">READY</span>';

      if(typeof showToast === 'function'){
        showToast('Blaze Tech Boost  ' + game.name + ' boost profile ready');
      }

      const deep = game.scheme;

      // Launch ONLY the game. Do not redirect to App Store after the deep-link.
      // If the game is not installed or does not expose a working scheme,
      // iOS simply stays on the current page instead of opening the App Store.
      setTimeout(() => {
        btn.innerHTML = '<span class="boost-btn-text">LAUNCHING</span>';

        if(deep){
          window.location.href = deep;
        }else{
          // No deep-link available: finish without an App Store redirect.
          btn.innerHTML = '<span class="boost-btn-text">READY</span>';
          btn.dataset.boosting = '0';
          btn.disabled = false;
        }
      }, 420);
    };

    // Exactly one timer; never spins forever.
    setTimeout(finish, 1150);
  }

  tabsEl?.addEventListener('click', e=>{
    const tab = e.target.closest('.game-tab');
    if(!tab) return;
    tabsEl.querySelectorAll('.game-tab').forEach(x=>x.classList.remove('is-active'));
    tab.classList.add('is-active');
    activeCategory = tab.dataset.category || 'all';
    renderList();
  });
  searchEl?.addEventListener('input', ()=>{query=searchEl.value; renderList();});

  // Start instantly with polished fallback icons; enrich from App Store in the background.
  games.forEach(g=>{g.image=makeFallbackIcon(g)});
  selectedFeatured = games[0];
  renderFeatured();
  renderList();
  Promise.all(games.map(hydrateGame)).then(()=>{
    renderFeatured();
    renderList();
  });
})();

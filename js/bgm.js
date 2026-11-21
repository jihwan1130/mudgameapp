(() => {
  const brand = document.querySelector(".brand");
  if (!brand) return;

  const key = "whatif_bgm";
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(key)) || {}; } catch {}
  let mode = saved.mode || "playing";
  let position = saved.position || 0;

  const player = document.createElement("div");
  player.className = "bgm-player";
  player.setAttribute("role", "group");
  player.setAttribute("aria-label", "Amber Archive 배경 음악");
  player.innerHTML = `
    <button class="bgm-toggle" type="button" aria-label="배경 음악 재생">▶</button>
    <div class="bgm-track">
      <div class="bgm-display"><span>Amber Archive</span><span class="bgm-time">0:00 / --:--</span></div>
      <input class="bgm-seek" type="range" min="0" max="1" step="0.1" value="0" aria-label="재생 위치" disabled>
    </div>
    <label class="bgm-volume"><span aria-hidden="true">VOL</span>
      <input type="range" min="0" max="1" step="0.05" value="0.35" aria-label="배경 음악 볼륨">
    </label>`;
  brand.after(player);

  const audio = new Audio("assets/amber-archive.mp3");
  const toggle = player.querySelector(".bgm-toggle");
  const time = player.querySelector(".bgm-time");
  const seek = player.querySelector(".bgm-seek");
  const volume = player.querySelector(".bgm-volume input");
  audio.volume = saved.volume ?? Number(volume.value);
  volume.value = audio.volume;

  function save() {
    try { sessionStorage.setItem(key, JSON.stringify({ mode, position, volume: audio.volume })); } catch {}
  }

  function clock(seconds) {
    if (!Number.isFinite(seconds)) return "--:--";
    return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
  }

  function render() {
    const paused = audio.paused || audio.ended;
    toggle.textContent = paused ? "▶" : "Ⅱ";
    toggle.setAttribute("aria-label", audio.ended || mode === "ended"
      ? "배경 음악 다시 재생" : paused ? "배경 음악 재생" : "배경 음악 일시정지");
    time.textContent = clock(position) + " / " + clock(audio.duration);
    seek.value = position;
  }

  function play() {
    audio.play().catch(render);
  }

  audio.addEventListener("loadedmetadata", () => {
    if (!Number.isFinite(audio.duration)) return;
    seek.max = audio.duration;
    seek.disabled = false;
    position = mode === "ended" ? audio.duration : Math.min(position, audio.duration);
    audio.currentTime = position;
    render();
    if (mode === "playing") play();
  });
  audio.addEventListener("play", () => { mode = "playing"; save(); render(); });
  audio.addEventListener("pause", render);
  audio.addEventListener("timeupdate", () => { position = audio.currentTime; render(); });
  audio.addEventListener("ended", () => { mode = "ended"; save(); render(); });
  audio.addEventListener("error", () => {
    toggle.disabled = true;
    seek.disabled = true;
    time.textContent = "불러오기 실패";
  });

  toggle.addEventListener("click", () => {
    if (!audio.paused && !audio.ended) {
      mode = "paused";
      audio.pause();
      save();
    } else {
      if (audio.ended || mode === "ended") {
        position = 0;
        audio.currentTime = 0;
      }
      mode = "playing";
      play();
    }
  });
  seek.addEventListener("input", () => {
    position = Number(seek.value);
    audio.currentTime = position;
    if (mode === "ended") mode = "paused";
    save();
    render();
  });
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    save();
  });
  window.addEventListener("pagehide", save);
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) location.reload();
  });
  render();
})();

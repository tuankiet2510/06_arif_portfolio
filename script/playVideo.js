export function initVideoPlayer(videoSelector, btnSelector, progressSelector) {
  const video = document.querySelector(videoSelector);
  const playBtn = document.querySelector(btnSelector);
  const progressBar = document.querySelector(progressSelector);
  const progressContainer = progressBar.parentElement;
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const volumeEl = document.getElementById("volume");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const videoControls = document.querySelector(".video-controls"); // lấy controls
  const videoWrapper = document.querySelector(".video-player");

  //   const playSVG = `
  //     <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  // <path d="M14.4462 10.6965C14.3614 10.7835 14.0414 11.1555 13.7433 11.4615C11.9956 13.386 7.43643 16.536 5.05017 17.4975C4.68777 17.652 3.77155 17.979 3.28203 18C2.81296 18 2.36581 17.892 1.93911 17.673C1.40721 17.367 0.980516 16.8855 0.746712 16.317C0.596201 15.9225 0.362397 14.742 0.362397 14.721C0.128592 13.4295 0 11.331 0 9.012C0 6.8025 0.128592 4.7895 0.320019 3.4785C0.341939 3.4575 0.575743 1.9905 0.831466 1.488C1.30054 0.57 2.21676 0 3.19727 0H3.28203C3.9206 0.0225 5.26352 0.5925 5.26352 0.6135C7.52119 1.5765 11.9752 4.572 13.7652 6.5625C13.7652 6.5625 14.2694 7.074 14.4886 7.3935C14.8305 7.8525 15 8.421 15 8.9895C15 9.624 14.8086 10.215 14.4462 10.6965Z" fill="#5D3BEE"/>
  // </svg>

  //   `;

  //   const pauseSVG = `
  //     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 5V19M16 5V19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  //   `;
  const playSVG = `<img src="./assets/img/play-video.svg" alt="Play" class="video-icon" />`;
  const pauseSVG = `<img src="./assets/img/pause-video-1.svg" alt="Pause" class="video-icon" />`;

  function showAndFade(icon) {
    playBtn.innerHTML = icon;
    playBtn.classList.remove("hidden");
    setTimeout(() => {
      playBtn.classList.add("hidden");
    }, 500);
  }
  // gom logic play/pause vào 1 hàm
  function togglePlay() {
    if (video.paused) {
      video.play();
      showAndFade(playSVG);
    } else {
      video.pause();
      showAndFade(pauseSVG);
    }
  }
  //   playBtn.addEventListener("click", () => {
  //     if (video.paused) {
  //       video.play();
  //       showAndFade(playSVG);
  //     } else {
  //       video.pause();
  //       showAndFade(pauseSVG);
  //     }
  //   });
  function showProgress() {
    progressContainer.classList.add("visible");
  }
  function hideProgress() {
    progressContainer.classList.remove("visible");
  }
  function showControls() {
    videoControls.classList.add("visible");
  }
  function hideControls() {
    videoControls.classList.remove("visible");
  }
  function scheduleHideControls(delay = 3000) {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideControls();
    }, delay);
  }
  // dùng chung hàm togglePlay cho cả nút và video
  playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);
  // dừng video thì hiện control r ẩn sau 3s
  video.addEventListener("pause", () => {
    showAndFade(pauseSVG);
    showControls();
    scheduleHideControls(3000);
  });
  // khi video play thì hiện control rồi auto-hide
  video.addEventListener("play", () => {
    showAndFade(playSVG);
    showControls();
    scheduleHideControls(500);
  });

  let hideTimeout;
  // rê chuột vào video
  video.addEventListener("mouseenter", () => {
    showControls();
    scheduleHideControls(3000); // sau 3s tự ẩn nếu không làm gì
  });
  videoWrapper.addEventListener("mouseleave", () => {
    scheduleHideControls(500); // rời chuột thì ẩn nhanh sau 0.5s
  });
  videoWrapper.addEventListener("mousemove", () => {
    showControls();
    scheduleHideControls(3000); // reset lại auto-hide mỗi lần di chuột
  });
  videoWrapper.addEventListener("touchstart", () => {
    showControls();
    scheduleHideControls(3000);
  }); // auto-hide sau 3s
  // Update progress bar + thời gian
  video.addEventListener("timeupdate", () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", percent);

    // format thời gian
    function formatTime(sec) {
      if (isNaN(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    currentTimeEl.textContent = formatTime(video.currentTime);
    durationEl.textContent = formatTime(video.duration);
  });

  // Click để tua
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * video.duration;
    video.currentTime = newTime;
  });

  // Âm lượng
  if (volumeEl) {
    volumeEl.addEventListener("input", () => {
      video.volume = volumeEl.value;
    });
    video.volume = volumeEl.value; // đặt mặc định theo slider
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
}

import { initVideoPlayer } from "./playVideo.js";
import { toggleStickyHeader } from "./toggle_sticky_header.js";
import { carouselHandler } from "./carouselHandler.js";
document.addEventListener("DOMContentLoaded", () => {
  initVideoPlayer("#myVideo", "#playBtn", "#progressBar");
  toggleStickyHeader(".header", ".footer");
  carouselHandler();
});

// turn item from block to carousel when width under lg
// turn back to block when upper lg
if (window.innerWidth < 992) {
  // init carousel (ví dụ Swiper hoặc Bootstrap Carousel)
} else {
  // destroy carousel, để grid hiển thị
}

export function carouselHandler() {
  const projectCarousel = document.getElementById("projectCarousel");
  const projectRow = projectCarousel.querySelector(".project-row");
  let carouselInstance;

  function createIndicators(itemsCount) {
    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators projectCarousel-indicators";
    for (let i = 0; i < itemsCount; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      //btn.classList.add("projectCarousel-indicator", "project-indicator");
      btn.className = "projectCarousel-indicator carousel-indicator";
      btn.setAttribute("data-bs-target", "#projectCarousel");
      btn.setAttribute("data-bs-slide-to", i);
      // btn.className = i === 0 ? "active" : "";
      if (i === 0) btn.className += " active";
      indicators.appendChild(btn);
    }
    return indicators;
  }

  function createControls() {
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-control-prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("data-bs-target", "#projectCarousel");
    prevBtn.setAttribute("data-bs-slide", "prev");
    prevBtn.innerHTML = '<span class="carousel-control-prev-icon"></span>';

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-control-next";
    nextBtn.type = "button";
    nextBtn.setAttribute("data-bs-target", "#projectCarousel");
    nextBtn.setAttribute("data-bs-slide", "next");
    nextBtn.innerHTML = '<span class="carousel-control-next-icon"></span>';

    return [prevBtn, nextBtn];
  }

  function initCarousel() {
    if (!carouselInstance) {
      projectCarousel.classList.add("carousel", "slide");
      projectRow.classList.add("carousel-inner");
      projectCarousel.setAttribute("data-bs-ride", "carousel");
      const items = projectRow.querySelectorAll(".project-item");
      items.forEach((item, index) => {
        item.classList.add("carousel-item");
        if (index === 0) item.classList.add("active");
      });

      // thêm indicators
      const indicators = createIndicators(items.length);
      projectCarousel.insertBefore(indicators, projectRow);

      // thêm controls
      const [prevBtn, nextBtn] = createControls();
      projectCarousel.appendChild(prevBtn);
      projectCarousel.appendChild(nextBtn);

      // khởi tạo với cùng config như các carousel khác
      carouselInstance = new bootstrap.Carousel(projectCarousel, {
        interval: 5000,
        wrap: true,
        keyboard: true,
        pause: "hover",
        touch: true,
      });

      console.log("Project Config:", safeDebugCarousel("projectCarousel"));

      // Chờ một chút rồi compare
      setTimeout(() => {
        console.log("Service Config:", safeDebugCarousel("serviceCarousel"));
      }, 200);
    }
  }

  function destroyCarousel() {
    if (carouselInstance) {
      carouselInstance.dispose();
      carouselInstance = null;

      projectCarousel.classList.remove("carousel", "slide");
      projectCarousel.removeAttribute("data-bs-ride", "carousel");
      projectRow.classList.remove("carousel-inner");

      projectRow.querySelectorAll(".project-item").forEach((item) => {
        item.classList.remove("carousel-item", "active");
      });

      // xóa indicators & controls
      projectCarousel
        .querySelectorAll(".carousel-indicators, .carousel-control-prev, .carousel-control-next")
        .forEach((el) => el.remove());
    }
  }

  function checkViewport() {
    if (window.innerWidth < 992) {
      initCarousel();
    } else {
      destroyCarousel();
    }
  }
  function safeDebugCarousel(carouselId) {
    const element = document.getElementById(carouselId);

    if (!element) {
      console.warn(`❌ Element #${carouselId} not found`);
      return null;
    }

    const instance = bootstrap.Carousel.getInstance(element);

    if (!instance) {
      console.warn(`⚠️ No carousel instance for #${carouselId} yet`);
      return null;
    }

    console.group(`📊 ${carouselId} Debug Info`);
    console.table({
      interval: instance._config.interval,
      wrap: instance._config.wrap,
      keyboard: instance._config.keyboard,
      pause: instance._config.pause,
      touch: instance._config.touch,
      ride: instance._config.ride,
    });
    console.groupEnd();

    return instance._config;
  }
  checkViewport();
  window.addEventListener("resize", checkViewport);
}

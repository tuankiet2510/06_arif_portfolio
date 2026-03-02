// khi scroll đến footer thì bỏ header không còn sticky
export function toggleStickyHeader(headerSelector, footerSelector) {
  const header = document.querySelector(headerSelector);
  const footer = document.querySelector(footerSelector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          header.classList.remove("fixed-header"); // bỏ sticky
        } else {
          header.classList.add("fixed-header"); // thêm sticky lại
        }
      });
    },
    { threshold: 0 },
  );

  observer.observe(footer);
}

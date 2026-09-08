(function () {
  const nav = document.getElementById("nav");
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("mobilePanel");

  if (nav && !nav.classList.contains("nav-solid")) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (btn && panel) {
    btn.addEventListener("click", () => {
      const open = panel.style.display === "block";
      panel.style.display = open ? "none" : "block";
      btn.setAttribute("aria-expanded", String(!open));
    });
  }

  const video = document.getElementById("heroVideo");
  if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
  }

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel-track");
    if (!track) return;
    const step = () => Math.min(380, track.clientWidth * 0.85);
    root.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    root.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  });
})();

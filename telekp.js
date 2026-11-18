(function () {
  "use strict";

const css = `
a.kfp88-tg-float {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 50%;
  background: #0088cc;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  animation: kfp88-tg-pulse 1.5s ease-out infinite;
}

a.kfp88-tg-float svg {
  display: block;
  flex-shrink: 0;
  fill: #ffffff;
  max-width: none;
  max-height: none;
}

/* =====================================
   DESKTOP
   ===================================== */

@media (min-width: 769px) {
  a.kfp88-tg-float {
    width: 50px;      /* Lebar tombol */
    height: 50px;     /* Tinggi tombol */
    bottom: 85px;    /* Jarak dari bawah */
    left: 23px;       /* Jarak dari kiri */
  }

  a.kfp88-tg-float svg {
    width: 35px;      /* Lebar ikon */
    height: 35px;     /* Tinggi ikon */
  }
}

/* =====================================
   MOBILE - 768px KE BAWAH
   ===================================== */

@media (max-width: 768px) {
  a.kfp88-tg-float {
    width: 50px;      /* Lebar tombol */
    height: 50px;     /* Tinggi tombol */
    bottom: 122px;     /* Jarak dari bawah */
    left: 18px;       /* Jarak dari kiri */
  }

  a.kfp88-tg-float svg {
    width: 35px;      /* Lebar ikon */
    height: 35px;     /* Tinggi ikon */
  }
}

/* =====================================
   ANIMASI PULSE
   ===================================== */

@keyframes kfp88-tg-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0,136,204,0.5);
  }

  100% {
    box-shadow: 0 0 0 14px rgba(0,136,204,0);
  }
}

/* =====================================
   AKSESIBILITAS
   ===================================== */

@media (prefers-reduced-motion: reduce) {
  a.kfp88-tg-float {
    animation: none;
  }
}
`;

const html= `
<a
  class="kfp88-tg-float"
  href="https://t.me/Offcial_Kungfupanda88"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Hubungi kami melalui Telegram"
>
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M56.4,8.2l-51.2,20c-1.7,0.6-1.6,3,0.1,3.5l9.7,2.9c2.1,0.6,3.8,2.2,4.4,4.3l3.8,12.1c0.5,1.6,2.5,2.1,3.7,0.9l5.2-5.3c0.9-0.9,2.2-1,3.2-0.3l11.5,8.4c1.6,1.2,3.9,0.3,4.3-1.7l8.7-41.8C60.4,9.1,58.4,7.4,56.4,8.2z M50,17.4L29.4,35.6c-1.1,1-1.9,2.4-2,3.9c-0.2,1.5-2.3,1.7-2.8,0.3l-0.9-3c-0.7-2.2,0.2-4.5,2.1-5.7l23.5-14.6C49.9,16.1,50.5,16.9,50,17.4z"/>
  </svg>
</a>
`;

function init() {
    if (document.getElementById("kfp88-tg-button")) return;

  if (!document.getElementById("kfp88-tg-style")) {
    const style = document.createElement("style");
    style.id = "kfp88-tg-style";
    style.textContent = css;
    document.head.appendChild(style);
 }

    const container = document.createElement("div");
    container.innerHTML = html.trim();

    const button = container.firstElementChild;
    button.id = "kfp88-tg-button";

    document.body.appendChild(button);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }

})();
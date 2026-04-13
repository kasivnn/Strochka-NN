const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealItems = document.querySelectorAll(".reveal");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxClose = document.querySelector(".lightbox-close");
const requestForm = document.getElementById("request-form");
const formNote = document.getElementById("form-note");
const captchaQuestion = document.getElementById("captcha-question");
const captchaAnswer = document.getElementById("captcha-answer");
const captchaRefresh = document.getElementById("captcha-refresh");
let captchaResult = null;

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const openLightbox = (src, title, alt) => {
  if (!lightbox || !lightboxImage || !lightboxTitle) {
    return;
  }

  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxTitle.textContent = title;
  lightbox.classList.add("is-active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  lightboxImage.src = "";
};

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    openLightbox(item.dataset.image, item.dataset.title || "", image?.alt || "");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-active")) {
    closeLightbox();
  }
});

const renderCaptcha = () => {
  const first = Math.floor(Math.random() * 8) + 2;
  const second = Math.floor(Math.random() * 8) + 2;
  const useAddition = Math.random() > 0.5;

  captchaResult = useAddition ? first + second : first * second;

  if (captchaQuestion) {
    captchaQuestion.textContent = useAddition
      ? `Сколько будет ${first} + ${second}?`
      : `Сколько будет ${first} × ${second}?`;
  }

  if (captchaAnswer) {
    captchaAnswer.value = "";
  }
};

captchaRefresh?.addEventListener("click", renderCaptcha);

renderCaptcha();

requestForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(requestForm);
  const name = (formData.get("name") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const comment = (formData.get("comment") || "").toString().trim();
  const captchaValue = Number((formData.get("captcha") || "").toString().trim());

  if (!Number.isFinite(captchaValue) || captchaValue !== captchaResult) {
    if (formNote) {
      formNote.textContent = "Проверка CAPTCHA не пройдена. Введите правильный ответ.";
    }

    captchaAnswer?.focus();
    renderCaptcha();
    return;
  }

  const subject = encodeURIComponent("Заявка с сайта Строчка-НН");
  const body = encodeURIComponent(
    `Имя: ${name}\nТелефон: ${phone}\nКомментарий: ${comment || "Не указан"}`
  );

  if (formNote) {
    formNote.textContent = "Открываем письмо в почтовом приложении для отправки заявки.";
  }

  requestForm.reset();
  renderCaptcha();
  window.location.href = `mailto:natalkann@yandex.ru?subject=${subject}&body=${body}`;
});

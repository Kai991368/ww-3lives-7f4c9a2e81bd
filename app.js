const chapters = [
  { container: "gallery-first", start: 1, end: 9 },
  { container: "gallery-second", start: 10, end: 25 },
  { container: "gallery-third", start: 26, end: 36 },
];

const allPhotos = Array.from({ length: 36 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    full: `public/photos/${number}.jpg`,
    thumb: `public/thumbs/${number}.jpg`,
    number,
    landscape: [7, 10, 31].includes(index + 1),
  };
});

const opening = document.querySelector("#opening");
const enterStory = document.querySelector("#enter-story");
const revealLetter = document.querySelector("#reveal-letter");
const promise = document.querySelector("#promise");
const letter = document.querySelector("#letter");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCount = document.querySelector("#lightbox-count");
const filmModal = document.querySelector("#film-modal");
const storyFilm = document.querySelector("#story-film");
let activePhoto = 0;
let soundtrack = null;

for (const chapter of chapters) {
  const container = document.getElementById(chapter.container);
  for (let index = chapter.start; index <= chapter.end; index += 1) {
    const photo = allPhotos[index - 1];
    const frame = document.createElement("button");
    frame.type = "button";
    frame.className = `photo-frame${photo.landscape ? " is-landscape" : ""}`;
    frame.dataset.number = photo.number;
    frame.dataset.index = String(index - 1);
    frame.setAttribute("aria-label", `查看第 ${index} 张照片`);
    frame.innerHTML = `
      <img class="photo-frame__backdrop" src="${photo.thumb}" data-src="${photo.full}" alt="" loading="lazy" />
      <span class="photo-frame__glow" aria-hidden="true"></span>
      <img class="photo-frame__portrait" src="${photo.thumb}" data-src="${photo.full}" alt="雯雯与牛牛爸爸的三生三世主题照片 ${index}" loading="lazy" />
      <span class="photo-frame__caption">${index <= 9 ? "第一世" : index <= 25 ? "第二世" : "今生"}</span>`;
    frame.addEventListener("click", () => showPhoto(index - 1));
    container.append(frame);
  }
}

const mosaic = document.querySelector("#letter-mosaic");
for (const [index, photo] of allPhotos.entries()) {
  const image = document.createElement("img");
  image.src = photo.thumb;
  image.alt = "";
  image.loading = "lazy";
  image.style.setProperty("--order", String(index));
  mosaic.append(image);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const images = entry.target.querySelectorAll("img[data-src]");
        for (const image of images) {
          if (image.dataset.src) {
            image.src = image.dataset.src;
            delete image.dataset.src;
          }
        }
      }
    }
  },
  { rootMargin: "0px 0px -12%", threshold: 0.12 },
);

document.querySelectorAll(".reveal, .photo-frame").forEach((element) => revealObserver.observe(element));

const chapterObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = Number(visible.target.dataset.chapter);
    document.querySelectorAll(".story-nav__mark").forEach((mark, markIndex) => {
      mark.classList.toggle("is-active", markIndex === index);
    });
  },
  { threshold: [0.25, 0.5, 0.75] },
);

document.querySelectorAll(".chapter").forEach((chapter) => chapterObserver.observe(chapter));

enterStory.addEventListener("click", async () => {
  opening.classList.add("is-open");
  document.body.classList.add("story-open");
  document.querySelector("#chapter-one").scrollIntoView();
  await initializeSoundtrack();
});

document.querySelectorAll(".story-nav__mark").forEach((mark) => {
  mark.addEventListener("click", () => document.getElementById(mark.dataset.target).scrollIntoView());
});

revealLetter.addEventListener("click", () => {
  promise.classList.add("is-revealed");
  letter.setAttribute("aria-hidden", "false");
});

let scrollTicking = false;
function updatePhotoMotion() {
  const viewportCenter = window.innerHeight / 2;
  for (const frame of document.querySelectorAll(".photo-frame.is-visible")) {
    const rect = frame.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight));
    frame.style.setProperty("--drift", progress.toFixed(3));
  }
  scrollTicking = false;
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(updatePhotoMotion);
    scrollTicking = true;
  }
}, { passive: true });

function showPhoto(index) {
  activePhoto = (index + allPhotos.length) % allPhotos.length;
  const photo = allPhotos[activePhoto];
  lightboxImage.src = photo.full;
  lightboxImage.alt = `雯雯与恋人的三生三世主题照片 ${activePhoto + 1}`;
  lightboxCount.textContent = `${photo.number} / 36`;
  if (!lightbox.open) lightbox.showModal();
}

document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(activePhoto - 1));
document.querySelector("#next-photo").addEventListener("click", () => showPhoto(activePhoto + 1));
document.querySelector("#close-lightbox").addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

document.querySelector("#open-film").addEventListener("click", () => {
  filmModal.showModal();
  storyFilm.play().catch(() => {});
  soundtrack?.pause();
});

document.querySelector("#close-film").addEventListener("click", () => {
  storyFilm.pause();
  filmModal.close();
  if (soundtrack && !document.querySelector("#toggle-sound").classList.contains("is-muted")) {
    soundtrack.play().catch(() => {});
  }
});

filmModal.addEventListener("click", (event) => {
  if (event.target === filmModal) document.querySelector("#close-film").click();
});

async function initializeSoundtrack() {
  try {
    const response = await fetch("public/audio/bgm.mp3", { method: "HEAD" });
    if (!response.ok) return;
    soundtrack = new Audio("public/audio/bgm.mp3");
    soundtrack.loop = true;
    soundtrack.volume = 0.42;
    const toggle = document.querySelector("#toggle-sound");
    toggle.hidden = false;
    await soundtrack.play();
    toggle.addEventListener("click", () => {
      if (soundtrack.paused) {
        soundtrack.play().catch(() => {});
        toggle.classList.remove("is-muted");
      } else {
        soundtrack.pause();
        toggle.classList.add("is-muted");
      }
    });
  } catch {
    // The visual experience remains complete before a final soundtrack is selected.
  }
}

const chapters = [
  { container: "gallery-first", start: 1, end: 9 },
  { container: "gallery-second", start: 10, end: 25 },
  { container: "gallery-third", start: 26, end: 36 },
];

const photoStories = [
  { chapter: "第一世", line: "初见那一刻，我就知道，往后的故事里会有你。", motion: "reveal" },
  { chapter: "第一世", line: "山水很远，你一靠近，便成了我眼前的全部。", motion: "drift-left" },
  { chapter: "第一世", line: "若前世有约，大概就是这样并肩站在岁月里。", motion: "focus" },
  { chapter: "第一世", line: "隔着旧时光，我还是一眼认出了你。", motion: "veil" },
  { chapter: "第一世", line: "你向我走来，连漫长的等待都有了答案。", motion: "drift-right" },
  { chapter: "第一世", line: "一盏红灯照见人间，也照见我想牵住的手。", motion: "lantern" },
  { chapter: "第一世", line: "不必说山盟海誓，相望一眼便胜过千言。", motion: "parallax" },
  { chapter: "第一世", line: "这一程我背着你走，也想把一生的风雨都挡在身后。", motion: "float" },
  { chapter: "第一世", line: "你在身旁安静一坐，岁月便有了最温柔的模样。", motion: "reveal" },
  { chapter: "第二世", line: "人间最好的欢喜，是我们笑着闯进彼此的镜头。", motion: "silk" },
  { chapter: "第二世", line: "花会枯萎，而你看向我的笑意会一直留在心里。", motion: "focus" },
  { chapter: "第二世", line: "你靠近的这一瞬，喧闹的人间忽然只剩心跳。", motion: "drift-left" },
  { chapter: "第二世", line: "这束花送给你，也把我所有认真和偏爱都交给你。", motion: "curtain" },
  { chapter: "第二世", line: "往后的日子一起招手，把每一天都过成小欢喜。", motion: "parallax" },
  { chapter: "第二世", line: "你站在我身前，我就有了想守护一生的答案。", motion: "silk" },
  { chapter: "第二世", line: "你把手搭在我肩上，我便觉得全世界都很安稳。", motion: "float" },
  { chapter: "第二世", line: "爱是并肩，也是我愿意在你身边安心地坐下来。", motion: "reveal" },
  { chapter: "第二世", line: "你抬头看我时，我连余生该去哪里都想好了。", motion: "drift-right" },
  { chapter: "第二世", line: "愿我们牵着同一份欢喜，把寻常日子走得热烈。", motion: "lantern" },
  { chapter: "第二世", line: "红气球会飞向天空，我的心却只想落在你这里。", motion: "parallax" },
  { chapter: "第二世", line: "你抱着满怀欢喜，我站在一旁偷偷看我们的未来。", motion: "veil" },
  { chapter: "第二世", line: "愿你永远像此刻明亮，而我永远是接住你笑容的人。", motion: "focus" },
  { chapter: "第二世", line: "你把快乐举得很高，我把你放在心里最重要的位置。", motion: "silk" },
  { chapter: "第二世", line: "你比出心的形状，而我早已把整颗心交给了你。", motion: "curtain" },
  { chapter: "第二世", line: "从这一束花开始，把每一次靠近都写成我们的喜事。", motion: "drift-left" },
  { chapter: "今生", line: "这一身白纱，是我终于等到你的最好证明。", motion: "veil" },
  { chapter: "今生", line: "镜头定格了笑容，也定格了我想陪你到老的决定。", motion: "parallax" },
  { chapter: "今生", line: "回头看，走过的每一步都在把我们带向彼此。", motion: "drift-right" },
  { chapter: "今生", line: "你低头看花，我抬眼看你，各自珍藏着同一份幸福。", motion: "focus" },
  { chapter: "今生", line: "离得这样近，才发现喜欢你这件事还可以更深。", motion: "reveal" },
  { chapter: "今生", line: "我牵着你的手，也牵住了往后所有清晨与晚归。", motion: "float" },
  { chapter: "今生", line: "和你一起做点傻事，就是我最舍不得结束的浪漫。", motion: "curtain" },
  { chapter: "今生", line: "转身之后仍然是你，这就是我想要的长长久久。", motion: "drift-left" },
  { chapter: "今生", line: "这一枚戒指很小，却装得下我对余生所有的认真。", motion: "focus" },
  { chapter: "今生", line: "我们并肩坐在这里，像坐进了未来每一个平凡日子。", motion: "veil" },
  { chapter: "今生", line: "三生太远，我只想先把这一生好好交给你。", motion: "reveal" },
];

const allPhotos = photoStories.map((story, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    ...story,
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
const lightboxLine = document.querySelector("#lightbox-line");
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
    frame.className = `photo-frame motion-${photo.motion}${photo.landscape ? " is-landscape" : ""}`;
    frame.dataset.number = photo.number;
    frame.dataset.index = String(index - 1);
    frame.setAttribute("aria-label", `查看第 ${index} 张照片：${photo.line}`);
    frame.innerHTML = `
      <img class="photo-frame__backdrop" src="${photo.thumb}" data-src="${photo.full}" alt="" loading="lazy" />
      <span class="photo-frame__glow" aria-hidden="true"></span>
      <img class="photo-frame__portrait" src="${photo.thumb}" data-src="${photo.full}" alt="雯雯与牛牛爸爸的三生三世主题照片 ${index}" loading="lazy" />
      <span class="photo-frame__copy">
        <span class="photo-frame__chapter">${photo.chapter}</span>
        <span class="photo-frame__line">${photo.line}</span>
      </span>
      <span class="photo-frame__ornament" aria-hidden="true"></span>`;
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
  lightboxLine.textContent = photo.line;
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

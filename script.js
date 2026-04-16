// ── Home 마우스 트레일 ──
const homeWrap       = document.getElementById('homeWrap');
const trailContainer = document.getElementById('trailContainer');

const trailSrcs = [
  '!20191002_231730718_15.jpg',
  '1561739715751.JPEG',
  '719050714.775169.JPEG',
  'ADDAE855-B964-45ED-ADFC-D0E735646236.JPEG',
  'DSCF3323.JPG',
  'IMG_0924.PNG',
  'IMG_1799.JPEG',
  'IMG_2062.JPEG',
  'IMG_2437.PNG',
  'IMG_2663.JPEG',
  'IMG_2741.PNG',
  'IMG_4219.JPEG',
  'IMG_4930.JPEG',
  'IMG_4951.JPEG',
  'IMG_5049.JPEG',
  'IMG_5079.JPEG',
  'IMG_5576.PNG',
  'IMG_5830.JPEG',
  'IMG_6873.JPEG',
  'IMG_9174.JPEG',
  'IMG_9274.JPEG',
  'IMG_9798.JPEG',
  'IMG_9812.JPEG',
  'IMG_AF55CC96-CBB9-4195-AB78-A71FEEF22D73.JPEG',
  'KakaoTalk_20191002_231611016_25.jpg',
  'KakaoTalk_20191002_231611016_28.JPEG',
  'd63f1caa5cd888b8ae2b376321866227.jpg',
  'f9d8e36718df0c4dd9b8d3fb4c9ade91.jpg',
  'sct_DSCF7653.jpg',
  'sct_DSCF7712.jpg',
  '스크린샷 2026-04-13 오후 5.16.37.png',
].map(f => `images/about/${encodeURIComponent(f)}`);

let lastTrailX  = null;
let lastTrailY  = null;
let trailIndex  = 0;
const TRAIL_MIN_DIST = 80;
const TRAIL_MAX      = 30;

document.addEventListener('mousemove', (e) => {
  const projectSection = document.getElementById('project');
  if (!projectSection.classList.contains('active')) return;
  if (window.innerWidth <= 768) return;

  const rect = homeWrap.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (lastTrailX !== null) {
    const dist = Math.hypot(x - lastTrailX, y - lastTrailY);
    if (dist < TRAIL_MIN_DIST) return;
  }
  lastTrailX = x;
  lastTrailY = y;

  const el  = document.createElement('div');
  el.className = 'trail-image';

  const src  = trailSrcs[trailIndex % trailSrcs.length];
  const size = 180;
  const rot  = (Math.random() - 0.5) * 20;

  el.style.cssText = `
    left: ${x - size / 2}px;
    top:  ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    transform: rotate(${rot}deg);
    background-image: url('${src}');
    z-index: ${trailIndex + 1};
  `;

  trailContainer.appendChild(el);
  trailIndex++;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('visible');
      setTimeout(() => {
        el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1)';
        el.style.transform  = `rotate(${rot}deg) scale(0)`;
        setTimeout(() => { el.remove(); }, 300);
      }, 1000);
    });
  });
});

// ── 모바일 탭 터치: 사진 하나씩 등장 ──
let mobileTapIndex = 0;
let mobileTapSrcs  = [];

homeWrap.addEventListener('touchend', (e) => {
  if (window.innerWidth > 768) return;
  if (!document.getElementById('project').classList.contains('active')) return;

  const touch = e.changedTouches[0];
  const rect  = homeWrap.getBoundingClientRect();
  const x     = touch.clientX - rect.left;
  const y     = touch.clientY - rect.top;

  const src  = mobileTapSrcs[mobileTapIndex % mobileTapSrcs.length];
  const size = 120;
  const rot  = (Math.random() - 0.5) * 30;

  const el = document.createElement('div');
  el.style.cssText = `
    position: absolute;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    transform: rotate(${rot}deg) scale(0.75);
    background-image: url('${src}');
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    z-index: ${mobileTapIndex + 1};
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;
  trailContainer.appendChild(el);
  mobileTapIndex++;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = `rotate(${rot}deg) scale(1)`;
    });
  });
});

// ── 탭 전환 ──
const tabs     = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');

    if (target === 'project') {
      trailContainer.innerHTML = '';
      lastTrailX = null;
      lastTrailY = null;
      trailIndex = 0;
      mobileTapIndex = 0;
      mobileTapSrcs  = [...trailSrcs].sort(() => Math.random() - 0.5);
    }
  });
});

// ── 사이드 패널 ──
const sidePanel  = document.getElementById('sidePanel');
const overlay    = document.getElementById('panelOverlay');
const spClose    = document.getElementById('spClose');
const spTitle    = document.getElementById('spTitle');
const spCategory = document.getElementById('spCategory');
const spYear     = document.getElementById('spYear');
const spDesc     = document.getElementById('spDesc');
const spGallery  = document.getElementById('spGallery');

function openPanel(item) {
  const title    = item.dataset.title    || '';
  const year     = item.dataset.year     || '';
  const category = item.dataset.category || '';
  const desc     = item.dataset.desc     || '';
  const images   = item.dataset.images   ? item.dataset.images.split(',') : [];

  spTitle.textContent    = title;
  spCategory.textContent = category;
  spYear.textContent     = year;
  spDesc.textContent     = desc;

  // 갤러리 채우기
  spGallery.innerHTML = '';
  const count = images.length || 4;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sp-gallery-item';
    if (images[i]) {
      el.style.backgroundImage = `url('${images[i]}')`;
    }
    spGallery.appendChild(el);
  }

  overlay.classList.add('active');
  sidePanel.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  overlay.classList.remove('active');
  sidePanel.classList.remove('active');
  document.body.style.overflow = '';
}

const homeItems = document.querySelectorAll('#home .home-card-wrap[data-title]');
homeItems.forEach((item) => {
  item.addEventListener('click', () => openPanel(item));
});

// ── Home 카드 사이즈 전환 (버튼 + 드래그 네비게이션) ──
(function initHomeCards() {
  const grid  = document.querySelector('#home .home-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.home-card-wrap')];
  if (!cards.length) return;

  const PADDING   = 32;
  let currentIdx  = 0;
  let isUpdating  = false;

  // 드래그 상태
  let isDragging      = false;
  let dragStartX      = 0;
  let dragStartScroll = 0;
  let hasDragged      = false;

  function applyClasses(idx) {
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-second', 'is-third');
      if      (i === idx)     card.classList.add('is-active');
      else if (i === idx + 1) card.classList.add('is-second');
      else if (i === idx + 2) card.classList.add('is-third');
    });
  }

  function updateButtons() {
    const prev = document.getElementById('homePrev');
    const next = document.getElementById('homeNext');
    if (prev) prev.classList.toggle('is-hidden', currentIdx === 0);
    if (next) next.classList.toggle('is-hidden', currentIdx >= cards.length - 1);
  }

  function navigateTo(newIdx) {
    if (isUpdating) return;
    newIdx = Math.max(0, Math.min(newIdx, cards.length - 1));
    isUpdating = true;

    const prevBox = cards[currentIdx]?.querySelector('.home-card-img-box');

    if (newIdx !== currentIdx) {
      if (prevBox) prevBox.style.transition = 'none';
      currentIdx = newIdx;
      applyClasses(currentIdx);
      updateButtons();
    }

    requestAnimationFrame(() => {
      grid.scrollLeft = cards[currentIdx].offsetLeft - PADDING;
      if (prevBox) {
        requestAnimationFrame(() => { prevBox.style.transition = ''; });
      }
      setTimeout(() => { isUpdating = false; }, 600);
    });
  }

  function snapToNearest() {
    const scroll = grid.scrollLeft;
    let nearestIdx = 0;
    let nearestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card.offsetLeft - PADDING) - scroll);
      if (dist < nearestDist) { nearestDist = dist; nearestIdx = i; }
    });
    navigateTo(nearestIdx);
  }

  // 초기 상태
  applyClasses(0);
  updateButtons();

  // 버튼 네비게이션
  document.getElementById('homePrev')
    ?.addEventListener('click', () => navigateTo(currentIdx - 1));
  document.getElementById('homeNext')
    ?.addEventListener('click', () => navigateTo(currentIdx + 1));

  // 드래그 스크롤
  grid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    hasDragged = false;
    dragStartX = e.clientX;
    dragStartScroll = grid.scrollLeft;
    grid.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 4) hasDragged = true;
    grid.scrollLeft = dragStartScroll - dx;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    grid.style.cursor = '';
    if (hasDragged) snapToNearest();
  });

  // 드래그 중 카드 클릭 이벤트 차단
  grid.addEventListener('click', (e) => {
    if (hasDragged) { e.stopPropagation(); hasDragged = false; }
  }, true);
})();

spClose.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// ── 바텀 시트 스크롤바: 스크롤 시에만 표시 ──
const sidePanelInner = document.querySelector('.side-panel-inner');
let scrollbarHideTimer;
sidePanelInner.addEventListener('scroll', () => {
  sidePanelInner.classList.add('is-scrolling');
  clearTimeout(scrollbarHideTimer);
  scrollbarHideTimer = setTimeout(() => {
    sidePanelInner.classList.remove('is-scrolling');
  }, 1000);
});

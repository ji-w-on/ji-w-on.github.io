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
      // About 탭 진입 시 트레일 초기화
      trailContainer.innerHTML = '';
      lastTrailX = null;
      lastTrailY = null;
      trailIndex = 0;
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
const spLabel    = document.getElementById('spLabel');
const spImage    = document.getElementById('spImage');
const spDesc     = document.getElementById('spDesc');

function openPanel(item, index, total) {
  const title    = item.dataset.title    || '';
  const year     = item.dataset.year     || '';
  const category = item.dataset.category || '';
  const color    = item.dataset.color    || '#d8d6d0';
  const desc     = item.dataset.desc     || '';

  spTitle.textContent       = title;
  spCategory.textContent    = category;
  spYear.textContent        = year;
  spLabel.textContent       = `${String(index + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  spImage.style.background  = color;
  spDesc.textContent        = desc;

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
homeItems.forEach((item, i) => {
  item.addEventListener('click', () => openPanel(item, i, homeItems.length));
});

// ── Home 카드 사이즈 전환 ──
(function initHomeCards() {
  const grid  = document.querySelector('#home .home-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.home-card-wrap')];
  if (!cards.length) return;

  const PADDING = 32;
  let isUpdating = false;
  let scrollTimer;

  function getActiveIdx() {
    const scroll = grid.scrollLeft;
    let idx = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].offsetLeft - PADDING <= scroll + 1) idx = i;
      else break;
    }
    return idx;
  }

  function applyClasses(activeIdx) {
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-second', 'is-third');
      if      (i === activeIdx)     card.classList.add('is-active');
      else if (i === activeIdx + 1) card.classList.add('is-second');
      else if (i === activeIdx + 2) card.classList.add('is-third');
    });
  }

  function update() {
    if (isUpdating) return;
    const newIdx = getActiveIdx();
    const curIdx = cards.findIndex(c => c.classList.contains('is-active'));
    if (curIdx === newIdx) return;

    isUpdating = true;

    // 이전 카드(화면 밖) transition 즉시 비활성화 → 레이아웃 이동 없이 즉시 축소
    const prevBox = cards[curIdx]?.querySelector('.home-card-img-box');
    if (prevBox) prevBox.style.transition = 'none';

    applyClasses(newIdx);

    // 레이아웃 반영 후 scrollLeft 보정
    requestAnimationFrame(() => {
      const targetScroll = cards[newIdx].offsetLeft - PADDING;
      grid.scrollLeft = targetScroll;

      // transition 복원
      if (prevBox) {
        requestAnimationFrame(() => { prevBox.style.transition = ''; });
      }
      setTimeout(() => { isUpdating = false; }, 600);
    });
  }

  // 초기 상태
  applyClasses(0);

  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(update, 30);
  });
})();

spClose.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

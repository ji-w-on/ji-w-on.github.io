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

    if (target === 'project') animateCollage();
  });
});

// ── 콜라주 진입 애니메이션: 중앙에서 작게 → 흩어짐 ──
function animateCollage() {
  const items = [...document.querySelectorAll('.collage-item')];
  const vpCX  = window.innerWidth  / 2;
  const vpCY  = window.innerHeight / 2;

  // 1. 각 아이템의 최종 위치를 기준으로 중앙 오프셋 계산 후 초기 상태 설정
  items.forEach(item => {
    const rect   = item.getBoundingClientRect();
    const itemCX = rect.left + rect.width  / 2;
    const itemCY = rect.top  + rect.height / 2;
    const dx     = vpCX - itemCX;
    const dy     = vpCY - itemCY;

    item.dataset.dx = dx;
    item.dataset.dy = dy;

    item.style.transition = 'none';
    item.style.transform  = `translate(${dx}px, ${dy}px) scale(0.08)`;
    item.style.opacity    = '0';
  });

  // 2. 브라우저가 초기 상태를 그린 뒤 애니메이션 실행
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.transition = `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                                   opacity   0.5s ease`;
          item.style.transform  = ''; // CSS 원래 위치(rotate)로 복귀
          item.style.opacity    = '1';
        }, i * 60);
      });

      // 3. 애니메이션 종료 후 inline transition 제거 (hover CSS가 적용되도록)
      const totalDuration = items.length * 60 + 950;
      setTimeout(() => {
        items.forEach(item => { item.style.transition = ''; });
      }, totalDuration);
    });
  });
}

// ── 콜라주 호버: 중앙 확대 ──
const collageItems      = document.querySelectorAll('.collage-item');
const TARGET_WIDTH_RATIO = 0.44;

const EASE = `0.55s cubic-bezier(0.16, 1, 0.3, 1)`;

collageItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const rect   = item.getBoundingClientRect();
    const itemCX = rect.left + rect.width  / 2;
    const itemCY = rect.top  + rect.height / 2;
    const vpCX   = window.innerWidth  / 2;
    const vpCY   = window.innerHeight / 2;
    const dx     = vpCX - itemCX;
    const dy     = vpCY - itemCY;
    const scale  = (window.innerWidth * TARGET_WIDTH_RATIO) / rect.width;

    item.style.transition = `transform ${EASE}, box-shadow ${EASE}`;
    item.style.transform  = `translate(${dx}px, ${dy}px) scale(${scale})`;
    item.style.zIndex     = '100';
    item.style.boxShadow  = '0 32px 80px rgba(0,0,0,0.18)';
  });

  item.addEventListener('mouseleave', () => {
    item.style.transition    = `transform ${EASE}, box-shadow ${EASE}`;
    item.style.transform     = '';
    item.style.zIndex        = '';
    item.style.boxShadow     = '';
    item.style.pointerEvents = 'none'; // 복귀 중 재진입 차단

    setTimeout(() => {
      item.style.pointerEvents = '';
    }, 620);
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

const homeItems = document.querySelectorAll('#home .about-grid-item[data-title]');
homeItems.forEach((item, i) => {
  item.addEventListener('click', () => openPanel(item, i, homeItems.length));
});

spClose.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

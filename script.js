document.addEventListener("DOMContentLoaded", () => {

  // FLOAT
  const card = document.querySelector(".id-card");
  let angle = 0;
  function floatAnim() {
    if (!card) return;
    angle += 0.02;
    card.style.transform = `translateY(${Math.sin(angle) * 5}px)`;
    requestAnimationFrame(floatAnim);
  }
  floatAnim();

  // SCROLL
  function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // TYPING
  const roles = ["Saya seorang Web Developer", "Eh bentar...", "Backend Engineer Kayanya..."];
  let i=0,j=0,del=false;
  function type() {
    const el = document.getElementById("typing");
    if (!el) return;

    if (del) j--; else j++;
    el.textContent = roles[i].substring(0,j);

    if (!del && j===roles[i].length) { del=true; return setTimeout(type,1000); }
    if (del && j===0) { del=false; i=(i+1)%roles.length; }

    setTimeout(type, del?35:100);
  }
  type();

 // --- MOBILE MENU LOGIC ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const menuIcon = hamburger.querySelector('iconify-icon');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    // Buka/Tutup menu
    mobileMenu.classList.toggle('translate-x-full');
    
    // Ganti icon dari garis tiga (menu) ke silang (close)
    if (mobileMenu.classList.contains('translate-x-full')) {
      menuIcon.setAttribute('icon', 'mdi:menu');
    } else {
      menuIcon.setAttribute('icon', 'mdi:close');
    }
  });
}

// Tutup menu otomatis kalau salah satu link diklik
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('translate-x-full');
    if (menuIcon) menuIcon.setAttribute('icon', 'mdi:menu');
  });
});

// --- THEME TOGGLE LOGIC (SINKRON DESKTOP & MOBILE) ---
const body = document.body;
const themeToggleDesktop = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

function toggleTheme() {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  
  // Update icon di kedua tombol
  if (themeToggleDesktop) themeToggleDesktop.innerText = isLight ? '☀️' : '🌙';
  if (themeToggleMobile) themeToggleMobile.innerText = isLight ? '☀️' : '🌙';
}

// Pasang event listener
if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// --- INTERAKTIF ID CARD (PENDULUM + STRETCH PHYSICS FIX) ---
const cardWrapper = document.getElementById('card-wrapper');
const lanyardNode = document.querySelector('.lanyard'); 

if (cardWrapper && lanyardNode) {
  let isDraggingCard = false;
  let currentAngle = 0;
  let currentStretch = 0; 
  let velAngle = 0;
  let velY = 0; // FIX 1: Variabel sudah disamakan
  let swingAnimation;

  // -- PENGATURAN FISIKA --
  const SETTINGS = {
    tensionAngle: 0.1,    
    frictionAngle: 0.90,  
    sensitivityX: 0.2,    // Sensitivitas ayunan X
    tensionY: 0.15,       
    frictionY: 0.82,      
    maxPullDown: 120,     // Batas maksimal tali molor
    baseLanyardHeight: 80 // Panjang normal tali
  };

  let pivotPoint = { x: 0, y: 0 };

  function updatePivot() {
    const rect = lanyardNode.getBoundingClientRect();
    pivotPoint.x = rect.left + rect.width / 2;
    pivotPoint.y = rect.top;
  }
  
  window.addEventListener('scroll', updatePivot);
  window.addEventListener('resize', updatePivot);
  updatePivot();

  function startDrag(e) {
    isDraggingCard = true;
    cardWrapper.classList.add('dragging');
    updatePivot(); 
    cancelAnimationFrame(swingAnimation);
  }

  function drag(e) {
    if (!isDraggingCard) return;
    updatePivot(); 

    const mouseX = e.clientX || (e.touches && e.touches[0].clientX);
    const mouseY = e.clientY || (e.touches && e.touches[0].clientY);

    // FIX 2: Tambahkan minus (-) di deltaX agar searah dengan tarikan mouse
    const deltaX = mouseX - pivotPoint.x;
    currentAngle = -deltaX * SETTINGS.sensitivityX;

    if (currentAngle > 50) currentAngle = 50;
    if (currentAngle < -50) currentAngle = -50;

    const cardNormalY = pivotPoint.y + SETTINGS.baseLanyardHeight;
    const deltaY = mouseY - cardNormalY;

    if (deltaY > 0) {
      currentStretch = Math.atan(deltaY / 100) * SETTINGS.maxPullDown;
      if (currentStretch > SETTINGS.maxPullDown) currentStretch = SETTINGS.maxPullDown;
    } else {
      currentStretch = Math.max(deltaY * 0.5, -15);
    }

    applyVisuals(); 
  }

  function endDrag() {
    if (!isDraggingCard) return;
    isDraggingCard = false;
    cardWrapper.classList.remove('dragging');
    swingBack();
  }

  function swingBack() {
    const forceAngle = -SETTINGS.tensionAngle * currentAngle;
    velAngle += forceAngle;
    velAngle *= SETTINGS.frictionAngle;
    currentAngle += velAngle;

    const forceY = -SETTINGS.tensionY * currentStretch;
    velY += forceY;
    velY *= SETTINGS.frictionY;
    currentStretch += velY;

    applyVisuals(); 

    if (Math.abs(currentAngle) > 0.05 || Math.abs(currentStretch) > 0.05 || Math.abs(velAngle) > 0.05 || Math.abs(velY) > 0.05) {
      swingAnimation = requestAnimationFrame(swingBack);
    } else {
      currentAngle = 0;
      currentStretch = 0;
      velAngle = 0;
      velY = 0;
      applyVisuals();
    }
  }

  function applyVisuals() {
    // Tali bertambah panjang
    lanyardNode.style.height = `${SETTINGS.baseLanyardHeight + currentStretch}px`;
    
    // FIX 3: Hapus translateY. Cukup di-rotate, karena tinggi tali otomatis menekan card ke bawah
    cardWrapper.style.transform = `rotate(${currentAngle}deg)`;
  }

  // Pasang Event Listener
  cardWrapper.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  cardWrapper.addEventListener('touchstart', startDrag, {passive: true});
  window.addEventListener('touchmove', drag, {passive: true});
  window.addEventListener('touchend', endDrag);
}
});
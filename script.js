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

  // THEME TOGGLE
  const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  // Ganti icon
  if (document.body.classList.contains("light")) {
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }
  });

  

});
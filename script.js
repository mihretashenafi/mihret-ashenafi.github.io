const words = ["Software Engineer", "Systems Engineer", "Front-End Developer"];
let i = 0, j = 0, currentWord = "", isDeleting = false;
const speed = 150;

function type() {
  const target = document.getElementById("typed-text");
  const word = words[i];

  if (!isDeleting && j < word.length) {
    // Typing
    currentWord += word[j];
    j++;
    target.textContent = currentWord;
    setTimeout(type, speed);
  } else if (isDeleting && j > 0) {
    // Deleting
    j--;
    currentWord = word.substring(0, j);
    target.textContent = currentWord;
    setTimeout(type, speed / 2);
  } else {
    // Switch typing/deleting
    isDeleting = !isDeleting;
    if (!isDeleting) {
      // Move to next word only after deleting
      i = (i + 1) % words.length;
    }
    setTimeout(type, 1000);
  }
}

type();



// ================== Dark Mode Toggle ==================
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const body = document.body;

function setLightMode() {
  body.classList.add('light');
  body.classList.remove('dark');
  themeIcon.textContent = '🌘';
  themeText.textContent = 'Dark Mode';
  localStorage.setItem('theme', 'light');
}

function setDarkMode() {
  body.classList.add('dark');
  body.classList.remove('light');
  themeIcon.textContent = '⚪';
  themeText.textContent = 'Light Mode';
  localStorage.setItem('theme', 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') setDarkMode();
  else setLightMode();
}

toggleBtn.addEventListener('click', () => {
  if (body.classList.contains('dark')) setLightMode();
  else setDarkMode();
});

loadTheme();


// ================== Scroll Fade-in Animations ==================
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));


// ================== Portfolio Auto-Scroll ==================
const containers = document.querySelectorAll('.portfolio-container');

containers.forEach((container, index) => {
  // Clone items
  const cards = container.querySelectorAll('.portfolio-card');
  cards.forEach(card => container.appendChild(card.cloneNode(true)));

  // Continuous scroll
  let speed = (index % 2 === 0) ? 1 : -1; // reverse second container
  let scrolling;

  const resetPoint = container.scrollWidth / 2; // original content length

  function continuousScroll() {
    container.scrollLeft += speed;

    if (speed > 0 && container.scrollLeft >= resetPoint) {
      container.scrollLeft = 0;
    }
    if (speed < 0 && container.scrollLeft <= 0) {
      container.scrollLeft = resetPoint;
    }

    scrolling = requestAnimationFrame(continuousScroll);
  }

  function startScroll() { if (!scrolling) continuousScroll(); }
  function stopScroll() { cancelAnimationFrame(scrolling); scrolling = null; }

  startScroll();

  container.addEventListener('mouseenter', stopScroll);
  container.addEventListener('mouseleave', startScroll);
});


// ================== Contact Form ==================
const form = document.getElementById('contact-form');
const successBubble = document.getElementById('form-success');

form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      form.reset();
      successBubble.style.display = 'block';
      successBubble.style.animation = 'none';
      void successBubble.offsetWidth;
      successBubble.style.animation = 'fadeInOut 10s forwards';
    } else alert("Oops! Something went wrong.");
  })
  .catch(() => alert("Error submitting the form."));
});

// Portfolio filter
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const projects = document.querySelectorAll('.project');
  
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projects.forEach(project => {
          project.style.display = (filter === 'all' || project.getAttribute('data-category') === filter) ? 'block' : 'none';
        });
      });
    });
  

      // Hero background image changer
  const hero = document.getElementById('hero') || document.querySelector('.hero');

  const images = [
    'assets/images/hero1.jpg',
    'assets/images/hero2.jpg',
    'assets/images/hero3.jpg'
  ];

  let index = 0;

  function changeBackground() {
    if (hero) {
      hero.style.backgroundImage = `url(${images[index]})`;
      index = (index + 1) % images.length;
    }
  }

  changeBackground(); // Initial call
  setInterval(changeBackground, 10000); // Change every 5 seconds

  });

   
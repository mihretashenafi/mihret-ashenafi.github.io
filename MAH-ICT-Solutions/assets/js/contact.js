document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    alert('Thank you for reaching out, ' + name + '! We will get back to you soon.');
    this.reset();
  });
  
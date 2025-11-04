// Navigation handling
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('main section');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active from all buttons and sections
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));

    // Activate the clicked tab and section
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');
  });
});

// Booking form validation (optional – use only if you have the booking form)
const bookingForm = document.getElementById('bookingForm');
const messageDiv = document.getElementById('message');

if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = bookingForm.name.value.trim();
    const email = bookingForm.email.value.trim();
    const roomType = bookingForm.roomType.value;
    const checkin = bookingForm.checkin.value;
    const checkout = bookingForm.checkout.value;

    if (new Date(checkin) >= new Date(checkout)) {
      messageDiv.textContent = "Check-Out date must be after Check-In date.";
      messageDiv.style.color = 'red';
      return;
    }

    // Simulate booking success
    messageDiv.textContent = `Thank you, ${name}! Your booking for a ${roomType} from ${checkin} to ${checkout} is confirmed.`;
    messageDiv.style.color = 'green';

    bookingForm.reset();
  });
}

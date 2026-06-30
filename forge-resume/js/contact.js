document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');

  const validators = {
    firstName: v => v.trim().length > 0 ? '' : 'Enter your first name.',
    lastName: v => v.trim().length > 0 ? '' : 'Enter your last name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    topic: v => v ? '' : 'Choose a topic.',
    message: v => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      const errorEl = form.querySelector(`[data-error="${name}"]`);
      const wrapper = field.closest('.field');
      const message = validators[name](field.value);

      if (message) {
        valid = false;
        errorEl.textContent = message;
        wrapper.classList.add('invalid');
      } else {
        errorEl.textContent = '';
        wrapper.classList.remove('invalid');
      }
    });

    if (valid) {
      success.classList.add('show');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      success.classList.remove('show');
    }
  });

  // Clear individual field error on input
  Object.keys(validators).forEach(name => {
    const field = form.elements[name];
    field.addEventListener('input', () => {
      const message = validators[name](field.value);
      const wrapper = field.closest('.field');
      const errorEl = form.querySelector(`[data-error="${name}"]`);
      if (!message) {
        wrapper.classList.remove('invalid');
        errorEl.textContent = '';
      }
    });
  });
});

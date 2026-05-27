// ── User search table filter ──────────────────────────────────
const userSearch = document.getElementById('userSearch');
if (userSearch) {
  userSearch.addEventListener('input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#usersTable tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ── Disaster: Show warning if "No Emergency Kit" selected ─────
const kitRadios = document.querySelectorAll('input[name="hasEmergencyKit"]');
const warning = document.getElementById('noKitWarning');
if (kitRadios.length && warning) {
  kitRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'no') {
        warning.classList.add('visible');
      } else {
        warning.classList.remove('visible');
      }
    });
  });
}

// ── Client-side form validation ───────────────────────────────
function addValidation(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', function (e) {
    let valid = true;
    clearErrors(form);
    rules.forEach(({ field, message, test }) => {
      const el = form.querySelector(`[name="${field}"]`);
      if (!el) return;
      const value = el.value.trim();
      if (!test(value, form)) {
        showError(el, message);
        valid = false;
      }
    });
    if (!valid) e.preventDefault();
  });
}

function showError(el, msg) {
  el.style.borderColor = '#dc2626';
  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'color:#dc2626;font-size:.78rem;margin-top:.25rem;display:block;';
  err.textContent = '⚠ ' + msg;
  el.parentNode.appendChild(err);
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

// Register form
addValidation('registerForm', [
  { field: 'name',            message: 'Full name is required.',              test: v => v.length > 0 },
  { field: 'email',           message: 'Valid email is required.',             test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  { field: 'password',        message: 'Password must be at least 6 chars.',   test: v => v.length >= 6 },
  { field: 'confirmPassword', message: 'Passwords do not match.',              test: (v, f) => v === f.querySelector('[name="password"]').value },
]);

// Classroom feedback form
addValidation('feedbackForm', [
  { field: 'gradeSection',   message: 'Please select your grade & section.',  test: v => v.length > 0 },
  { field: 'subject',        message: 'Please select a subject.',             test: v => v.length > 0 },
  { field: 'teacherRating',  message: 'Please rate your teacher (1–5 stars).', test: (_, f) => f.querySelector('input[name="teacherRating"]:checked') !== null },
  { field: 'favoriteLesson', message: 'Favorite lesson is required.',         test: v => v.length > 0 },
  { field: 'suggestions',    message: 'Suggestions field is required.',       test: v => v.length > 0 },
]);

// Star rating: validate radio
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function (e) {
    const checked = feedbackForm.querySelector('input[name="teacherRating"]:checked');
    if (!checked) {
      e.preventDefault();
      const group = feedbackForm.querySelector('.star-rating-group');
      if (group) {
        const existing = feedbackForm.querySelector('.star-error');
        if (!existing) {
          const err = document.createElement('span');
          err.className = 'star-error field-error';
          err.style.cssText = 'color:#dc2626;font-size:.78rem;margin-top:.25rem;display:block;';
          err.textContent = '⚠ Please select a star rating.';
          group.parentNode.appendChild(err);
        }
      }
    }
  });
}

// Disaster form
addValidation('disasterForm', [
  { field: 'address',       message: 'Address is required.',                   test: v => v.length > 0 },
  { field: 'familyMembers', message: 'Family members must be at least 1.',     test: v => parseInt(v) >= 1 },
  { field: 'pastExperience', message: 'Please describe past disaster experiences.', test: v => v.length > 0 },
]);

// ── Auto-dismiss alerts ───────────────────────────────────────
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.transition = 'opacity .5s';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
});

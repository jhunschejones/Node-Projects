document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formContact');
  const pristine = new Pristine(form);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const valid = pristine.validate();
    return valid ? form.submit() : null;
  });
});
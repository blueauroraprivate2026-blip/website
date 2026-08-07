(function () {
  "use strict";

  function showNotice(message, isSuccess) {
    var notice = document.createElement("div");
    notice.className = "form-notice " + (isSuccess ? "is-success" : "is-error");
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.textContent = message;
    document.body.appendChild(notice);

    window.setTimeout(function () {
      notice.classList.add("is-visible");
    }, 10);

    window.setTimeout(function () {
      notice.classList.remove("is-visible");
      window.setTimeout(function () {
        notice.remove();
      }, 250);
    }, 5000);
  }

  document.querySelectorAll("form[data-ajax-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var button = form.querySelector("button[type='submit']");
      var buttonText = button.textContent;
      button.disabled = true;
      button.textContent = "Sending...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("The form could not be submitted.");
          }
          form.reset();
          showNotice("Response sent — we’ll get back to you soon.", true);
        })
        .catch(function () {
          showNotice("We could not send your response. Please email us directly.", false);
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = buttonText;
        });
    });
  });
}());

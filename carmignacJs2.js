{
  var DOM = {};
  DOM.label = Array.prototype.slice.call(
    document.querySelectorAll(".form-input")
  );
  DOM.numeric = Array.prototype.slice.call(
    document.querySelectorAll(".form-input__numeric")
  );
  DOM.form = document.getElementById("form");
  DOM.submit = document.querySelector("button");
  DOM.input = DOM.form ? DOM.form.elements : [];
  DOM.body = document.body;

  // Set latest opt in source
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  // var latestOptIn = document.querySelector("#source");
  // var source = getParameterByName("source");
  // latestOptIn.value = source;

  function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }

    var trident = ua.indexOf("Trident/");
    if (trident > 0) {
      var rv = ua.indexOf("rv:");
      return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }

    var edge = ua.indexOf("Edge/");
    if (edge > 0) {
      return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
    }

    return false;
  }

  function init() {
    var version = detectIE();

    if (version != false) {
      DOM.body.classList.add("ie-browser");
    }

    // setTimeout(function () {
    //   DOM.body.classList.add("ready");
    // }, 400);

    DOM.label.forEach(function (el) {
      el.addEventListener("focus", focus);
      el.addEventListener("focusout", resetfocus);
    });

    DOM.numeric.forEach(function (el) {
      el.addEventListener("keypress", numeric);
    });

    DOM.form.addEventListener("submit", submit);
  }

  function resetfocus(e) {
    DOM.label.forEach(function (el) {
      var empty = true;

      // If field has a value, keep label focussed...
      if ((el.options && el.options.selectedIndex) || el.value != "")
        empty = false;

      // else remove focus.
      if (empty) el.parentElement.classList.remove("is-focus");
    });
  }

  function focus(e) {
    e.target.parentElement.classList.add("is-focus");
  }

  function email(e) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(e).toLowerCase());
  }

  function numeric(e) {
    var charCode = e.which ? e.which : e.keyCode;

    if (charCode != 43 && charCode != 41 && charCode != 40 && charCode != 32) {
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      }
    }
  }

  function validate() {
    var l = 0;
    var v = 0;

    // For each input...
    for (var i = 0; i < DOM.input.length; i++) {
      var el = DOM.input[i];

      // Check whether it is a required field...
      if (el.classList.contains("form-input__required")) {
        l++;

        // Verify required field has a value.
        if (
          (el.classList.contains("form-input__checkbox") && el.checked) ||
          (el.options && el.options.selectedIndex) ||
          (!el.classList.contains("form-input__checkbox") && el.value != "")
        ) {
          el.parentElement.classList.remove("has-error");
          v++;
        } else {
          el.parentElement.classList.add("has-error");
        }
      }

      // Verify email address is in the correct format.
      if (el.classList.contains("form-input__email") && !email(el.value)) {
        v--;
        el.parentElement.classList.add("has-error");
      }
    }

    return l === v ? true : false;
  }

  function submit(e) {
    // On submit of form, validate the fields.
    if (!validate()) {
      e.preventDefault();

      // Scroll first error into view.
      document.querySelector(".has-error").scrollIntoView();
      window.scrollBy(0, -10);
    }
  }

  init();
}

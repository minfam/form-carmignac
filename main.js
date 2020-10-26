const TYPE = "type";
const ADVICE_CONFIRM = "advice-confirm";
const PROJECT = "advice-project";
const ADVICE_WITH_PROJECT_USER = "advice-with-project-form-user";
const ADVICE_WITHOUT_PROJECT_USER = "advice-without-project-form-user";
const RECEIVE_MORE_INTERESTS = "receive-more-form-interests";
const RECEIVE_MORE_USER = "receive-more-user";

const ADVICE_WITH_PROJECT_FORM = "advice-with-project-form";
const RECEIVE_MORE_FORM = "receive-more-form";

window.addEventListener("DOMContentLoaded", function() {
  let classNameFormActive = null;
  let errors = {};

  const wrapper = document.querySelector(".wrapper");
  const requiredText = wrapper.dataset.requireText;
  const emailInvalid = wrapper.dataset.emailInvalid;

  const formLabels = array(document.querySelectorAll(".form-input"));
  let type = document.querySelector(".select-type:checked").value;
  let hasProject = document.querySelector(".advice-confirm input:checked")
    .value;

  function init() {
    const version = detectIE();

    if (version != false) {
      document.body.classList.add("ie-browser");
    }

    array(document.forms).forEach(function (form) {
      handleSubmit(form);
    });

    handleNavigation();
    handleChange();
    handleChangeInputNumber();
    handleFocus();
  }

  function handleNavigation() {
    //select advice or receive more
    array(document.querySelectorAll(".select-type")).forEach(function (element) {
      element.addEventListener("change", function (event) {
        if (event.target.checked) {
          type = event.target.value;
          document.querySelector(".type .next").dataset.next = type;
        }
      });
    });

    //select has project or has no project
    array(document
      .querySelectorAll(".advice-confirm input"))
      .forEach(function (element) {
        element.addEventListener("change", function (event) {
          if (event.target.checked) {
            hasProject = event.target.value;
            document.querySelector(
              ".advice-confirm .next"
            ).dataset.next = hasProject;
          }
        });
      });

    //handle click next
    array(document.querySelectorAll(".next")).forEach(function (element) {
      element.addEventListener("click", function (event) {
        const nextClass = event.target.dataset.next;
        document.querySelector(".active").classList.remove("active");
        document.querySelector("." + nextClass).classList.add("active");
      });
    });

    //handle click back
    array(document.querySelectorAll(".back")).forEach(function (element) {
      element.addEventListener("click", function (event) {
        const backClass = event.target.dataset.back;
        if (!backClass) {
          return;
        }
        document.querySelector(".active").classList.remove("active");
        document.querySelector("." + backClass).classList.add("active");

        //clear error final form
        if (
          backClass === PROJECT ||
          backClass === ADVICE_CONFIRM ||
          backClass === RECEIVE_MORE_INTERESTS
        ) {
          array(document.querySelectorAll(".error")).forEach(function (element) {
            if (element.tagName === "SPAN") {
              element.parentNode.removeChild(element);
            } else {
              element.classList.remove("error");
            }
          });

          classNameFormActive = null;
          errors = {};
        }
      });
    });
  }

  // change value form element
  function handleChange() {
    const formElements = array(document.querySelectorAll(
      '.form-input__required:not([type="hidden"])'
    ));
    const selectElements = array(document.querySelectorAll(
      'select.form-input__required:not([type="hidden"])'
    ));

    selectElements.forEach(function (element) {
        element.addEventListener("change", function (e) {
          validateAfterSubmitFailed(e)
        });
    });

    formElements.forEach(function (element) {
      element.addEventListener("input", function (e) {
        validateAfterSubmitFailed(e)
      });
    });

    function validateAfterSubmitFailed(e) {
      const element = e.target;
      const matchWithCurrentForm = document.querySelector('.' + classNameFormActive + ' #' + element.getAttribute('id'));
      if (matchWithCurrentForm) {
        if (element.classList.contains("form-input__email")) {
          validateEmail(element);
        } else if (element.classList.contains("form-input__checkbox")) {
          validateCheckbox(element);
        } else {
          validateInput(element);
        }
      }
    }
  }

  // change phone value
  function handleChangeInputNumber() {
    array(document.querySelectorAll(".form-input__numeric")).forEach(function (el) {
      el.addEventListener("keypress", numeric);
    });
  }

  //submit form
  function handleSubmit(form) {
    form.addEventListener("submit", function (e) {
      classNameFormActive = form.className;
      validate(form);
      if (Object.keys(errors).length) {
        e.preventDefault();
      }
    });
  }

  // focus input
  function handleFocus() {
    formLabels.forEach(function (el) {
      el.addEventListener("focus", focus);
      el.addEventListener("focusout", resetfocus);
    });
  }

  //validate current form
  function validate(form) {
    const formElements = array(form.querySelectorAll(
      '.form-input__required:not([type="hidden"])'
    ));

    formElements.forEach(function (element) {
      if (element.classList.contains("form-input__email")) {
        validateEmail(element);
      } else if (element.classList.contains("form-input__checkbox")) {
        validateCheckbox(element);
      } else {
        validateInput(element);
      }
    });
  }

  function resetfocus(e) {
    formLabels.forEach(function (el) {
      let empty = true;

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

  function validateEmail(element) {
    const emailParent = element.parentNode;
    const formGroupEmailLastChild = emailParent.lastElementChild;

    if (!element.value) {
      const errorNodeRequired = document.createElement("span");
      const textNodeRequired = document.createTextNode(requiredText);
      errorNodeRequired.appendChild(textNodeRequired);
      errorNodeRequired.classList.add("error");
      errors.email = requiredText;
      if (!formGroupEmailLastChild.classList.contains("error")) {
        emailParent.appendChild(errorNodeRequired);
      } else {
        formGroupEmailLastChild.textContent = requiredText;
      }
    } else if (element.value.trim() !== "" && !email(element.value)) {
      const errorEmail = document.createElement("span");
      const textEmailInvalid = document.createTextNode(emailInvalid);
      errorEmail.appendChild(textEmailInvalid);
      errorEmail.classList.add("error");
      if (!formGroupEmailLastChild.classList.contains("error")) {
        emailParent.appendChild(errorEmail);
      } else {
        formGroupEmailLastChild.textContent = emailInvalid;
      }
      errors.email = emailInvalid;
    } else if (
      email(element.value) &&
      formGroupEmailLastChild.classList.contains("error")
    ) {
      emailParent.removeChild(formGroupEmailLastChild);
      delete errors["email"];
    }
  }

  function validateInput(element) {
    const parentNode = element.parentNode;
    const errorElement = parentNode.querySelector('.error');
    const name = element.getAttribute("name");
    if (!element.value && !errorElement) {
      const errorNodeRequired = document.createElement("span");
      const textNodeRequired = document.createTextNode(requiredText);
      errorNodeRequired.appendChild(textNodeRequired);
      errorNodeRequired.classList.add("error");
      parentNode.appendChild(errorNodeRequired);
      errors[name] = requiredText;
    } else if (
      element.value &&
      errorElement
    ) {
      parentNode.removeChild(errorElement);
      delete errors[name];
    }
  }

  function validateCheckbox(element) {
    const checked = element.checked;
    const label = element.parentNode.querySelector("label");
    const name = element.getAttribute("name");
    const checkbox = element.parentNode.querySelector(".tickbox");
    if (!checked) {
      label.classList.add("error");
      checkbox.classList.add("error");
      errors[name] = requiredText;
    } else {
      label.classList.remove("error");
      checkbox.classList.remove("error");
      delete errors[name];
    }
  }

  init();
});

function email(e) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(e).toLowerCase());
}

function numeric(e) {
  const charCode = e.which ? e.which : e.keyCode;

  if (charCode != 43 && charCode != 41 && charCode != 40 && charCode != 32) {
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  }
}

function detectIE() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }

  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    const rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }

  const edge = ua.indexOf("Edge/");
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }

  return false;
}

function array(element) {
  return Array.prototype.slice.call(element);
}

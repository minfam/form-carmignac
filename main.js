const TYPE = "type";
const ADVICE_CONFIRM = "advice-confirm";
const PROJECT = "advice-project";
const ADVICE_WITH_PROJECT_USER = "advice-with-project-user";
const ADVICE_WITHOUT_PROJECT_USER = "advice-without-project-user";
const RECEIVE_MORE_INTERESTS = "receive-more-interests";
const RECEIVE_MORE_USER = "receive-more-user";

window.addEventListener("DOMContentLoaded", () => {
  let classNameFormActive = null;
  let errors = {};

  const wrapper = document.querySelector(".wrapper");
  const requiredText = wrapper.dataset.requireText;
  const emailInvalid = wrapper.dataset.emailInvalid;

  let stepActive;
  const formLabels = document.querySelectorAll(".form-input");

  function init() {
    const version = detectIE();

    if (version != false) {
      document.body.classList.add("ie-browser");
    }

    Array.from(document.forms).forEach(function (form) {
      handleSubmit(form);
    });

    handleCurrentStep();
    handleChange();
    handleChangeInputNumber();
    handleFocus();
  }

  function handleCurrentStep() {
    stepActive = document.querySelector(".step.active");
    const stepActiveName = stepActive.dataset.step;
    const nextBtn = document.querySelector(".step.active .next");
    const backBtn = document.querySelector(".step.active .back");

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        let nextClass;
        if (stepActiveName === TYPE || stepActiveName === ADVICE_CONFIRM) {
          const radioActive = document.querySelector(
            `.step.active input[name="${stepActiveName}"]:checked`
          );
          if (!radioActive) return;
          nextClass = radioActive.value;
        } else {
          nextClass = this.dataset.next;
        }
        gotoStep(stepActive, nextClass);
      });
    }

    if (backBtn) {
      const prevStepClass = backBtn.dataset.back;
      if (!prevStepClass) return;

      backBtn.addEventListener("click", function () {
        //reset final form
        if (
          prevStepClass === PROJECT ||
          prevStepClass === ADVICE_CONFIRM ||
          prevStepClass === RECEIVE_MORE_INTERESTS
        ) {
          document.querySelectorAll(".error").forEach(function (element) {
            if (element.tagName === "SPAN") {
              element.remove();
            } else {
              element.classList.remove("error");
            }
          });
          classNameFormActive = null;
          errors = {};
        }
        gotoStep(stepActive, prevStepClass);
      });
    }
  }

  function gotoStep(currentStep, className) {
    currentStep.classList.remove("active");
    document.getElementsByClassName(className)[0].classList.add("active");
    handleCurrentStep();
  }

  // change value form element
  function handleChange() {
    const formElements = document.querySelectorAll(
      '.form-input__required:not([type="hidden"])'
    );
    formElements.forEach(function (element) {
      element.addEventListener("input", function (e) {
        if (element.closest("form").className === classNameFormActive) {
          if (element.classList.contains("form-input__email")) {
            validateEmail(e.target);
          } else if (element.classList.contains("form-input__checkbox")) {
            validateCheckbox(e.target);
          } else {
            validateInput(e.target);
          }
        }
      });
    });
  }

  // change phone value
  function handleChangeInputNumber() {
    document.querySelectorAll(".form-input__numeric").forEach(function (el) {
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
    const formElements = form.querySelectorAll(
      '.form-input__required:not([type="hidden"])'
    );
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
      formGroupEmailLastChild.remove();
      delete errors["email"];
    }
  }

  function validateInput(element) {
    const parentNode = element.parentNode;
    const lastChildInFormGroup = parentNode.lastElementChild;
    const name = element.getAttribute("name");
    if (!element.value && !lastChildInFormGroup.classList.contains("error")) {
      const errorNodeRequired = document.createElement("span");
      const textNodeRequired = document.createTextNode(requiredText);
      errorNodeRequired.appendChild(textNodeRequired);
      errorNodeRequired.classList.add("error");
      parentNode.appendChild(errorNodeRequired);
      errors[name] = requiredText;
    } else if (
      element.value &&
      lastChildInFormGroup.classList.contains("error")
    ) {
      lastChildInFormGroup.remove();
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

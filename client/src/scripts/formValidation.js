function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.classList.remove("error");
  formControl.classList.add("success");
}

function removeSuccessFor() {
  const formControls = document.querySelectorAll(".form-control");
  formControls.forEach((formControl) => {
    formControl.classList.remove("success");
  });
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector(".error-message");
  if (small) {
    formControl.classList.remove("success");
    formControl.classList.add("error");
    small.innerText = message;
  }
}

function isEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

function setRadioSuccessFor(container) {
  container.classList.remove("error");
  container.classList.add("success");
}

function setRadioErrorFor(message) {
  const radioControl = document.querySelector(".radiobtn-container");
  const small = radioControl.querySelector(".error-message");
  if (small) {
    radioControl.classList.remove("success");
    radioControl.classList.add("error");
    small.innerText = message;
  }
}

function removeRadioSuccessFor() {
  const radioContainers = document.querySelectorAll(".radiobtn-container");
  radioContainers.forEach((container) => {
    container.classList.remove("success");
  });
}

function validateSignupForm() {
  const fullName = document.getElementById("signupFullName");
  const username = document.getElementById("signupUsername");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const radioContainer = document.querySelector(".radiobtn-container");

  const fullNameValue = fullName.value.trim();
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (fullNameValue === "") {
    setErrorFor(fullName, "Full Name cannot be blank");
  } else {
    setSuccessFor(fullName);
  }

  if (usernameValue === "") {
    setErrorFor(username, "Username cannot be blank");
  } else {
    setSuccessFor(username);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be blank");
  } else if (!(emailValue.length >= 6)) {
    setErrorFor(password, "Password length atleast 6");
  } else {
    setSuccessFor(password);
  }

  const radioOptions = Array.from(
    radioContainer.querySelectorAll('input[type="radio"]')
  );

  if (!radioOptions.some((radio) => radio.checked)) {
    setRadioErrorFor("Please select one option");
  } else {
    setRadioSuccessFor(radioContainer);
  }
}

function validateLoginForm() {
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "" || !passwordValue) {
    setErrorFor(password, "Password cannot be blank");
  } else {
    setSuccessFor(password);
  }
}

function validateContactForm() {
  const fullName = document.getElementById("contactFullName");
  const email = document.getElementById("contactEmail");
  const subject = document.getElementById("contactSubject");
  const message = document.getElementById("contactMessage");

  const fullNameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const subjectValue = subject.value.trim();
  const messageValue = message.value.trim();

  if (fullNameValue === "") {
    setErrorFor(fullName, "Full Name cannot be blank");
  } else {
    setSuccessFor(fullName);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
  }

  if (subjectValue === "") {
    setErrorFor(subject, "Subject cannot be blank");
  } else {
    setSuccessFor(subject);
  }

  if (messageValue === "") {
    setErrorFor(message, "Message cannot be blank");
  } else {
    setSuccessFor(message);
  }
}

export {
  validateSignupForm,
  removeRadioSuccessFor,
  validateLoginForm,
  validateContactForm,
  removeSuccessFor,
};

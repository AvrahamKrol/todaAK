let login = null;

//!Buttons
const signUpButton = document.querySelector(".sign-up"); //signup button
const logInButton = document.querySelector(".log-in"); //login button
const logOutButton = document.querySelector(".log-out"); //logout button
const accountSettButton = document.querySelector(".sett-button"); //change settings button
const accountButton = document.querySelector(".settings"); //settings button
const subButtonWrap = document.querySelector(".sub-button-wrap"); //container for submit and login buttons
const logButtonWrap = document.querySelector(".log-button-wrap"); //container for logout, settings and user name
const submitButton = document.querySelector(".submit-button"); //submit button in submit form
const loginButton = document.querySelector(".login-button"); //login button in login form
const closeButton = document.querySelectorAll(".close"); // close button
const closeSettButton = document.querySelector(".close-sett"); //close button of settings
const newTask = document.querySelector(".new-task"); //new task button

//!Forms
const userName = document.querySelector(".user-name"); //shows user name
const submitForm = document.querySelector(".submitContainer"); //submit form
const loginForm = document.querySelector(".loginContainer"); //login form
const settForm = document.querySelector(".settingsContainer"); //settings for
const dashboard = document.querySelector(".dashboard"); //dashboard
const submitInputs = document.querySelector(".submitForm"); //submit inputs
const logInputs = document.querySelector(".loginForm"); //login inputs

//!Inputs
const firstNameInput = document.querySelector(".fName"); //input field for first name in submit form
const lastNameInput = document.querySelector(".lName"); //input field for last name in submit form
const eMailInput = document.querySelector(".eMail"); // input field for email in submit form
const pswrdInput = document.querySelector(".pswrd"); //input field for password in submit form
const logEmailInput = document.querySelector(".log-email"); //input field for email in login form
const logPswrd = document.querySelector(".log-pswrd"); //input field for password in login form
const settFName = document.querySelector(".settingsFName"); //input in settings form for first name
const settLName = document.querySelector(".settingsLName"); //input in settings form for last name
const settEMailInput = document.querySelector(".settingsEMail"); // input in settings form for email
const settPswrdInput = document.querySelector(".settingsPswrd"); //input in settings form for password
const checkbox = document.querySelector("#chkbx"); //checkbox field
const dashboardInput = document.querySelector(".dashboard-input");
const label = document.querySelector(".label"); //label line
const submitWarning = document.querySelector(".submit-warning"); //error message
const loginWarning = document.querySelector(".login-warning"); //error message
const UL = document.querySelector(".task-list"); // list of tasks

const userFName = localStorage.getItem("FirstName");
const userLName = localStorage.getItem("LastName");
const userEMail = localStorage.getItem("EMail");
const userPswrd = localStorage.getItem("Pswrd");

const lettersReg = /^[A-Za-z]+$/;
const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const user = {};
const task = {};
const users = JSON.parse(localStorage.getItem("users")) || [];
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* ************************************* */
//  !FUNCTIONS
/* ************************************* */

//!ADD SIGN UP FORM
function addSignUpForm() {
  windowClose(loginForm);
  windowClose(submitWarning);
  windowShow(submitForm);
  closeForm(closeButton);
  submitInputs.reset();

  submitButton.addEventListener("click", submitInfo);
}

//!ADD LOGIN FORM
function addLogInForm() {
  windowClose(submitForm);
  windowClose(loginWarning);
  windowShow(loginForm);
  closeForm(closeButton);
  logInputs.reset();

  loginButton.addEventListener("click", loginInfo);
}

//!Submit form button
function submitInfo(e) {
  e.preventDefault();
  windowClose(submitWarning);
  //***************************/
  if (
    firstNameInput.value &&
    firstNameInput.value.match(lettersReg) &&
    lastNameInput.value &&
    lastNameInput.value.match(lettersReg) &&
    eMailInput.value &&
    eMailInput.value.match(emailReg) &&
    pswrdInput.value &&
    checkbox.checked
  ) {
    closeForm(closeButton);
    //&LocalStorage setlingUp
    //***************************/
    user.firstName = firstNameInput.value;
    user.lastName = lastNameInput.value;
    user.email = eMailInput.value;
    user.pswrd = pswrdInput.value;
    user.id = Date.now();
    users.push(user);
    console.log(users);

    localStorage.setItem("users", JSON.stringify([...users]));
    //****************************/

    //here goes if statement that checks is there such a user
    for (let i = 0; i < users.length; i++) {
      userName.textContent = `${user.firstName} ${user.lastName}`;
      submitInputs.reset();
      windowClose(submitForm);
      windowClose(submitWarning);
      windowClose(subButtonWrap);
      addDashboard(user.firstName, user.lastName);
      login = " ";
      checkAuth();
    }
  } else {
    windowShow(submitWarning);
  }
}

//!Login form button
function loginInfo(e) {
  e.preventDefault();

  users.forEach((item) => {
    if (logEmailInput.value === item.email && logPswrd.value === item.pswrd) {
      user.firstName = item.firstName;
      user.lastName = item.lastName;
      user.email = item.email;
      user.pswrd = item.pswrd;
      logInputs.reset();
      windowClose(loginForm);
      windowClose(loginWarning);
      windowClose(subButtonWrap);
      addDashboard(item.firstName, item.lastName);
      login = " ";
      checkAuth();
    } else {
      windowShow(loginWarning);
    }
  });
}

//!Log out function
function logOut() {
  windowClose(dashboard);
  windowClose(userName);
  windowClose(logOutButton);
  windowClose(accountButton);
  windowClose(settForm);
  windowShow(subButtonWrap);
  login = "";
  checkAuth();
}

// !Add new task function
const addNewTask = () => {
  dashboardInput.innerHTML = addTaskInput();
  const inputInfo = document.querySelector(".classInput");
  const done = document.querySelector(".done");
  done.addEventListener("click", () => {
    const div = document.createElement("div");
    const checkbox = document.createElement("button");
    const taskItem = document.createElement("li");
    const remove = document.createElement("button");
    taskItem.classList.add("list-item");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("checkbox");
    remove.classList.add("remove");
    div.classList.add("container");
    taskItem.textContent = inputInfo.value;
    UL.appendChild(div);
    div.appendChild(checkbox);
    div.appendChild(taskItem);
    div.appendChild(remove);
    inputInfo.value = "";
    dashboardInput.innerHTML = "";
    task.userId = user.id;
    console.log(task.userId);
    checkbox.addEventListener("click", (e) => {
      const chkbx = e.target;
      chkbx.classList.toggle("selected");
      taskItem.classList.toggle("list-item");
      taskItem.classList.toggle("completed");
    });
    remove.addEventListener("click", () => {
      UL.removeChild(div);
    });
  });
};

const addTaskInput = () => {
  return `
  <div class="wraper">
  <input type="text" placeholder="your task here" class="classInput" maxlength="40">
  <div>
    <button class="done"></button>
  </div>
  </div>
  `;
};

function AccChange(e) {
  e.preventDefault();
  userFName = settFName.value;
  userLName = settLName.value;
  userEMail = settEMailInput.value;
  userPswrd = settPswrdInput.value;

  windowShow(dashboard);
  windowClose(settForm);
  userName.textContent = `${irstNameInput.value} ${lastNameInput.value}`;
  localStorage.setItem("FirstName", userFName);
}

//!Change settings function
function saveChangedSettings() {
  settFName.value = `${user.firstName}`;
  settLName.value = `${user.lastName}`;
  settEMailInput.value = `${user.email}`;
  settPswrdInput.value = `${user.pswrd}`;
  windowClose(dashboard);
  windowShow(settForm);
  accountSettButton.addEventListener("click", AccChange);
  closeSettButton.addEventListener("click", () => {
    windowClose(settForm);
    windowShow(dashboard);
  });
}

//!Add dashboard form
function addDashboard(fName, lName) {
  userName.textContent = `${fName} ${lName}`;
  closeForm(closeButton);
  windowShow(userName);
  windowShow(logOutButton);
  windowShow(accountButton);
  windowShow(dashboard);
}

//!close button
function closeForm(el) {
  for (let i = 0; i < el.length; i++) {
    el[i].addEventListener("click", () => {
      windowClose(submitForm);
      windowClose(loginForm);
    });
  }
}

/***************************/
//!Show and close window functions
function windowShow(el) {
  el.classList.remove("hide");
  el.classList.add("is-open");
}
function windowClose(el) {
  el.classList.add("hide");
  el.classList.remove("is-open");
}
/* *************************************** */
function authorized() {
  console.log("Loged in");
  logOutButton.addEventListener("click", logOut);

  accountButton.addEventListener("click", saveChangedSettings);

  newTask.addEventListener("click", addNewTask);
}

/* **************************************** */
function notAuthorized() {
  console.log("NOT loged in");
  signUpButton.addEventListener("click", addSignUpForm);

  logInButton.addEventListener("click", addLogInForm);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
checkAuth();

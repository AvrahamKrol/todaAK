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
const taskListInput = document.querySelector(".task-list-wrapper");
const label = document.querySelector(".label"); //label line
const submitWarning = document.querySelector(".submit-warning"); //error message
const loginWarning = document.querySelector(".login-warning"); //error message
const UL = document.querySelector(".task-list"); // list of tasks

const lettersReg = /^[A-Za-z]+$/;
const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const user = {};
const task = {};



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

// !!!!!!!!!!
  function saveToStorage(obj) {
    localStorage.setItem('login', JSON.stringify(obj));
};

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
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => {
      if(user.email === eMailInput.value) {
          return user;
        }  
    });

    if(!existingUser) {
      localStorage.setItem("users", JSON.stringify([user, ...users]));
      //****************************/
  
      //here goes if statement that checks is there such a user
        userName.innerHTML = `${firstNameInput.value} ${lastNameInput.value}`;
        submitInputs.reset();
        windowClose(submitForm);
        windowClose(submitWarning);
        windowClose(subButtonWrap);
        addDashboard(user.firstName, user.lastName);
        login = " ";
        saveToStorage(user);
        checkAuth();
        manipulateTask();
    } else throw new Error("there is such user");
  } else {
    windowShow(submitWarning);
  }
}

//!Login form button
function loginInfo(e) {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userLogged = users.find(item => {
    return logEmailInput.value === item.email && logPswrd.value === item.pswrd;
  });

  if (!userLogged) {
    windowShow(loginWarning);
  } else {
      saveToStorage(userLogged);
      logInputs.reset();
      windowClose(loginForm);
      windowClose(loginWarning);
      windowClose(subButtonWrap);
      addDashboard(userLogged.firstName, userLogged.lastName);
      login = " ";
      checkAuth();
      loadTasks();
      manipulateTask();
  }
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
  const loginUser = JSON.parse(localStorage.getItem("login"));
  const activeUser = `${loginUser.firstName} ${loginUser.lastName}`;
  const inputInfo = document.querySelector(".classInput");
  const done = document.querySelector(".done");

  done.addEventListener("click", () => {
    taskListInput.insertAdjacentHTML("afterbegin", addTask(inputInfo.value));
    task.name = activeUser;
    task.id = loginUser.id;
    task.value = inputInfo.value;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify([task, ...tasks]));
    inputInfo.value = "";
    dashboardInput.innerHTML = "";

    manipulateTask();
  });
};

const generateHTML = () => {
      const taskHTML = tasks
        .map((task) => {
          return addTask(task);
        })
        .join("");
        taskListInput.insertAdjacentHTML("afterend", taskHTML);
      };

  const manipulateTask = () => {
    const loginUser = JSON.parse(localStorage.getItem("login"));
    const activeUser = `${loginUser.firstName} ${loginUser.lastName}`;
    const checkboxArr = Array.from(taskListInput.querySelectorAll(".checkbox"));
    const removeArr = Array.from(taskListInput.querySelectorAll(".remove"));
    const taskInputsCollection = taskListInput.querySelectorAll(".list-item");
    const taskInputsArr = Array.from(taskInputsCollection);

    checkboxArr.forEach(item => {
      item.onclick = (e) => {
        const nextSibling = e.target.nextElementSibling;
        nextSibling.classList.toggle("completed");
      };
    })

    taskInputsArr.forEach(task => {
      task.onclick = (e) => {
        const target = e.target;
        const div = document.createElement("div");
        const btnDiv = document.createElement("div");
        div.classList.add ("wraper");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("maxlength", "40"); 
        input.setAttribute("value", target.innerHTML);
        input.classList.add("classInput");
        const btn = document.createElement("button");
        btn.classList.add("done");
        dashboardInput.appendChild(div);
        div.appendChild(input);
        div.appendChild(btnDiv);
        btnDiv.appendChild(btn);

        const btnDone = div.querySelector(".done");
        btnDone.onclick = () =>{
          const tasks = JSON.parse(localStorage.getItem("tasks"));
          tasks.forEach(task => {
              if (task.value === target.innerHTML) {
                const matched = tasks.find(item => item.value === input.value);
                if(!matched) {
                  task.value = input.value;
                  localStorage.removeItem("tasks");
                  localStorage.setItem("tasks", JSON.stringify(tasks));
                  target.innerHTML = input.value;
                  dashboardInput.innerHTML = "";
                } else alert("There is already task with such name");
              }
          });
        }
      }
    })

    removeArr.forEach(item => {
      item.addEventListener("click", (e) => {
        const tasksArr = JSON.parse(localStorage.getItem("tasks"));  
        const target = e.target;
        const previousSibling = target.previousElementSibling;
        const newTaskArr = tasksArr.filter(task => task.value !== previousSibling.innerHTML);
        localStorage.removeItem("tasks");
        localStorage.setItem("tasks", JSON.stringify(newTaskArr));
        taskListInput.removeChild(item.parentNode);
      });
    })
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

const addTask = (task) => {
  return `
  <div class="container">
    <input type="checkbox" class="checkbox">
    <span class="list-item">${task}</span>
    <input class="remove">
  </div>
  `;
};

const loadTasks = () => {
  taskListInput.innerHTML = "";
  const taskCards = JSON.parse(localStorage.getItem("tasks")) || []; 
  const loginUser = JSON.parse(localStorage.getItem("login"));
  if (taskCards) {
    const usersTasks = taskCards.filter(item => {
      if (item.id === loginUser.id) {
      return item;
      } 
    });
    if (usersTasks.length !== 0) {
      const loadHTML = () => {
      const cardHTML = usersTasks
        .map((taskCard) => {
          return addTask(taskCard.value);
        })
        .join("");
        taskListInput.insertAdjacentHTML("afterbegin", cardHTML);
      };
      loadHTML();
    }
  }
};

//!Change settings function
function saveChangedSettings() {
  const loginUser = JSON.parse(localStorage.getItem("login"));
  settFName.value = `${loginUser.firstName}`;
  settLName.value = `${loginUser.lastName}`;
  settEMailInput.value = `${loginUser.email}`;
  settPswrdInput.value = `${loginUser.pswrd}`;
  windowClose(dashboard);
  windowShow(settForm);
  accountSettButton.addEventListener("click", (e) => {
    e.preventDefault();
    windowShow(dashboard);
    windowClose(settForm);
    userName.innerHTML = `${settFName.value} ${settLName.value}`;
    const users = JSON.parse(localStorage.getItem("users"));
    const index = users.findIndex(user => user.id === loginUser.id);
    users[index] = {
      firstName : settFName.value,
      lastName : settLName.value,
      email : settEMailInput.value,
      pswrd : settPswrdInput.value
    }
    localStorage.removeItem("login");
    localStorage.setItem("login", JSON.stringify({
      firstName : settFName.value,
      lastName : settLName.value,
      email : settEMailInput.value,
      pswrd : settPswrdInput.value
    }));
    localStorage.removeItem("users");
    localStorage.setItem("users", JSON.stringify(users));
  });
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
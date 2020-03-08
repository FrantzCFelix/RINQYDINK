'use strict';

$(document).ready(() => {

  // Getting references to our form and inputs
  const loginForm = $(`form#login`);
  const usernameLogin = $(`input#usernameLogin`);
  const passwordLogin = $(`input#passwordLogin`);

  // When the form is submitted, we validate there's an username and password entered
  loginForm.on(`submit`, event => {
    alert(`show me smthg`);
    event.preventDefault();
    const userData = {
      username: usernameLogin.val().trim(),
      password: passwordLogin.val().trim()
    };

    if (!userData.username || !userData.password) {
      return ;
    }

    loginUser(userData.username, userData.password);
    usernameLogin.val(``);
    passwordLogin.val(``);
  });

  function loginUser(username, password) {
    $.post(`/api/login`, {
      username,
      password
    })
      .then(() => {
        window.location.replace(`/members`);
      })
      .catch(err => {
        console.log(err);
      });
  }
});

$(document).ready(() => {
  $(`.parallax`).parallax();
});

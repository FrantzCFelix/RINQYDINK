'use strict';

$(document).ready(() => {

  const loginForm = $(`form#login`);
  const usernameLogin = $(`input#usernameLogin`);
  const passwordLogin = $(`input#passwordLogin`);

  loginForm.on(`submit`, event => {
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
      .catch(handleLoginErr);
  }
  function handleLoginErr() {
    const numFadeMs = 500;
    $(`#alert .msg`).text(`Wrong credentials!`);
    $(`#alert`).fadeIn(numFadeMs);
  }
});

$(document).ready(() => {
  $(`.parallax`).parallax();
});

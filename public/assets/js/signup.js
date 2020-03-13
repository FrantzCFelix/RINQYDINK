'use strict';

$(document).ready(() => {

  $(`.parallax`).parallax();

  const signUpForm = $(`form#signUp`);
  const usernameSignUp = $(`input#usernameSignUp`);
  const passwordSignUp = $(`input#passwordSignUp`);

  signUpForm.on(`submit`, event => {
    event.preventDefault();
    const userData = {
      username: usernameSignUp.val().trim(),
      password: passwordSignUp.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }
    signUpUser(userData.username, userData.password);
    usernameSignUp.val(``);
    passwordSignUp.val(``);
  });

  function signUpUser(username, password) {
    $.post(`/api/signup`, {
      username,
      password
    })
      .then(() => {
        window.location.replace(`/members`);
      })
      .catch(handleSignupErr);
  }

  function handleSignupErr() {
    const numFadeMs = 500;
    $(`#alert .msg`).text(`Username already exists! Pick a different one`);
    $(`#alert`).fadeIn(numFadeMs);
  }
});


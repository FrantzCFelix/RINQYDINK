'use strict';

$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $(`form#signUp`);
  const usernameSignUp = $(`input#usernameSignUp`);
  const passwordSignUp = $(`input#passwordSignUp`);

  // When the signup button is clicked, we validate the username and password are not blank
  signUpForm.on(`submit`, event => {
    event.preventDefault();
    const userData = {
      username: usernameSignUp.val().trim(),
      password: passwordSignUp.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }
    // If we have an username and password, run the signUpUser function
    signUpUser(userData.username, userData.password);
    usernameSignUp.val(``);
    passwordSignUp.val(``);
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
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
    $(`#alert .msg`).text(`Username already exists!`);
    $(`#alert`).fadeIn(numFadeMs);
  }
});

$(document).ready(() => {
  $(`.parallax`).parallax();
});

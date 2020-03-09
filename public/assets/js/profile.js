'use strict';

$(document).ready(() => {

  const passwordForm = $(`form#passwordForm`);
  const newPassword = $(`input#newPassword`);

  passwordForm.on(`submit`, event => {
    event.preventDefault();
    const userData = {
      password: newPassword.val().trim()
    };

    if (!userData) {
      return ;
    }

    resetPwd(userData);
    newPassword.val(``);
  });

  function resetPwd(password) {
    $.ajax({
      method: `PUT`,
      url: `/api/reset`,
      data: password
    }).then(() => {
      successReset();
    });
    window.location.replace(`/profile`);
  }

  function successReset() {
    const numFadeMs = 500;
    $(`#alert .msg`).text(`Your password has been updated!`);
    $(`#alert`).fadeIn(numFadeMs);
  }
});

$(document).ready(() => {
  $(`.sidenav`).sidenav();
});

$(document).ready(() => {
  $.get(`/api/user_data`).then(data => {
    $(`.member-name`).text(data.username);
  });
});

$(document).ready(() => {
  $(`.modal`).modal();
});

$(`.delete-score`).on(`click`, function() {
  const id = $(this).data(`id`);
  $.ajax(`/api/highscores/${id}`, {
    type: `DELETE`
  }).then(() => {
    location.reload();
  });
});

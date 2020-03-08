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
    console.log(password);
    $.ajax({
      method: `PUT`,
      url: `/api/reset`,
      data: password
    }).then(() => {
      window.location.href = `/login`;
    });
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

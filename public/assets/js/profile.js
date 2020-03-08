'use strict';

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

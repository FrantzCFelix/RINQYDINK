'use strict';

$(document).ready(() => {
  $(`.parallax`).parallax();
});

$(document).ready(() => {
  $(`.modal`).modal();
});

$(document).ready(() => {
  $(`.sidenav`).sidenav();
});

$(document).ready(() => {
  $.get(`/api/user_data`).then(data => {
    $(`.member-name`).text(data.username);
  });
});

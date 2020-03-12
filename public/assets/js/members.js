'use strict';

$(document).ready(() => {

  $(`.parallax`).parallax();
  $(`.modal`).modal();
  $(`.sidenav`).sidenav();

  $.get(`/api/user_data`).then(data => {
    $(`.member-name`).text(data.username);
  });
});

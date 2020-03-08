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

$(`.delete-score`).on(`click`, function() {
  const id = $(this).data(`id`);
  $.ajax(`/api/highscores/${id}`, {
    type: `DELETE`
  }).then(() => {
    location.reload();
  });
});

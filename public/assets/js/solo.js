'use strict';

$(`.delete-score`).on(`click`, function () {
  const id = $(this).data(`id`);
  // eslint-disable-next-line prefer-template
  $.ajax(`/api/highscores/` + id, {
    type: `DELETE`
  }).then(() => {
    location.reload();
  });
});

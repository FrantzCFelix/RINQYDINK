'use strict';

$(document).ready(() => {

  $(`.sidenav`).sidenav();

  $(`.carousel`).carousel({
    padding: 200,
    fullWidth: true,
    indicators: true
  }).css(`height`, $(window).height());
  autoplay();
  function autoplay() {
    $(`.carousel`).carousel(`next`);
    // eslint-disable-next-line no-magic-numbers
    setTimeout(autoplay, 5000);
  }
});

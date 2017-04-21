(function() {
  const backButton = document.querySelector('.js-history-back');

  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.history.back();
    });
  }
})();

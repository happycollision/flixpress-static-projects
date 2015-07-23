// Do a little work as soon as possible (before page is done loading is fine):

var popStyles = {
  width: '100%',
  backgroundColor: 'grey',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  scroll: 'auto'
};
var closeButtonStyles = {
  cursor: 'pointer',
  position: 'absolute',
  top: 5,
  right: 5,
  padding: '2px',
  backgroundColor: 'white'
};

var $pop = $('<div class="flixpress-modal"></div>');
var $closeButton = $('<div class="flixpress-modal-close-button">X</div>');

$closeButton.css(closeButtonStyles);

$pop.css(popStyles).append($closeButton).hide();

$(document).ready(function(){
  // append to body ASAP, ready for action
  $pop.appendTo('body');

  $('body').on('click', '.modal', function(e){
    // stop href from working
    e.preventDefault();

    // TODO: add content to pop-over

    // show pop-over
    $pop.show('slide', {direction: 'down'});

    // close pop-over
    $pop.on('click', '.flixpress-modal-close-button', function(){
      $pop.hide('slide', {direction: 'down'});
    });
  });
});
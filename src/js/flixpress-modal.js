var popStyles = {
  width: '100%',
  backgroundColor: 'grey',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0
};
var $pop = $('<div class="flixpress-modal"></div>');
var $closeButton = $('<div class="flixpress-modal-close-button">X</div>');

$closeButton.css({
  cursor: 'pointer',
  position: 'absolute',
  top: 5,
  right: 5,
  padding: '2px',
  backgroundColor: 'white'
});

$pop.css(popStyles).append($closeButton).hide();

$(document).ready(function(){
  $('.modal').on('click', function(){
    $pop.appendTo('body').show('slide');

    // TEMPORARY
    $pop.on('click', '.flixpress-modal-close-button', function(){
      $pop.hide('slide');
    });
  });
});
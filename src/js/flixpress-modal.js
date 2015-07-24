// Do a little work as soon as possible (before page is done loading is fine):

var popStyles = {
  boxSizing: 'border-box',
  width: '100%',
  backgroundColor: 'white',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  scroll: 'auto',
  borderTop: '2px solid grey',
  padding: 10,
  paddingTop: 51,
  overflow: 'auto',
  zIndex: 1000
};
var toolbarStyles = {
  boxSizing: 'border-box',
  height: 41,
  width: '100%',
  padding: 5,
  backgroundColor: '#eee',
  borderBottom: '1px solid #ccc',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1001
};
var closeButtonStyles = {
  boxSizing: 'border-box',
  cursor: 'pointer',
  position: 'relative',
  height: 30,
  margin: 0,
  padding: 6,
  backgroundColor: 'white',
  float: 'right'
};
var $pop = $('<div class="flixpress-modal"></div>');
var $popContent = $('<div class="flixpress-modal-content"></div>');
var $toolbar = $('<div class="flixpress-toolbar"><img src="images/flix-gear.png" /></div>');
var $closeButton = $('<div class="flixpress-modal-close-button">Close</div>');

$toolbar.css(toolbarStyles).hide();

$closeButton.css(closeButtonStyles).prependTo($toolbar);

$pop.css(popStyles).append($popContent).hide();

$(document).ready(function(){
  // append to body ASAP, ready for action
  $pop.appendTo('body');
  $toolbar.appendTo('body');

  $('body').on('click', '.modal', function(e){
    // stop href from working
    e.preventDefault();

    // TODO: add real content to pop-over
    $popContent.html($('.modal-content').html());

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});

    // show pop-over
    $pop.show('slide', {direction: 'down'}, function(){
      $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
    });

    // close pop-over
    $('body').on('click', '.flixpress-modal-close-button', function(){
      // Allow body scrolling again
      $('body').css({overflow: 'auto'});
      
      // hide pop-over and toolbar
      $pop.hide('slide', {direction: 'down'});
      $toolbar.hide('slide', {direction: 'up'});
    });
  });
  //$('.modal.button').click();
});
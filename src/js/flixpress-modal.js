(function(){

  // Do a little work as soon as possible (before page is done loading is fine):

  var $modalFull = $('<div class="flixpress-full-modal"></div>');
  var $modalContent = $('<div class="flixpress-modal-content"></div>');
  var $toolbar = $('<div class="flixpress-modal-toolbar"><img src="images/flix-gear.png" /></div>');
  var $closeButton = $('<div class="flixpress-modal-close-button">Close</div>');

  $toolbar.hide();
  $closeButton.prependTo($toolbar);
  $modalFull.append($modalContent).hide();

  function showModal(size, content){
    
    // TODO: add real content to pop-over
    $modalContent.html(content);

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});

    if (size === 'full') {
    $modalFull.show('slide', {direction: 'down'}, function(){
      $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
        }
      );

    } else {

    }
  }

  function closeModal(){
    // Allow body scrolling again
    $('body').css({overflow: 'auto'});
    
    // hide pop-over and toolbar
    $modalFull.hide('slide', {direction: 'down'});
    $toolbar.hide('slide', {direction: 'up'});
  }

  $(document).ready(function(){
    // append to body ASAP, ready for action
    $modalFull.appendTo('body');
    $toolbar.appendTo('body');

    $('body').on('click', '.modal', function(e){
      // stop href from working
      e.preventDefault();


      // show pop-over
      showModal('full', $('.modal-content').html());
      // close pop-over
      $('body').on('click', '.flixpress-modal-close-button', closeModal);
    });
    $('.modal.button').click();
  });

})();

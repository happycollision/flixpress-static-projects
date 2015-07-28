(function(){

  // Do a little work as soon as possible (before page is done loading is fine):

  var $modalFull = $('<div class="flixpress-full-modal"></div>');
  var $modalPartial = $('<div class="flixpress-partial-modal"></div>');
  var $modalContent = $('<div class="flixpress-modal-content"></div>');
  var $toolbar = $('<div class="flixpress-modal-toolbar"><img src="images/flix-gear.png" /></div>');
  var $closeButton = $('<div class="flixpress-modal-close-button">Close</div>');

  $toolbar.hide();
  $closeButton.prependTo($toolbar);
  $modalFull.append($modalContent).hide();
  $modalPartial.hide();

  function showModal(size, content){
    if (content !== false){
      // TODO: add real content to pop-over
      $modalContent.html(content);      
    } else {
      $modalContent.html("Content not found.");      
    }

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});

    var whichModal;
    if (size === 'full') {
      $modalFull.show('slide', {direction: 'down'}, function(){
        $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
          }
        );
      whichModal = $modalFull;
    } else {
      $modalPartial.show('slide');
      whichModal = $modalPartial;
    }
    
    // bind certain events to close the modal
    $('body').on('click.fpModalClose', '.flixpress-modal-close-button', closeModal);
    $(document).on('keyup.fpModalClose', function(e){
      if (e.which === 27){
        closeModal(whichModal);
      }
    });
  }

  function closeModal(whichModal){
    // Allow body scrolling again
    $('body').css({overflow: 'auto'});
    
    // hide pop-over and toolbar
    whichModal.hide('slide', {direction: 'down'});
    $toolbar.hide('slide', {direction: 'up'});

    //unbind the modal close event
    $(document).off('.fpModalClose');
  }

  function chooseContent (clickedElement) {
    if ($(clickedElement).data().modalContentName !== undefined){
      var contentName = $(clickedElement).data().modalContentName;
      return $('[data-modal-content-for="' + contentName + '"]').html();
    } else if ($(clickedElement).data().modalContentAddress !== undefined){
      var address = $(clickedElement).data().modalContentAddress;
      return '<iframe src="'+ address +'"></iframe>';
    } else if ($(clickedElement).data().modalContent !== undefined) {
      return $(clickedElement).data().modalContent;
    }

    return false;
  }

  function chooseSize (clickedElement) {
    if ($(clickedElement).hasClass('full-modal')){
      return 'full';    
    } else {
      return 'partial';
    }
  }

  $(document).ready(function(){
    // append to body ASAP, ready for action
    $modalFull.appendTo('body');
    $modalPartial.appendTo('body');
    $toolbar.appendTo('body');

    $('body').on('click', '.modal', function(e){
      // stop href from working
      e.preventDefault();

      // choose content for modal
      var content = chooseContent(this);
      var size = chooseSize(this);
      // show pop-over
      showModal(size, content);
      // close pop-over on events

    });
    //$('.modal.button:last').click();
  });

})();

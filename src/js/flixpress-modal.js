(function(){

  // Do a little work as soon as possible (before page is done loading is fine):

  var $modalFull = $('<div class="flixpress-full-modal"></div>');
  var $modalPartial = $('<div class="flixpress-partial-modal"></div>');
  var $modalContent = $('<div class="flixpress-modal-content"></div>');
  var $toolbar = $('<div class="flixpress-modal-toolbar"><img src="images/flix-gear.png" /></div>');
  var $closeButton = $('<div class="flixpress-modal-close-button">Close</div>');
  var $shade = $('<div class="flixpress-shade"><div>');

  $toolbar.hide();
  $closeButton.prependTo($toolbar).clone().prependTo($modalPartial);
  $modalFull.hide();
  $modalPartial.hide();
  $shade.css({display: 'none', opacity: 0}).appendTo('body');

  function partialModalCss(properties){
    // Possible Properties:
    // `widthNum`, `widthPercent`, `heightNum`, `heightPercent`
    // `marginTopNum`, `marginTopPercent`
    // `marginSidesNum`, `marginSidesPercent`
    // `maxMargin`, `minMargin`
    // Pixels beat percentages

    // NOTE: only widthPercent and heightPercent are usable now

    var defaults = {
      //minMargin: 12,
      //maxMargin: -1,
      widthPercent: 80,
      heightPercent: 80,
      //heightNum: -1,
    };

    $.extend(defaults,properties);

    var object = {
      width: defaults.widthPercent+'%',
      height: defaults.heightPercent+'%',
      //height: 400,
      marginLeft: (100 - defaults.widthPercent)/2 +'%',
      marginRight: (100 - defaults.widthPercent)/2 +'%',
      position: 'fixed',
      top: (100 - defaults.heightPercent)/2 +'%', 
    };
    return object;
  }

  function modalSizeChange(properties){
    $('.flixpress-partial-modal').animate(partialModalCss(properties));
  }

  function showModal(size, content){
    var $thisModal = (size === 'full') ? $modalFull : $modalPartial;
    
    if (content !== false){
      // TODO: add real content to pop-over
      $modalContent.html(content);      
    } else {
      $modalContent.html("Content not found.");      
    }

    $thisModal.append($modalContent);

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});

    if (size === 'full') {
      $thisModal.show('slide', {direction: 'down'}, function(){
        $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
          }
        );
    } else {
      $thisModal.css(partialModalCss()).show('slide');
      $shade.css({display: 'block'}).animate({opacity: 0.85});
    }
    
    // bind certain events to close the modal
    $('body').on('click.fpModalClose', '.flixpress-modal-close-button', function(){
      closeModal($thisModal);
    });
    $(document).on('keyup.fpModalClose', function(e){
      if (e.which === 27){
        closeModal($thisModal);
      }
    });
  }

  function closeModal($thisModal){
    // Allow body scrolling again
    $('body').css({overflow: 'auto'});
    
    // hide pop-over and toolbar
    $thisModal.hide('slide', {direction: 'down'});
    $toolbar.hide('slide', {direction: 'up'});
    $shade.animate({opacity: 0}, function(){
        $(this).css({display: 'none'});
      });

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

  window.flixpressModalSizeChange = modalSizeChange;
})();

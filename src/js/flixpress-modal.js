(function ($){

  // Flixpress Modal Options
  var fmo = {
    classNamePrefix: 'flixpress-modal-',
    toolbarImageSrc: 'images/flix-gear.png'
  };

  // Do a little work as soon as possible (before page is done loading is fine):

  var $modalFull = $('<div class="' + fmo.classNamePrefix + 'full"></div>');
  var $modalPartial = $('<div class="' + fmo.classNamePrefix + 'partial"></div>');
  var $modalContent = $('<div class="' + fmo.classNamePrefix + 'content"></div>');
  var $toolbar = $('<div class="' + fmo.classNamePrefix + 'toolbar"><img src="'+ fmo.toolbarImageSrc + '" /></div>');
  var $closeButton = $('<div class="' + fmo.classNamePrefix + 'close-button">Close</div>');
  var $shade = $('<div class="' + fmo.classNamePrefix + 'shade"><div>');

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
    $('.' + fmo.classNamePrefix + 'partial').animate(partialModalCss(properties));
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
      $shade.clone().appendTo('body').css({display: 'block'}).animate({opacity: 0.85});
    }
    
    // bind certain events to close the modal
    $('body').on('click.fpModalClose', '.' + fmo.classNamePrefix + 'close-button', function(){
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
    $('.' + fmo.classNamePrefix + 'shade').animate({opacity: 0}, function(){
        $(this).remove();
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

  function modalize (element, clickEvent) {
    clickEvent.preventDefault();
    // choose content for modal
    var content = chooseContent(element);
    var size = chooseSize(element);
    // show pop-over
    showModal(size, content);
    // close pop-over on events
  }

  $(document).ready(function(){
    // append to body ASAP, ready for action
    $modalFull.appendTo('body');
    $modalPartial.appendTo('body');
    $toolbar.appendTo('body');

    $('body').on('click', '.modal', function(e){
      modalize(this, e);
    });
  });

  // register the above functionality as a jQuery Plugin
  $.fn.flixpressModal = function () {
    return this.each(function () {
      // Do something to each selected element.
      $(this).on('click', function(e){
        modalize(this, e);
      });
    });
  };

  window.flixpressModalSizeChange = modalSizeChange;
})(jQuery);

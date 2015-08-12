(function ($){

  // Flixpress Modal Options
  var fmo = {
    classNamePrefix: 'flixpress-modal-',
    toolbarImageSrc: 'images/flix-gear.png',
    preferredSize: 'partial',
    alternateSizeClassName: 'full-modal',
    partialModalProperties: false, // use definititions below
    automaticRunClassName: 'modal', // add this class to any element to run autmatically on load

  };

  $.flixpressModal = function (options) {
    fmo = $.extend(fmo, options);
  };

  // Do a little work as soon as possible (before page is done loading is fine):
  var $div = $('<div></div>');
  var $modal = $div.clone().addClass(fmo.classNamePrefix + 'main');
  var $container = $div.clone().addClass(fmo.classNamePrefix + 'container');
  var $modalContent = $div.clone().addClass(fmo.classNamePrefix + 'content');
  var img = new Image();
  img.src = fmo.toolbarImageSrc;
  var $toolbar = $div.clone().addClass(fmo.classNamePrefix + 'toolbar').prepend(img).hide();
  var $closeButton = $div.clone().addClass(fmo.classNamePrefix + 'close-button').html('Close');
  var $shade = $div.clone().addClass(fmo.classNamePrefix + 'shade');

  $modal.append($toolbar);
  $container.append($modal);
  
  $closeButton.prependTo($toolbar);
  $shade.css({display: 'none', opacity: 0}).appendTo('body');

  function modalCss(properties){
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

    if (fmo.partialModalProperties !== false){
      $.extend(defaults, fmo.partialModalProperties, properties);
    } else {
      $.extend(defaults, properties);      
    }

    var object = {
      width: defaults.widthPercent+'%',
      height: defaults.heightPercent+'%',
      //height: 400,
      //marginLeft: (100 - defaults.widthPercent)/2 +'%',
      //marginRight: (100 - defaults.widthPercent)/2 +'%',
      position: 'fixed',
      top: (100 - defaults.heightPercent)/2 +'%', 
      left: (100 - defaults.widthPercent)/2 +'%',
    };
    console.log(object)
    return object;
  }

  function modalSizeChange(properties){
    $container.animate(modalCss(properties));
  }

  function showModal(size, content){
    var $thisModal = $modal;
    
    if (content !== false){
      // TODO: add real content to pop-over
      $modalContent.html(content);      
    } else {
      $modalContent.html("Content not found.");      
    }

    $thisModal.append($modalContent);

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});
    $container.css(modalCss()).show();
    $thisModal.show('slide', function(){
      $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
    });

    $shade.clone().appendTo('body').css({display: 'block'}).animate({opacity: 0.85});
    
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
    $thisModal.hide('slide', {direction: 'down'}, function(){
      $container.hide();
    });
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
    if ($(clickedElement).hasClass(fmo.alternateSizeClassName)){
      return 'full';    
    } else {
      return fmo.preferredSize;
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
    $container.appendTo('body');

    $('body').on('click', '.' + fmo.automaticRunClassName, function(e){
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

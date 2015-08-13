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

  var $div, $modal, $container, $modalContent, img, $toolbar, $closeButton, $shade;

  $.flixpressModal = function (options) {
    fmo = $.extend(fmo, options);
    
    // Set all variables
    $div = $('<div></div>');
    $modal = $div.clone().addClass(fmo.classNamePrefix + 'main');
    $container = $div.clone().addClass(fmo.classNamePrefix + 'container');
    $modalContent = $div.clone().addClass(fmo.classNamePrefix + 'content');
    img = new Image();
    img.src = fmo.toolbarImageSrc;
    $toolbar = $div.clone().addClass(fmo.classNamePrefix + 'toolbar').prepend(img).hide();
    $closeButton = $div.clone().addClass(fmo.classNamePrefix + 'close-button').html('Close');
    $shade = $div.clone().addClass(fmo.classNamePrefix + 'shade');

    $modal.append($toolbar);
    $container.append($modal);
    $closeButton.prependTo($toolbar);
    $shade.css({display: 'none', opacity: 0});
    
    window.flixpressModalSizeChange = modalSizeChange;

    $(document).ready(function(){
      $shade.appendTo('body');
      $container.appendTo('body');

      $('body').on('click', '.' + fmo.automaticRunClassName, function(e){
        modalize(this, e);
      });      
    });
  };

  // Do a little work as soon as possible (before page is done loading is fine):

  function modalCss(properties){
    // Possible Properties:
    // `widthPercent`, `heightPercent`

    var defaults = {
      widthPercent: 80,
      heightPercent: 80,
    };

    if (fmo.partialModalProperties !== false){
      $.extend(defaults, fmo.partialModalProperties, properties);
    } else {
      $.extend(defaults, properties);      
    }

    var object = {
      width: defaults.widthPercent+'%',
      height: defaults.heightPercent+'%',
      position: 'fixed',
      top: (100 - defaults.heightPercent)/2 +'%', 
      left: (100 - defaults.widthPercent)/2 +'%',
    };
    return object;
  }

  function modalSizeChange(properties){
    $container.animate(modalCss(properties));
  }

  function showModal(size, content){
    if (content !== false){
      $modalContent.html(content);      
    } else {
      $modalContent.html("Content not found.");      
    }

    $modal.append($modalContent);

    // Prevents a bug where the first click is not animated
    $modal.show().hide();

    // Freeze body scrolling
    $('body').css({overflow: 'hidden'});
    
    if (size === 'full') {
      $container.css(modalCss({widthPercent:100,heightPercent: 100})).show({duration: 0});    
    } else {
      $container.css(modalCss()).show({duration: 0});
    }
    
    $modal.show('slide', {direction: 'down'}, function(){
      $toolbar.show('slide', {direction: 'up', easing: 'easeOutBounce', duration: 800});
    });

    $shade.clone().appendTo('body').css({display: 'block'}).animate({opacity: 0.85});
    
    // bind certain events to close the modal
    $('body').on('click.fpModalClose', '.' + fmo.classNamePrefix + 'close-button', function(){
      closeModal($modal);
    });
    $(document).on('keyup.fpModalClose', function(e){
      if (e.which === 27){
        closeModal($modal);
      }
    });
  }

  function closeModal(){
    // Allow body scrolling again
    $('body').css({overflow: 'auto'});
    
    // hide pop-over and toolbar
    $modal.hide('slide', {direction: 'down'}, function(){
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

  // register the above functionality as a jQuery Plugin
  $.fn.flixpressModal = function () {
    return this.each(function () {
      // Do something to each selected element.
      $(this).on('click', function(e){
        modalize(this, e);
      });
    });
  };

})(jQuery);

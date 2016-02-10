(function (containerSelector, slidersSelector) {
var $container = $(containerSelector)
var $sliders = $container.find(slidersSelector);

function storeCss ($object, type) {
  var typesArray = {
      positioning: ['top', 'left', 'position'],
      visibility: ['opacity']
    };
  var css = $object.css(typesArray[type]);
  if (type === 'positioning') {
    $object.css({
      top: $object.position().top,
      left: $object.position().left,
    });
    
    // Fixes a bug (?) in Safari...
    css.top = $object.position().top;
    css.left = $object.position().left;
  }

  $object.data( type, css );
}

function hideSiblings ($siblings, sibsReadyPromise) {
  // Now we can safely start animating the clicked element
  sibsReadyPromise.resolve();

  // Step two
  storeCss($siblings, 'visibility');
  $siblings.animate({opacity: 0}, 250, 'linear', function(){
    $siblings.css('visibility', 'hidden');
  });
};

function showSiblings ($siblings, sibsReadyPromise) {
  $siblings.css('visibility', 'visible');
  $siblings.animate($siblings.data('visibility'), function(){
    
  });
  sibsReadyPromise.resolve();
}

function makeActive (element){
  var $el = $(element),
    $sibsProm = $.Deferred();
    $elProm = $.Deferred();
    
  $container.trigger('sliderWillBeActive', [ element, $el.next('.details')[0] ]);
  
  $el.parent().css('height', $el.parent().css('height'));
  
  $el.parent().children('.subject')
    .data('active', 'unavailable')
    .each(function(){
      storeCss($(this), 'positioning');
    })
    .css('position', 'absolute')
    .parent() //// ! Scope Change
    .css({paddingLeft: ($el.outerWidth(true) / $el.parent().innerWidth() * 100) + '%'})
    .children('.details') //// ! Scope Change
    .css('width', '100%')
  ;
  
  // Start animating Siblings
  hideSiblings($el.siblings('.subject'), $sibsProm);
  $sibsProm.done(function(){
    showDetails($el);
    $el.animate({left: 0}, 800, 'easeOutCubic', function(){
      $el.data('active', true).addClass('active');
      // Trigger an event that passes this element and the subject div 
      $container.trigger('sliderActive', [ element, $el.next('.details')[0] ]);
    });    
  });
}

function makeInactive (element){
  var $el = $(element),
    $sibsProm = $.Deferred();
    $elProm = $.Deferred();

  $el.data('active','unavailable').removeClass('active');
  // Trigger an event that passes this element and the subject div 
  $container.trigger('sliderWillBeInactive', [ element, $el.next('.details')[0] ]);

  hideDetails($el);

  $el.animate($el.data('positioning'), function(){
    $elProm.resolve()
  });

  showSiblings($el.siblings('.subject'), $sibsProm);

  $.when($elProm, $sibsProm).then(function(){
    $el.data('active', false);
    $el.siblings().data('active', false);
    $el.parent()
      .css('padding-left',0)
      .children('.subject') //// ! Scope Change
      .each(function(){
        $(this).css( $(this).data('positioning') );
      })
    ;
    $container.trigger('sliderInactive', [ element, $el.next('.details')[0] ]);
  });
};

function showDetails ($el) {
  $el.next('.info-slider.details').css({
    top: $el.position().top,
    left: $el.outerWidth(),
    display: 'block',
    opacity: 0
  }).animate({opacity: 1});
}
function hideDetails ($el) {
  $el.next('.info-slider.details').animate({opacity: 0}, function(){
    $(this).css('display', 'none');
  });
}

function resizeContainer($el, $children) {
  var maxHeight = 0;
  if ($children === undefined) {
    $children = $el.children().filter(':visible');
  }

  $children.each(function(){
    var tempHeight = $(this).outerHeight(true);
    maxHeight = (maxHeight < tempHeight) ? tempHeight : maxHeight ;
  });
  var elPadding = $el.outerHeight() - $el.innerHeight();
  $el.animate({height: maxHeight + elPadding}, function(){
    $el.css({
      height: 'auto',
      minHeight: $el.children().filter('.subject:visible').outerHeight(true)
    });
  });
}

$container.removeClass('no-js').addClass('js');
$sliders.data('active', false);
$sliders.css('clear', 'none').siblings().filter('.details').css('display', 'none');
$container.on('click', '.subject', function(e){
  e.preventDefault(); // might be on a no-click link
  if ($(this).data('active') === false) {
    makeActive(this);
    resizeContainer($container)
  } else if ($(this).data('active') === true) {
    makeInactive(this);
    resizeContainer($container, $sliders)
  }
});
})('.info-sliders','.info-slider.subject')

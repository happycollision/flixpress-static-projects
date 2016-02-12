var showMoreText = "Show more";
var showLessText = "Show less";
$(document).ready(function(){
  // Take care of show more and show less
  var $more = $('.more-info');
  $more.html(showMoreText);
  $more.on('click', function(){
    $(this).closest('table, ul').find('.secondary-feature').toggle();
    if($(this).html() === showMoreText){
      $(this).html(showLessText);
    } else {
      $(this).html(showMoreText);
    }
  });
  $more.show();

  // take care of explainers
  $('.explainer').show().click(function(e){
    e.preventDefault();
  });
  $('.explainer').hover(function(){
    var href = $(this).attr('href');
    var html = $(href).html();
    var explainDiv = $('<div class="explain-div"></div>');

    explainDiv.hide().html(html).css({
      position: 'absolute',
      top: $(this).position().top + 'px',
      left: ($(this).position().left + 20) + 'px'
    });
    explainDiv.appendTo($('body')).show();
  }, function(){
    $('.explain-div').remove();
  });

});
var showMoreText = "Show more";
var showLessText = "Show less";
$(document).ready(function(){
  var $more = $('.more-info');
  $more.html(showMoreText);
  $more.on('click', function(){
    $(this).siblings('.secondary-feature').toggle();
    if($(this).html() === showMoreText){
      $(this).html(showLessText);
    } else {
      $(this).html(showMoreText);
    }
  });
  $more.show();
});
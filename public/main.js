this.word = '';
this.picArray = [];
//submit button
var submitWord = function() {
  this.word = $('#wordinput').val();
  //moveProgressBar();
  $.post('/', {
    word: this.word
  }, function(res) {
    //console.log(res.picurls);
  });
  //getImages(this.word);
}

// progress bar
function moveProgressBar() {
  var getPercent = ($('.progress-wrap').attr('progress-percent') / 100);
  console.log(getPercent);
  var getProgressWrapWidth = $('.progress-wrap').width();
  var progressTotal = getPercent * getProgressWrapWidth;
  var animationLength = 1500;

  // on page load, animate percentage bar to data percentage length
  // .stop() used to prevent animation queueing
  console.log($('.progress-bar'));
  $('.progress-bar').animate({
    left: progressTotal
  }, animationLength);
}

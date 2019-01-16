/*
    Ripple Script
*/

$.ripple({
    ".ripple": {
        touchDelay: 300
    }
});





/*
    Bullet Progress Bar
*/

var stepsSum = 7;

var $progress = $('#progress .progress-bar');
  
// Attach 'step' event on container.
$progress.on('step', function(e, stepIndex) {
    $progress.css('width', (stepIndex / stepsSum * 100) + '%');
});
  
// Trigger first bullet
$progress.trigger('step', 0);
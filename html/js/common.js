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

var steps = [1, 1, 1, 1, 1, 1, 1];

var $container = $('.bullet-progress'),
    $progress = $container.find('.progress-bar .progress');
  
// Add up all the steps together
var stepsSum = 0;
steps.forEach(function(el){ stepsSum += el; });
stepsSum = Math.floor(stepsSum + 1);
  
// Add bullets accordingly
for( var i = 0; i < stepsSum; i++ ) {
    var $bullet = $('<a href="#" data-i="' + i + '"></a>');
    $bullet.css('left', i * 100 / (stepsSum - 1) + '%');
    $container.append($bullet);
}
  
// Attach 'step' event on container.
$container.on('step', function (e, stepIndex) {
    
    window.document.title = stepIndex;
    
    // Move the progress bar to desired step
    var step = 0;
    steps.slice(0, stepIndex).forEach(function(el){ step += el; });
    $progress.css('width', ( step / (stepsSum - 1) * 100) + '%');
    
    // Reset bullets
    $container.find('[data-i]').removeClass('active');
    
    // Activate bullets up to current point
    for(var i = 0; i < Math.floor(step + 1); i++)
        $container.find('[data-i="' + i + '"]').addClass('active');
    
    // Update container index reference
    $container.data('stepIndex', stepIndex);
    
});
  
// Trigger first bullet
$container.trigger('step', 0);
  
// Bind buttons (this is separate from the
// bullet-progress logic) and can be put elsewhere
$('#buttons a').on('click', function (e) {
    
    // Get current index
    var i = $container.data('stepIndex');
    
    // Increment or decrement according to direction
    i += $(this).hasClass('next') ? 1 : -1;
    
    // Set limits
    if (i < 0) i = 0;
    if (i > steps.length) i = steps.length;
    
    // Trigger event
    $container.trigger('step', i);

});
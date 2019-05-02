$progress.trigger('step', 7);

$('#checkboxAccept').on('click', function() {
    if($(this).is(':checked'))
        $('#btnFinish').css('visibility', 'visible');
    else
        $('#btnFinish').css('visibility', 'hidden');
});
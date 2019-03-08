$progress.trigger('step', 1);





var softwareVersion = "";
var newVersion      = "";

var checkUpdateInterval;





// Get Installed Current Version
$.get({
    url: 'api.php?get=settings',
    error: function() { performUpdate(); },
    success: function(json) {
        if(json.hasOwnProperty('Version') && json['Version'].hasOwnProperty('0')) {
            softwareVersion = `v${json['Version']['0']['V1']}.${json['Version']['0']['V2']}.${json['Version']['0']['V3']}`;
            newVersion = softwareVersion;
        }
        performUpdate();
    }
});





function performUpdate()
{
    // Check Network Connection
    $.get({
        url: "https://api.batterx.io",
        dataType: 'text',
        cache: false,
        error: function() {
            // Connection LOST
            $("#loading").hide();
            $("#message").html(lang['no_internet_connection']).css('color', 'red');
            $("#error").show();
            $("#errorInfo").removeClass('d-none');
            setTimeout(performUpdate, 5000);
        },
        success: function() {

            // Search for Updates
            $("#loading").show();
            $("#error").hide();
            $("#errorInfo").addClass('d-none');
            $('#message').html(lang['searching_for_updates']).css('color', 'black');
            
            // Get Latest Version Number
            $.get({
                url: "https://raw.githubusercontent.com/batterX/LiveSmart-Home/master/version.txt",
                dataType: 'text',
                cache: false,
                error: function() {
                    $("#loading").hide();
                    $("#message").html(lang['no_internet_connection']).css('color', 'red');
                    $("#error").show();
                    $("#errorInfo").removeClass('d-none');
                    setTimeout(performUpdate, 2500);
                },
                success: function(versionNum) {
                    // Compare Versions
                    if(softwareVersion != versionNum) {
                        newVersion = versionNum;
                        // Download Update
                        $.post('cmd/update.php');
                        // Downloading Update...
                        $('#message').html(lang['downloading_update']);
                        clearInterval(checkUpdateInterval);
                        checkUpdateInterval = undefined;
                        checkUpdateInterval = setInterval(checkUpdate_waitForError, 5000);
                    } else {
                        // Update Completed
                        $("#loading").hide();
                        $("#message").html(lang['update_completed']).css('color', '#25ae88');
                        $("#success").show();
                        setTimeout(function() {
                            window.location.href = "installer_login.php?software_version=" + newVersion;
                        }, 5000);
                    }
                }
            });

        }
    });
}





function checkUpdate_waitForError() {
    $.get({
        url: 'cmd/working.txt',
        cache: false,
        error: function() {
            // Rebooting...
            $('#message').html(lang['rebooting']);
            clearInterval(checkUpdateInterval);
            checkUpdateInterval = undefined;
            checkUpdateInterval = setInterval(checkUpdate_waitForSuccess, 5000);
        },
        success: function(response) {
            if(response) return;
            // Rebooting...
            $('#message').html(lang['rebooting']);
            clearInterval(checkUpdateInterval);
            checkUpdateInterval = undefined;
            checkUpdateInterval = setInterval(checkUpdate_waitForSuccess, 5000);
        }
    });
}

function checkUpdate_waitForSuccess() {
    $.get({
        url: 'cmd/working.txt',
        cache: false,
        success: function(response) {
            if(!response) return;
            // Finishing Update...
            $('#message').html(lang['finishing_update']);
            clearInterval(checkUpdateInterval);
            checkUpdateInterval = undefined;
            setTimeout(function() {
                // Update Completed
                $("#loading").hide();
                $('#message').html(lang['update_completed']).css('color', '#25ae88');
                $("#success").show();
                setTimeout(function() {
                    window.location.href = "installer_login.php?software_version=" + newVersion;
                }, 5000);
            }, 60000);
        }
    });
}
$progress.trigger('step', 1);





var softwareVersion = "";
var newVersion      = "";

var checkUpdateInterval;





$.get({
    url: 'api.php?get=settings',
    success: function(json) {
        if(json.hasOwnProperty('Version') && json['Version'].hasOwnProperty('0'))
            softwareVersion = `v${json['Version']['0']['V1']}.${json['Version']['0']['V2']}.${json['Version']['0']['V3']}`;
        performUpdate();
    },
    error: function(err) {
        performUpdate();
    }
})





function checkConnection() {
    return $.get({
        url: "https://api.batterx.io",
        dataType: 'text',
        cache: false,
    });
}

function checkLatestVersion() {
    return $.get({
        url: "https://raw.githubusercontent.com/batterX/LiveSmart-Home/master/version.txt",
        dataType: 'text',
        cache: false,
    });
}





function performUpdate()
{
    // Check Connection
    checkConnection().done(function() {
        // Search for Updates
        $("#loading").show();
        $("#error").hide();
        $("#errorInfo").addClass('d-none');
        $('#message').html(lang[2][1]).css('color', 'black');
        checkLatestVersion().done(function(versionNum) {
            // Compare Versions
            if(softwareVersion != versionNum) {
                newVersion = versionNum;
                // Download Update
                $.ajax({
                    type: 'POST',
                    url: 'cmd/update.php',
                    success: function() {}
                });
                // Downloading Update...
                $('#message').html(lang[2][2]);
                clearInterval(checkUpdateInterval);
                checkUpdateInterval = undefined;
                checkUpdateInterval = setInterval(checkUpdate_waitForError, 5000);
            } else {
                // Update Completed
                $("#loading").hide();
                $("#message").html(lang[2][5]).css('color', '#25ae88');
                $("#success").show();
                setTimeout(function() {
                    window.location.href = "installer_login.php";
                }, 5000);
            }
        }).fail(function(jqXR, textStatus, errorThrown) {
            $("#loading").hide();
            $("#message").html(lang[2][6]).css('color', 'red');
            $("#error").show();
            $("#errorInfo").removeClass('d-none');
            setTimeout(performUpdate, 2500);
        });
    }).fail(function(jqXR, textStatus, errorThrown) {
        // Connection LOST
        $("#loading").hide();
        $("#message").html(lang[2][6]).css('color', 'red');
        $("#error").show();
        $("#errorInfo").removeClass('d-none');
        setTimeout(performUpdate, 2500);
    });
}





function checkUpdate_waitForError() {
    $.ajax({
        type: 'GET',
        url: 'cmd/working.txt',
        cache: false,
        success: function(response) {
            if(response) {
                // don't care, just ignore
            } else {
                // Rebooting...
                $('#message').html(lang[2][3]);
                clearInterval(checkUpdateInterval);
                checkUpdateInterval = undefined;
                checkUpdateInterval = setInterval(checkUpdate_waitForSuccess, 5000);
            }
        },
        error: function() {
            // Rebooting...
            $('#message').html(lang[2][3]);
            clearInterval(checkUpdateInterval);
            checkUpdateInterval = undefined;
            checkUpdateInterval = setInterval(checkUpdate_waitForSuccess, 5000);
        }
    });
}

function checkUpdate_waitForSuccess() {
    $.ajax({
        type: 'GET',
        url: 'cmd/working.txt',
        cache: false,
        success: function(response) {
            if(response) {
                // Finishing Update...
                $('#message').html(lang[2][4]);
                clearInterval(checkUpdateInterval);
                checkUpdateInterval = undefined;
                setTimeout(function() {
                    // Update Completed
                    $("#loading").hide();
                    $('#message').html(lang[2][5]).css('color', '#25ae88');
                    $("#success").show();
                    setTimeout(function() {
                        window.location.href = "installer_login.php?software_version=" + newVersion;
                    }, 5000);
                }, 60000);
            } else {
                // don't care, just ignore
            }
        },
        error: function() {
            // don't care, just ignore
        }
    });
}
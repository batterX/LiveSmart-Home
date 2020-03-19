$progress.trigger('step', 1);





var softwareVersion = "";
var newVersion      = "";

var checkUpdateInterval;





// Get Current Version (Installed)
$.get({
	url: 'api.php?get=settings',
	error: () => { performUpdate(); },
	success: (json) => {
		if(json.hasOwnProperty('Version') && json['Version'].hasOwnProperty('0')) {
			softwareVersion = `v${json['Version']['0']['v1']}.${json['Version']['0']['v2']}.${json['Version']['0']['v3']}`;
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
		error: () => {
			// Connection LOST
			$("#notif").removeClass("loading error success").addClass("error");
			$("#message").html(lang['no_internet_connection']).css('color', 'red');
			$("#errorInfo").removeClass('d-none');
			setTimeout(performUpdate, 5000); // Retry after 5 seconds
		},
		success: () => {

			// Search for Updates
			$("#notif").removeClass("loading error success").addClass("loading");
			$('#message').html(lang['searching_for_updates']).css('color', 'black');
			$("#errorInfo").addClass('d-none');

			// Get Latest Version Number
			$.get({
				url: "https://raw.githubusercontent.com/batterX/LiveSmart-Home/master/version.txt",
				dataType: 'text',
				cache: false,
				error: () => {
					$("#notif").removeClass("loading error success").addClass("error");
					$("#message").html(lang['no_internet_connection']).css('color', 'red');
					$("#errorInfo").removeClass('d-none');
					setTimeout(performUpdate, 5000);
				},
				success: (versionNum) => {

					// Compare Versions
					if(softwareVersion != versionNum)
					{
						newVersion = versionNum;
						// Download Update
						$.post('cmd/update.php');
						// Downloading Update...
						$('#message').html(lang['downloading_update']);
						clearInterval(checkUpdateInterval);
						checkUpdateInterval = undefined;
						checkUpdateInterval = setInterval(checkUpdate_waitForError, 5000);
					}
					else
					{
						// Update Completed
						$("#notif").removeClass("loading error success").addClass("success");
						$("#message").html(lang['update_completed']).css('color', '#25ae88');
						$("#btn_next").attr("disabled", false);
						setTimeout(() => { window.location.href = "installer_login.php?software_version=" + newVersion; }, 5000);
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
		error: () => {
			// Rebooting...
			$('#message').html(lang['rebooting']);
			clearInterval(checkUpdateInterval);
			checkUpdateInterval = undefined;
			checkUpdateInterval = setInterval(checkUpdate_waitForSuccess, 5000);
		},
		success: (response) => {
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
		success: (response) => {
			if(!response) return;
			// Finishing Update...
			$('#message').html(lang['finishing_update']);
			clearInterval(checkUpdateInterval);
			checkUpdateInterval = undefined;
			setTimeout(() => {
				// Update Completed
				$("#notif").removeClass("loading error success").addClass("success");
				$('#message').html(lang['update_completed']).css('color', '#25ae88');
				$("#btn_next").attr("disabled", false);
				setTimeout(() => { window.location.href = "installer_login.php?software_version=" + newVersion; }, 5000);
			}, 60000);
		}
	});
}





$('#btn_next').on('click', () => { window.location.href = "installer_login.php?software_version=" + newVersion; });

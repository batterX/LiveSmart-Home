$progress.trigger('step', 2);





function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function enableLogin() {
	var e = $('#email').val().trim();
	var p = $('#password').val().trim();
	if(e != "" && p != "" && validateEmail(e))
		$('#btn_next').attr('disabled', false);
	else
		$('#btn_next').attr('disabled', true);
}

$(document).ready(() => { enableLogin(); });
$('#email, #password').on('input change', () => { enableLogin(); });





$('#loginForm').on('submit', (e) => {

	e.preventDefault();

	if($("#email").val() != "" && $("#password").val() != "" && validateEmail($("#email").val()))
	{
		// Verify Email + Password & Return Installer Informations
		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			data: {
				action   : "retrieve_installer_info",
				email    : $('#email').val(),
				password : $('#password').val()
			},
			error: () => { alert("E001. Please refresh the page!"); },
			success: (response) => {

				console.log(response);

				// Hide ErrorMsg
				$("#errorMsg").css('visibility', 'hidden');

				// Set to Session
				if(response && typeof response === "object") {
					$.post({
						url: "cmd/session.php",
						data: {
							installer_email:     $('#email'   ).val(),
							installer_password:  $('#password').val(),
							installer_gender:    response.hasOwnProperty('gender'   ) ? response['gender'   ] : "0",
							installer_firstname: response.hasOwnProperty('firstname') ? response['firstname'] : "",
							installer_lastname:  response.hasOwnProperty('lastname' ) ? response['lastname' ] : "",
							installer_company:   response.hasOwnProperty('company'  ) ? response['company'  ] : "",
							installer_telephone: response.hasOwnProperty('telephone') ? response['telephone'] : ""
						},
						error: () => { alert("E002. Please refresh the page!"); },
						success: (response) => {
							console.log(response);
							if(response == '1') window.location.href = "customer_info.php";
							else alert("E003. Please refresh the page!");
						}
					});
				}
				// Show Error
				else $("#errorMsg").css('visibility', 'visible');

			}
		});
	}

});

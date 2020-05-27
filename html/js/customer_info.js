$progress.trigger('step', 3);










function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

$("#sameAddress").on('change', function() {
	if($(this).is(':checked'))
		$('#installationAddress').hide();
	else
		$('#installationAddress').show();
});










$.get({
	url: 'cmd/apikey.php',
	error: () => { alert("E001. Please refresh the page!"); },
	success: (response) => {



		console.log(response);
		
		if(!response || response.length != 40)
			return alert("E002. Please refresh the page!");



		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			data: {
				action: "retrieve_installation_info",
				apikey: response.toString()
			},
			error: () => { alert("E003. Please refresh the page!"); },
			success: (json) => {

				console.log(json);

				if(json != "")
				{
					// Set Customer Information
					if(json.hasOwnProperty('customer')) {
						if(
							json.customer.hasOwnProperty('gender'      ) && json.customer.gender      != "" &&
							json.customer.hasOwnProperty('firstname'   ) && json.customer.firstname   != "" &&
							json.customer.hasOwnProperty('lastname'    ) && json.customer.lastname    != "" &&
							json.customer.hasOwnProperty('email'       ) && json.customer.email       != "" &&
							json.customer.hasOwnProperty('telephone'   ) && json.customer.telephone   != "" &&
							json.customer.hasOwnProperty('country'     ) && json.customer.country     != "" &&
							json.customer.hasOwnProperty('city'        ) && json.customer.city        != "" &&
							json.customer.hasOwnProperty('zipcode'     ) && json.customer.zipcode     != "" &&
							json.customer.hasOwnProperty('address'     ) && json.customer.address     != ""
						) {
							// Set Input Values
							$("#customerInformations .email"           ).val(json.customer.email    ).attr('disabled', true);
							$("#customerInformations .gender"          ).val(json.customer.gender   );
							$("#customerInformations .first-name"      ).val(json.customer.firstname);
							$("#customerInformations .last-name"       ).val(json.customer.lastname );
							$("#customerInformations .telephone"       ).val(json.customer.telephone);
							$("#customerInformations .location-country").val(json.customer.country  );
							$("#customerInformations .location-city"   ).val(json.customer.city     );
							$("#customerInformations .location-zip"    ).val(json.customer.zipcode  );
							$("#customerInformations .location-address").val(json.customer.address  );
						}
					}
					// Set Installation Address
					if(json.hasOwnProperty('installation')) {
						if(json.installation.hasOwnProperty('country'))
							$("#installationAddress .location-country").val(json.installation.country);
						if(json.installation.hasOwnProperty('city'))
							$("#installationAddress .location-city").val(json.installation.city);
						if(json.installation.hasOwnProperty('zipcode'))
							$("#installationAddress .location-zip").val(json.installation.zipcode);
						if(json.installation.hasOwnProperty('address'))
							$("#installationAddress .location-address").val(json.installation.address);
						// Same as customer address
						if( $("#installationAddress .location-country").val() == $("#customerInformations .location-country").val() &&
							$("#installationAddress .location-city"   ).val() == $("#customerInformations .location-city"   ).val() &&
							$("#installationAddress .location-zip"    ).val() == $("#customerInformations .location-zip"    ).val() &&
							$("#installationAddress .location-address").val() == $("#customerInformations .location-address").val()
						) $("#sameAddress").attr("checked", true).trigger("change");
					}
					// Show Error Message If Different Installer And Redirect to Index
					if(json.hasOwnProperty('installer') && json.installer.hasOwnProperty('email') && json.installer.email != installerEmail) {
						alert("You are not the installer of this system therefore, you will not be able to finish the installation.");
					}
				}

			}
		});



	}
});










$("#customerInformations .email").on('change', function() {
	
	var email = $(this).val().trim();
	
	if(!validateEmail(email)) return;

	// Email can't be same as installer mail
	if(email == installerEmail.trim())
		return alert(lang.customer_same_as_installer);
	
	$.post({
		url: "https://api.batterx.io/v2/commissioning_v2.php",
		data: {
			action    : "retrieve_customer_info",
			customer  : email,
			installer : installerEmail
		},
		error: () => { alert("E004. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(
				json.hasOwnProperty('gender'      ) && json.gender      != "" &&
				json.hasOwnProperty('firstname'   ) && json.firstname   != "" &&
				json.hasOwnProperty('lastname'    ) && json.lastname    != "" &&
				json.hasOwnProperty('telephone'   ) && json.telephone   != "" &&
				json.hasOwnProperty('country'     ) && json.country     != "" &&
				json.hasOwnProperty('city'        ) && json.city        != "" &&
				json.hasOwnProperty('zipcode'     ) && json.zipcode     != "" &&
				json.hasOwnProperty('address'     ) && json.address     != ""
			) {
				// Set Input Values
				$("#customerInformations .email"           ).attr('disabled', true);
				$("#customerInformations .gender"          ).val(json.gender   );
				$("#customerInformations .first-name"      ).val(json.firstname);
				$("#customerInformations .last-name"       ).val(json.lastname );
				$("#customerInformations .telephone"       ).val(json.telephone);
				$("#customerInformations .location-country").val(json.country  );
				$("#customerInformations .location-city"   ).val(json.city     );
				$("#customerInformations .location-zip"    ).val(json.zipcode  );
				$("#customerInformations .location-address").val(json.address  );
			}

		}
	})

});










setInterval(() => {
	if(
		$("#customerInformations .gender          ").val() == "" ||
		$("#customerInformations .first-name      ").val() == "" ||
		$("#customerInformations .last-name       ").val() == "" ||
		$("#customerInformations .email           ").val() == "" ||
		$("#customerInformations .telephone       ").val() == "" ||
		$("#customerInformations .location-country").val() == "" ||
		$("#customerInformations .location-city   ").val() == "" ||
		$("#customerInformations .location-zip    ").val() == "" ||
		$("#customerInformations .location-address").val() == ""
	) {
		$('#btn_next').attr('disabled', true);
	}
	else
	{
		if($("#sameAddress").is(':checked')) {
			$('#installationAddress .location-country').attr('required', false);
			$('#installationAddress .location-city   ').attr('required', false);
			$('#installationAddress .location-zip    ').attr('required', false);
			$('#installationAddress .location-address').attr('required', false);
			$('#btn_next').attr('disabled', false);
		} else {
			$('#installationAddress .location-country').attr('required', true);
			$('#installationAddress .location-city   ').attr('required', true);
			$('#installationAddress .location-zip    ').attr('required', true);
			$('#installationAddress .location-address').attr('required', true);
			if(
				$('#installationAddress .location-country').val() == "" ||
				$('#installationAddress .location-city   ').val() == "" ||
				$('#installationAddress .location-zip    ').val() == "" ||
				$('#installationAddress .location-address').val() == ""
			) {
				$('#btn_next').attr('disabled', true);
			}
			else
			{
				$('#btn_next').attr('disabled', false);
			}
		}
	}
}, 1000);










$('#mainForm').on('submit', (e) => {

	e.preventDefault();

	if(
		$("#customerInformations .gender          ").val() != "" &&
		$("#customerInformations .first-name      ").val() != "" &&
		$("#customerInformations .last-name       ").val() != "" &&
		$("#customerInformations .email           ").val() != "" &&
		$("#customerInformations .telephone       ").val() != "" &&
		$("#customerInformations .location-country").val() != "" &&
		$("#customerInformations .location-city   ").val() != "" &&
		$("#customerInformations .location-zip    ").val() != "" &&
		$("#customerInformations .location-address").val() != "" &&
		(
			$("#sameAddress").is(":checked") ||
			(
				$("#installationAddress .location-country").val() != "" &&
				$("#installationAddress .location-city   ").val() != "" &&
				$("#installationAddress .location-zip    ").val() != "" &&
				$("#installationAddress .location-address").val() != ""
			)
		)
	)
	{
		if($("#customerInformations .email").val().trim() == installerEmail.trim())
			return alert(lang.customer_same_as_installer);

		// Save Inputs to Session
		$.post({
			url: "cmd/session.php",
			data: {
				customer_gender:      $("#customerInformations .gender          ").val(),
				customer_firstname:   $("#customerInformations .first-name      ").val(),
				customer_lastname:    $("#customerInformations .last-name       ").val(),
				customer_email:       $("#customerInformations .email           ").val(),
				customer_telephone:   $("#customerInformations .telephone       ").val(),
				customer_country:     $("#customerInformations .location-country").val(),
				customer_city:        $("#customerInformations .location-city   ").val(),
				customer_zipcode:     $("#customerInformations .location-zip    ").val(),
				customer_address:     $("#customerInformations .location-address").val(),
				installation_country: $("#sameAddress").is(":checked") ? $("#customerInformations .location-country").val() : $("#installationAddress  .location-country").val(),
				installation_city:    $("#sameAddress").is(":checked") ? $("#customerInformations .location-city   ").val() : $("#installationAddress  .location-city   ").val(),
				installation_zipcode: $("#sameAddress").is(":checked") ? $("#customerInformations .location-zip    ").val() : $("#installationAddress  .location-zip    ").val(),
				installation_address: $("#sameAddress").is(":checked") ? $("#customerInformations .location-address").val() : $("#installationAddress  .location-address").val()
			},
			error: () => { alert("E005. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response == '1')
					window.location.href = "system_detect.php";
				else
					alert("E006. Please refresh the page!");
			}
		});
	}
});

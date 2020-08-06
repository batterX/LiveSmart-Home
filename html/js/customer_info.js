$progress.trigger("step", 3);





function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

$("#sameAddress").on("change", function() {
	if($(this).is(":checked")) {
		$("#installationAddress    ").hide();
		$("#installationAddressCopy").show();
	} else {
		$("#installationAddress    ").show();
		$("#installationAddressCopy").hide();
	}
});

var hasAccessToUser = true;





$.post({
	url: "https://api.batterx.io/v3/install_hs.php",
	data: {
		action: "get_installation_info",
		apikey: apikey
	},
	error: () => { alert("E001. Please refresh the page!"); },
	success: (json) => {

		console.log(json);

		if(!json) return;

		// Set Customer Information
		if(json.hasOwnProperty("customer")) {
			if( json.customer.hasOwnProperty("gender"   ) && json.customer.gender      != "" &&
				json.customer.hasOwnProperty("firstname") && json.customer.firstname   != "" &&
				json.customer.hasOwnProperty("lastname" ) && json.customer.lastname    != "" &&
				json.customer.hasOwnProperty("email"    ) && json.customer.email       != "" &&
				json.customer.hasOwnProperty("telephone") && json.customer.telephone   != "" &&
				json.customer.hasOwnProperty("country"  ) && json.customer.country     != "" &&
				json.customer.hasOwnProperty("city"     ) && json.customer.city        != "" &&
				json.customer.hasOwnProperty("zipcode"  ) && json.customer.zipcode     != "" &&
				json.customer.hasOwnProperty("address"  ) && json.customer.address     != ""
			) {
				// Set Input Values
				$("#customerInformation .email           ").val(json.customer.email    ).attr("disabled", true);
				$("#customerInformation .gender          ").val(json.customer.gender   );
				$("#customerInformation .first-name      ").val(json.customer.firstname);
				$("#customerInformation .last-name       ").val(json.customer.lastname );
				$("#customerInformation .telephone       ").val(json.customer.telephone);
				$("#customerInformation .location-country").val(json.customer.country  );
				$("#customerInformation .location-city   ").val(json.customer.city     );
				$("#customerInformation .location-zip    ").val(json.customer.zipcode  );
				$("#customerInformation .location-address").val(json.customer.address  );
			}
		}
		
		// Set Installation Address
		if(json.hasOwnProperty("installation")) {
			if(json.installation.hasOwnProperty("country")) $("#installationAddress .location-country").val(json.installation.country);
			if(json.installation.hasOwnProperty("city"   )) $("#installationAddress .location-city   ").val(json.installation.city   );
			if(json.installation.hasOwnProperty("zipcode")) $("#installationAddress .location-zip    ").val(json.installation.zipcode);
			if(json.installation.hasOwnProperty("address")) $("#installationAddress .location-address").val(json.installation.address);
			// Same as customer address
			if( $("#installationAddress .location-country").val() == $("#customerInformation .location-country").val() &&
				$("#installationAddress .location-city   ").val() == $("#customerInformation .location-city   ").val() &&
				$("#installationAddress .location-zip    ").val() == $("#customerInformation .location-zip    ").val() &&
				$("#installationAddress .location-address").val() == $("#customerInformation .location-address").val()
			) $("#sameAddress").attr("checked", true).trigger("change");
		}

	}
});





$("#customerInformation .email").on("change", function() {
	
	var email = $(this).val().trim();
	
	if(!validateEmail(email)) return;

	// Email can't be same as installer mail
	if(email == installerEmail.trim()) return $("#errorSameAsInstaller").modal("show");
	
	$.post({
		url: "https://api.batterx.io/v3/install_hs.php",
		data: {
			action    : "get_customer_info",
			customer  : email,
			installer : installerEmail
		},
		error: () => { alert("E002. Please refresh the page!"); },
		success: (json) => {

			console.log(json);

			if(json.hasOwnProperty("has_access") && json.has_access == false) {
				hasAccessToUser = false;
				return $("#errorNoAccessToUser").modal("show");
			}

			if( json.hasOwnProperty("gender"   ) && json.gender    != "" &&
				json.hasOwnProperty("firstname") && json.firstname != "" &&
				json.hasOwnProperty("lastname" ) && json.lastname  != "" &&
				json.hasOwnProperty("telephone") && json.telephone != "" &&
				json.hasOwnProperty("country"  ) && json.country   != "" &&
				json.hasOwnProperty("city"     ) && json.city      != "" &&
				json.hasOwnProperty("zipcode"  ) && json.zipcode   != "" &&
				json.hasOwnProperty("address"  ) && json.address   != ""
			) {
				// Set Input Values
				$("#customerInformation .email           ").attr("disabled", true);
				$("#customerInformation .gender          ").val(json.gender   );
				$("#customerInformation .first-name      ").val(json.firstname);
				$("#customerInformation .last-name       ").val(json.lastname );
				$("#customerInformation .telephone       ").val(json.telephone);
				$("#customerInformation .location-country").val(json.country  );
				$("#customerInformation .location-city   ").val(json.city     );
				$("#customerInformation .location-zip    ").val(json.zipcode  );
				$("#customerInformation .location-address").val(json.address  );
			}

			hasAccessToUser = true;

		}
	});

});





setInterval(() => {

	if( $("#customerInformation .gender          ").val() == "" ||
		$("#customerInformation .first-name      ").val() == "" ||
		$("#customerInformation .last-name       ").val() == "" ||
		$("#customerInformation .email           ").val() == "" ||
		$("#customerInformation .telephone       ").val() == "" ||
		$("#customerInformation .location-country").val() == "" ||
		$("#customerInformation .location-city   ").val() == "" ||
		$("#customerInformation .location-zip    ").val() == "" ||
		$("#customerInformation .location-address").val() == "" ||
		!validateEmail($("#customerInformation .email").val().trim())
	) return $("#btn_next").attr("disabled", true);
	
	if($("#sameAddress").is(":checked")) {
		$("#installationAddress .location-country").attr("required", false);
		$("#installationAddress .location-city   ").attr("required", false);
		$("#installationAddress .location-zip    ").attr("required", false);
		$("#installationAddress .location-address").attr("required", false);
		$("#btn_next").attr("disabled", false);
	} else {
		$("#installationAddress .location-country").attr("required", true);
		$("#installationAddress .location-city   ").attr("required", true);
		$("#installationAddress .location-zip    ").attr("required", true);
		$("#installationAddress .location-address").attr("required", true);
		if( $("#installationAddress .location-country").val() == "" ||
			$("#installationAddress .location-city   ").val() == "" ||
			$("#installationAddress .location-zip    ").val() == "" ||
			$("#installationAddress .location-address").val() == ""
		) { $('#btn_next').attr('disabled', true); }
		else { $('#btn_next').attr('disabled', false); }
	}

}, 1000);





$("#mainForm").on("submit", (e) => {

	e.preventDefault();

	if( $("#customerInformation .gender          ").val() != "" &&
		$("#customerInformation .first-name      ").val() != "" &&
		$("#customerInformation .last-name       ").val() != "" &&
		$("#customerInformation .email           ").val() != "" &&
		$("#customerInformation .telephone       ").val() != "" &&
		$("#customerInformation .location-country").val() != "" &&
		$("#customerInformation .location-city   ").val() != "" &&
		$("#customerInformation .location-zip    ").val() != "" &&
		$("#customerInformation .location-address").val() != "" &&
		(
			$("#sameAddress").is(":checked") ||
			(
				$("#installationAddress .location-country").val() != "" &&
				$("#installationAddress .location-city   ").val() != "" &&
				$("#installationAddress .location-zip    ").val() != "" &&
				$("#installationAddress .location-address").val() != ""
			)
		)
	) {

		if($("#customerInformation .email").val().trim() == installerEmail.trim())
			return $("#errorSameAsInstaller").modal("show");

		if(!hasAccessToUser)
			return $("#errorNoAccessToUser").modal("show");

		// Set to Session
		$.post({
			url: "cmd/session.php",
			data: {
				customer_gender:      $("#customerInformation .gender          ").val(),
				customer_firstname:   $("#customerInformation .first-name      ").val(),
				customer_lastname:    $("#customerInformation .last-name       ").val(),
				customer_email:       $("#customerInformation .email           ").val(),
				customer_telephone:   $("#customerInformation .telephone       ").val(),
				customer_country:     $("#customerInformation .location-country").val(),
				customer_city:        $("#customerInformation .location-city   ").val(),
				customer_zipcode:     $("#customerInformation .location-zip    ").val(),
				customer_address:     $("#customerInformation .location-address").val(),
				installation_country: $("#sameAddress").is(":checked") ? $("#customerInformation .location-country").val() : $("#installationAddress  .location-country").val(),
				installation_city:    $("#sameAddress").is(":checked") ? $("#customerInformation .location-city   ").val() : $("#installationAddress  .location-city   ").val(),
				installation_zipcode: $("#sameAddress").is(":checked") ? $("#customerInformation .location-zip    ").val() : $("#installationAddress  .location-zip    ").val(),
				installation_address: $("#sameAddress").is(":checked") ? $("#customerInformation .location-address").val() : $("#installationAddress  .location-address").val()
			},
			error: () => { alert("E003. Please refresh the page!"); },
			success: (response) => {
				console.log(response);
				if(response == "1")
					window.location.href = "system_detect.php";
				else
					alert("E004. Please refresh the page!");
			}
		});

	}

});

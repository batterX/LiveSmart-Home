$progress.trigger('step', 3);





$.get({
    url: 'cmd/apikey.php',
    error: function() {
        alert("E001. Please refresh the page!");
    },
    success: function(response) {

        console.log(response);

        if(!response || response.length != 40) {
            alert("E002. Please refresh the page!");
            return;
        }
        
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: {
                action: "retrieve_installation_info",
                apikey: response.toString()
            },
            error: function(error) {
                console.log(error);
                alert("E003. Please refresh the page!");
            },
            success: function(json) {
                
                console.log(json);
                
                if(json != "")
                {
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
                    }
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
                            $("#customerInformations .gender"          ).attr('disabled', 'disabled').val(json.customer.gender);
                            $("#customerInformations .first-name"      ).attr('disabled', 'disabled').val(json.customer.firstname);
                            $("#customerInformations .last-name"       ).attr('disabled', 'disabled').val(json.customer.lastname);
                            $("#customerInformations .email"           ).attr('disabled', 'disabled').val(json.customer.email);
                            $("#customerInformations .telephone"       ).attr('disabled', 'disabled').val(json.customer.telephone);
                            $("#customerInformations .location-country").attr('disabled', 'disabled').val(json.customer.country);
                            $("#customerInformations .location-city"   ).attr('disabled', 'disabled').val(json.customer.city);
                            $("#customerInformations .location-zip"    ).attr('disabled', 'disabled').val(json.customer.zipcode);
                            $("#customerInformations .location-address").attr('disabled', 'disabled').val(json.customer.address);
                        }
                    }
                }

            }
        });

    }
});










$('#loginForm').on('submit', function(e) {

    e.preventDefault();

    if($('#email').val() != "" && $('#password').val() != "")
    {
        // Retrieve Customer Informations
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: {
                action: "retrieve_customer_info",
                email: $('#email').val(),
                password: $('#password').val()
            },
            error: function() {
                alert("E004. Please refresh the page!");
            },
            success: function(response) {
                console.log(response);
                if(!response || typeof response !== "object") {
                    $("#errorMsg").css('display', 'block');
                    return;
                }
                // Hide ErrorMsg & Modal
                $("#errorMsg").css('display', 'none');
                $("#modalExistingCustomer").modal('hide');
                // Set Input Values
                $("#customerInformations .gender"          ).attr('disabled', 'disabled').val(response['info_gender']); // 0=Male 1=Female
                $("#customerInformations .first-name"      ).attr('disabled', 'disabled').val(response['info_firstname']);
                $("#customerInformations .last-name"       ).attr('disabled', 'disabled').val(response['info_lastname']);
                $("#customerInformations .email"           ).attr('disabled', 'disabled').val($('#email').val());
                $("#customerInformations .telephone"       ).attr('disabled', 'disabled').val(response['info_telephone']);
                $("#customerInformations .location-country").attr('disabled', 'disabled').val(response['info_country']);
                $("#customerInformations .location-city"   ).attr('disabled', 'disabled').val(response['info_city']);
                $("#customerInformations .location-zip"    ).attr('disabled', 'disabled').val(response['info_zipcode']);
                $("#customerInformations .location-address").attr('disabled', 'disabled').val(response['info_address']);
            }
        });
    }

});





$("#sameAddress").on('change', function() {
    if($(this).is(':checked'))
        $('#installationAddress').hide();
    else
        $('#installationAddress').show();
});





setInterval(function() {
    if(
        $("#customerInformations .gender").val() == "" ||
        $("#customerInformations .first-name").val() == "" ||
        $("#customerInformations .last-name").val() == "" ||
        $("#customerInformations .email").val() == "" ||
        $("#customerInformations .telephone").val() == "" ||
        $("#customerInformations .location-country").val() == "" ||
        $("#customerInformations .location-city").val() == "" ||
        $("#customerInformations .location-zip").val() == "" ||
        $("#customerInformations .location-address").val() == ""
    ) {
        $('#btnSubmit').attr('disabled', 'disabled');
    }
    else
    {
        if($("#sameAddress").is(':checked')) {
            $('#installationAddress .location-country').removeAttr('required');
            $('#installationAddress .location-city').removeAttr('required');
            $('#installationAddress .location-zip').removeAttr('required');
            $('#installationAddress .location-address').removeAttr('required');
            $('#btnSubmit').removeAttr('disabled');
        } else {
            $('#installationAddress .location-country').attr('required', 'required');
            $('#installationAddress .location-city').attr('required', 'required');
            $('#installationAddress .location-zip').attr('required', 'required');
            $('#installationAddress .location-address').attr('required', 'required');
            if(
                $("#installationAddress .location-country").val() == "" ||
                $("#installationAddress .location-city").val() == "" ||
                $("#installationAddress .location-zip").val() == "" ||
                $("#installationAddress .location-address").val() == ""
            ) {
                $('#btnSubmit').attr('disabled', 'disabled');
            }
            else
            {
                $("#btnSubmit").removeAttr("disabled");
            }
        }
    }
}, 1000);





$('#mainForm').on('submit', function(e) {

    e.preventDefault();

    if(
        $("#customerInformations .gender").val() != "" &&
        $("#customerInformations .first-name").val() != "" &&
        $("#customerInformations .last-name").val() != "" &&
        $("#customerInformations .email").val() != "" &&
        $("#customerInformations .telephone").val() != "" &&
        $("#customerInformations .location-country").val() != "" &&
        $("#customerInformations .location-city").val() != "" &&
        $("#customerInformations .location-zip").val() != "" &&
        $("#customerInformations .location-address").val() != "" &&
        (
            $("#sameAddress").is(":checked") ||
            (
                $("#installationAddress .location-country").val() != "" &&
                $("#installationAddress .location-city").val() != "" &&
                $("#installationAddress .location-zip").val() != "" &&
                $("#installationAddress .location-address").val() != ""
            )
        )
    )
    {
        // Save Inputs to Session
        $.post({
            url: "cmd/session.php",
            data: {
                customer_gender:      $("#customerInformations .gender").val(),
                customer_firstname:   $("#customerInformations .first-name").val(),
                customer_lastname:    $("#customerInformations .last-name").val(),
                customer_email:       $("#customerInformations .email").val(),
                customer_telephone:   $("#customerInformations .telephone").val(),
                customer_country:     $("#customerInformations .location-country").val(),
                customer_city:        $("#customerInformations .location-city").val(),
                customer_zipcode:     $("#customerInformations .location-zip").val(),
                customer_address:     $("#customerInformations .location-address").val(),
                installation_country: $("#sameAddress").is(":checked") ? $("#customerInformations .location-country").val() : $("#installationAddress  .location-country").val(),
                installation_city:    $("#sameAddress").is(":checked") ? $("#customerInformations .location-city").val() : $("#installationAddress  .location-city").val(),
                installation_zipcode: $("#sameAddress").is(":checked") ? $("#customerInformations .location-zip").val() : $("#installationAddress  .location-zip").val(),
                installation_address: $("#sameAddress").is(":checked") ? $("#customerInformations .location-address").val() : $("#installationAddress  .location-address").val()
            },
            error: function() {
                alert("E005. Please refresh the page!");
            },
            success: function(response) {
                console.log(response);
                if(response == '1')
                    window.location.href = "system_detect.php";
                else
                    alert("E006. Please refreh the page!");
            }
        });
    }
});
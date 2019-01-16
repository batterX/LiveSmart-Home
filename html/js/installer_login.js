$progress.trigger('step', 2);



$('#loginForm').on('submit', function(e) {

    e.preventDefault();

    if($("#email").val() != "" && $("#password").val() != "")
    {
        // Verify Email + Password & Return Installer Informations
        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: {
                action: "retrieve_installer_info",
                email: $('#email').val(),
                password: $('#password').val()
            },
            success: function(response) {
                console.log(response);
                if(response && typeof response === "object") {
                    // Hide ErrorMsg
                    $("#errorMsg").css('visibility', 'hidden');
                    // Set to Session
                    $.post({
                        url: "cmd/session.php",
                        data: {
                            installer_email:     $('#email').val(),
                            installer_password:  $('#password').val(),
                            installer_gender:    response.hasOwnProperty('info_gender') ? response['info_gender'] : "0",
                            installer_firstname: response.hasOwnProperty('info_firstname') ? response['info_firstname'] : "",
                            installer_lastname:  response.hasOwnProperty('info_lastname') ? response['info_lastname'] : "",
                            installer_company:   response.hasOwnProperty('info_company') ? response['info_company'] : "",
                            installer_telephone: response.hasOwnProperty('info_telephone') ? response['info_telephone'] : ""
                        },
                        success: function(response) {
                            console.log(response);
                            if(response === '1')
                                window.location.href = "customer_info.php";
                            else
                                alert("An error has occured. Please try again! _003");
                        },
                        error: function() { alert("An error has occured. Please try again! _002"); }
                    });
                } else {
                    $("#errorMsg").css('visibility', 'visible');
                }
            },
            error: function() { alert("An error has occured. Please try again! _001"); }
        });
    }

});
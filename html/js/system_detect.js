$progress.trigger('step', 4);



performStep();

function performStep()
{
    $.get({
        url: 'api.php?get=currentState',
        success: function(response) {
            console.log(response);
            if(response && typeof response == 'object' && response.hasOwnProperty('logtime')) {
                var logtime = response['logtime'];
                var curtime = moment.utc().subtract(1, 'minute').format("YYYY-MM-DD hh:mm:ss");
                var isWorking = moment(logtime).isAfter(moment(curtime));
                if(isWorking) {
                    // Set SerialNumber
                    $.get({
                        url: 'api.php?get=device_info',
                        success: function(response) {
                            console.log(response);
                            if(response && typeof response == 'object' && response.hasOwnProperty('device_model') && response.hasOwnProperty('device_serial_number')) {
                                var device_model = response['device_model'];
                                var device_serial_number = response['device_serial_number'];
                                $('.serialnumber b').html(device_serial_number);
                                if(device_model.toLowerCase() == "batterx h3") {
                                    $('#inverterDetected h1 b').html('h3');
                                    $('#inverterDetected img').attr('src', 'img/device_h3.png');
                                } else if(device_model.toLowerCase() == "batterx h5") {
                                    $('#inverterDetected h1 b').html('h5');
                                    $('#inverterDetected img').attr('src', 'img/device_h5.png');
                                } else if(device_model.toLowerCase() == "batterx h5-eco") {
                                    $('#inverterDetected h1 b').html('h5-eco');
                                    $('#inverterDetected img').attr('src', 'img/device_h5e.png');
                                } else if(device_model.toLowerCase() == "batterx h10") {
                                    $('#inverterDetected h1 b').html('h10');
                                    $('#inverterDetected img').attr('src', 'img/device_h10.png');
                                } else {
                                    $('#inverterDetected h1 b').html('');
                                    $('#inverterDetected img').attr('src', '');
                                }

                                $.post({
                                    url: 'https://api.batterx.io/v2/installation.php',
                                    data: { action: "verify_device", serialnumber: device_serial_number },
                                    success: function(response) {
                                        if(response === '1')
                                        {
                                            // Show Working
                                            $('#inverterUnknown').hide();
                                            $('#inverterDetected').show();
                                            // Set VDE4105 Status
                                            $.get({
                                                url: 'api.php?get=settings',
                                                success: function(response) {
                                                    if(response && typeof response === 'object' && response.hasOwnProperty('InverterParameters') && response['InverterParameters'].hasOwnProperty('35')) {
                                                        var deviceStandard = response['InverterParameters']['35']['S1'];
                                                        if(deviceStandard == '058' || deviceStandard == '108') {
                                                            $('.standard').css('color', '#25ae88');
                                                            $('.loading').hide();
                                                            $('.success').show();
                                                            $.get({
                                                                url: 'api.php?set=command&type=24065&entity=0&text2=A,1',
                                                                success: function(response) {
                                                                    if(response && response == '1')
                                                                    $('#btnSubmit').removeClass('d-none');
                                                                    $('#btnSubmit').on('click', function() {
                                                                        window.location.href = "system_setup.php";
                                                                    });
                                                                },
                                                                error: function() {
                                                                    alert("An error has occured. Please refresh the page! _006");
                                                                }
                                                            });
                                                        } else {
                                                            $('.standard').css('color', 'red');
                                                            $('.loading').hide();
                                                            $('.error').show();
                                                        }
                                                    } else {
                                                        alert("An error has occured. Please refresh the page! _005");
                                                    }
                                                },
                                                error: function() {
                                                    alert("An error has occured. Please refresh the page! _004");
                                                }
                                            });
                                        }
                                        else
                                        {
                                            $('.loading').hide();
                                            $('.error').show();
                                            $('.message').html(lang['inverter_not_registered']).css('color', 'red');
                                        }
                                    }
                                });

                            } else {
                                alert("An error has occured. Please refresh the page! _003");
                            }
                        },
                        error: function() {
                            alert("An error has occured. Please refresh the page! _002");
                        }
                    });
                } else {
                    // RETRY AGAIN
                    setTimeout(performStep, 5000);
                }
            } else {
                // RETRY AGAIN
                setTimeout(performStep, 5000);
            }
        },
        error: function() {
            setTimeout(performStep, 5000);
        }
    });
}
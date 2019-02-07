$progress.trigger('step', 8);





$('#checkboxAccept').on('click', function() {
    $('#btnFinishInstallation').removeClass('d-none');
});





function getImageDimensions(file) {
    return new Promise (function (resolved, rejected) {
        var i = new Image()
        i.onload = function(){
            resolved({w: i.width, h: i.height})
        };
        i.src = file
    })
}





$('#btnFinishInstallation').on('click', function() {

    deviceModel = {
        'h3'  : 'batterX h3',
        'h5'  : 'batterX h5',
        'h5e' : 'batterX h5-eco',
        'h10' : 'batterX h10'
    };

    var data = new FormData();

    data.append('action', 'finish_installation');

    if(dataObj.hasOwnProperty('installation_date'     ) && dataObj['installation_date'     ] != "") data.append('installation_date', dataObj['installation_date']);

    if(dataObj.hasOwnProperty('installer_gender'      ) && dataObj['installer_gender'      ] != "") data.append('installer_gender'      , dataObj['installer_gender'      ]);
    if(dataObj.hasOwnProperty('installer_firstname'   ) && dataObj['installer_firstname'   ] != "") data.append('installer_firstname'   , dataObj['installer_firstname'   ]);
    if(dataObj.hasOwnProperty('installer_lastname'    ) && dataObj['installer_lastname'    ] != "") data.append('installer_lastname'    , dataObj['installer_lastname'    ]);
    if(dataObj.hasOwnProperty('installer_company'     ) && dataObj['installer_company'     ] != "") data.append('installer_company'     , dataObj['installer_company'     ]);
    if(dataObj.hasOwnProperty('installer_telephone'   ) && dataObj['installer_telephone'   ] != "") data.append('installer_telephone'   , dataObj['installer_telephone'   ]);
    if(dataObj.hasOwnProperty('installer_email'       ) && dataObj['installer_email'       ] != "") data.append('installer_email'       , dataObj['installer_email'       ]);
    if(dataObj.hasOwnProperty('installer_password'    ) && dataObj['installer_password'    ] != "") data.append('installer_password'    , dataObj['installer_password'    ]);
    
    if(dataObj.hasOwnProperty('customer_gender'       ) && dataObj['customer_gender'       ] != "") data.append('customer_gender'       , dataObj['customer_gender'       ]);
    if(dataObj.hasOwnProperty('customer_firstname'    ) && dataObj['customer_firstname'    ] != "") data.append('customer_firstname'    , dataObj['customer_firstname'    ]);
    if(dataObj.hasOwnProperty('customer_lastname'     ) && dataObj['customer_lastname'     ] != "") data.append('customer_lastname'     , dataObj['customer_lastname'     ]);
    if(dataObj.hasOwnProperty('customer_email'        ) && dataObj['customer_email'        ] != "") data.append('customer_email'        , dataObj['customer_email'        ]);
    if(dataObj.hasOwnProperty('customer_telephone'    ) && dataObj['customer_telephone'    ] != "") data.append('customer_telephone'    , dataObj['customer_telephone'    ]);
    if(dataObj.hasOwnProperty('customer_country'      ) && dataObj['customer_country'      ] != "") data.append('customer_country'      , dataObj['customer_country'      ]);
    if(dataObj.hasOwnProperty('customer_city'         ) && dataObj['customer_city'         ] != "") data.append('customer_city'         , dataObj['customer_city'         ]);
    if(dataObj.hasOwnProperty('customer_zipcode'      ) && dataObj['customer_zipcode'      ] != "") data.append('customer_zipcode'      , dataObj['customer_zipcode'      ]);
    if(dataObj.hasOwnProperty('customer_address'      ) && dataObj['customer_address'      ] != "") data.append('customer_address'      , dataObj['customer_address'      ]);

    if(dataObj.hasOwnProperty('installation_country'  ) && dataObj['installation_country'  ] != "") data.append('installation_country'  , dataObj['installation_country'  ]);
    if(dataObj.hasOwnProperty('installation_city'     ) && dataObj['installation_city'     ] != "") data.append('installation_city'     , dataObj['installation_city'     ]);
    if(dataObj.hasOwnProperty('installation_zipcode'  ) && dataObj['installation_zipcode'  ] != "") data.append('installation_zipcode'  , dataObj['installation_zipcode'  ]);
    if(dataObj.hasOwnProperty('installation_address'  ) && dataObj['installation_address'  ] != "") data.append('installation_address'  , dataObj['installation_address'  ]);

    if(dataObj.hasOwnProperty('system_model'          ) && dataObj['system_model'          ] != "") data.append('system_model'          , dataObj['system_model'          ]);
    if(dataObj.hasOwnProperty('system_serial'         ) && dataObj['system_serial'         ] != "") data.append('system_serial'         , dataObj['system_serial'         ]);

    if(dataObj.hasOwnProperty('device_serial'         ) && dataObj['device_serial'         ] != "") data.append('device_serial'         , dataObj['device_serial'         ]);
    if(dataObj.hasOwnProperty('device_model'          ) && dataObj['device_model'          ] != "") data.append('device_model'          , deviceModel[dataObj['device_model']]);
    if(dataObj.hasOwnProperty('solar_wattPeak'        ) && dataObj['solar_wattPeak'        ] != "") data.append('solar_wattPeak'        , dataObj['solar_wattPeak'        ]);
    if(dataObj.hasOwnProperty('solar_feedInLimitation') && dataObj['solar_feedInLimitation'] != "") data.append('solar_feedInLimitation', dataObj['solar_feedInLimitation']);
    if(dataObj.hasOwnProperty('solar_info'            )                                           ) data.append('solar_info'            , dataObj['solar_info'            ]);
        
    if(dataObj.hasOwnProperty('box_apikey'            ) && dataObj['box_apikey'            ] != "") data.append('box_apikey'            , dataObj['box_apikey'            ]);
    if(dataObj.hasOwnProperty('box_serial'            ) && dataObj['box_serial'            ] != "") data.append('box_serial'            , dataObj['box_serial'            ]);
    if(dataObj.hasOwnProperty('software_version'      ) && dataObj['software_version'      ] != "") data.append('software_version'      , dataObj['software_version'      ]);
    
    if(dataObj.hasOwnProperty('battery1_serial'       ) && dataObj['battery1_serial'       ] != "") data.append('battery1_serial'       , dataObj['battery1_serial'       ]);
    if(dataObj.hasOwnProperty('battery2_serial'       ) && dataObj['battery2_serial'       ] != "") data.append('battery2_serial'       , dataObj['battery2_serial'       ]);
    if(dataObj.hasOwnProperty('battery3_serial'       ) && dataObj['battery3_serial'       ] != "") data.append('battery3_serial'       , dataObj['battery3_serial'       ]);
    if(dataObj.hasOwnProperty('battery4_serial'       ) && dataObj['battery4_serial'       ] != "") data.append('battery4_serial'       , dataObj['battery4_serial'       ]);



    html2canvas(document.querySelector('#summary'), {
        windowWidth: 800,
        scale: 2
    }).then(async canvas => {
        
        var img = canvas.toDataURL('image/jpeg');
        var dimensions = await getImageDimensions(img);
        console.log(dimensions);
        var ratio = dimensions.w / dimensions.h;
        var w = 150, h = 150 / ratio;
        if(ratio < 0.5618) { h = 267; w = 267 * ratio; }

        var pdf = new jsPDF("portrait", "mm", "a4");
        pdf.addImage(img, 'JPEG', 20, 15, w, h); // img, type, x, y, width, height
        var pdfBlob = pdf.output('blob');
        
        // USE BLOB TO SAVE TO CLOUD
        
        data.append('pdf_file', pdfBlob, lang['summary_installation_summary']);

        $.post({
            url: "https://api.batterx.io/v2/installation.php",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                if(response === "1")
                    showSuccess();
                else
                    alert("Error: " + response);
            },
            error: function(err) { console.log(err); alert("An error has occured. Please refresh this page!"); }
        });

    });



    //alert("Send Confirmation Email (with button to resend)");
    //alert("In Email: 'Activate Warranty' button");
    //alert("On Click -> Open Login Page -> Login User -> Activate Stuff");

});





function showSuccess()
{
    $('#summary').hide();
    $('#confirm').hide();
    $('#btnFinish').hide();
    $('#successBox').show();
}





$('#btnDownload').on('click', function() {
    html2canvas(document.querySelector('#summary'), {
        windowWidth: 800,
        scale: 2,
        onclone: function(clonedDoc) { clonedDoc.getElementById('summary').style.display = 'block'; }
    }).then(async canvas => {
        var img = canvas.toDataURL('image/jpeg');
        var dimensions = await getImageDimensions(img);
        console.log(dimensions);
        var ratio = dimensions.w / dimensions.h;
        var w = 150, h = 150 / ratio;
        if(ratio < 0.5618) { h = 267; w = 267 * ratio; }

        var pdf = new jsPDF("portrait", "mm", "a4");
        pdf.addImage(img, 'JPEG', 20, 15, w, h); // img, type, x, y, width, height
        pdf.save(lang['summary_installation_summary'] + ".pdf");
    });
});





var checkRebootInterval;

$('#btnReboot').on('click', function() {

    $.post({
        url: "cmd/reboot.php",
        success: function(response) { console.log(response); },
        error  : function(response) { console.log(response); }
    });

    setTimeout(function() { checkRebootInterval = setInterval(checkReboot_waitForError, 5000); }, 2500);
    
    // DISABLE BUTTON
    $('#btnReboot').attr('disabled', 'disabled');
    // SHOW SPINNER
    $('#loading').removeClass('d-none');
});

function checkReboot_waitForError() {
    $.ajax({
        type: 'GET',
        url: 'cmd/working.txt',
        cache: false,
        timeout: 2500,
        success: function(response) {
            if(!response) {
                clearInterval(checkRebootInterval);
                checkRebootInterval = undefined;
                checkRebootInterval = setInterval(checkReboot_waitForSuccess, 5000);
            }
        },
        error: function() {
            clearInterval(checkRebootInterval);
            checkRebootInterval = undefined;
            checkRebootInterval = setInterval(checkReboot_waitForSuccess, 5000);
        }
    });
}

function checkReboot_waitForSuccess() {
    $.ajax({
        type: 'GET',
        url: 'cmd/working.txt',
        cache: false,
        timeout: 2500,
        success: function(response) {
            if(response) {
                clearInterval(checkRebootInterval);
                checkRebootInterval = undefined;

                // HIDE SPINNER
                $('#loading').addClass('d-none');
                // SHOW SUCCESS
                $('#success').removeClass('d-none');
            }
        }
    });
}
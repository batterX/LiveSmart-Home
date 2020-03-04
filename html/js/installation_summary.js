$progress.trigger('step', 8);





$('#checkboxAccept1, #checkboxAccept2').on('click', () => {
	if($('#checkboxAccept1').is(':checked') && $('#checkboxAccept2').is(':checked'))
		$('#btnFinish').css('visibility', 'visible');
	else
		$('#btnFinish').css('visibility', 'hidden');
});





function getImageDimensions(file) {
	return new Promise (function (resolved, rejected) {
		var i = new Image();
		i.onload = function() { resolved({ w: i.width, h: i.height }) };
		i.src = file;
	});
}





$('#btnFinishInstallation').on('click', function() {

	$('#btnFinishInstallation').attr('disabled', 'disabled');

	deviceModel = {
		'h3'  : 'batterX h3',
		'h5'  : 'batterX h5',
		'h5e' : 'batterX h5-eco',
		'h10' : 'batterX h10'
	};

	var data = new FormData();

	data.append('action' , 'finish_installation');
	data.append('lang'   , ($('#lang').val() == 'de' || $('#lang').val() == 'fr' || $('#lang').val() == 'cs' ) ? $('#lang').val() : 'en');

	if(dataObj.hasOwnProperty('installation_date'     ) && dataObj['installation_date'     ] != "") data.append('installation_date'     , dataObj['installation_date'       ]);

	if(dataObj.hasOwnProperty('installer_gender'      ) && dataObj['installer_gender'      ] != "") data.append('installer_gender'      , dataObj['installer_gender'        ]);
	if(dataObj.hasOwnProperty('installer_firstname'   ) && dataObj['installer_firstname'   ] != "") data.append('installer_firstname'   , dataObj['installer_firstname'     ]);
	if(dataObj.hasOwnProperty('installer_lastname'    ) && dataObj['installer_lastname'    ] != "") data.append('installer_lastname'    , dataObj['installer_lastname'      ]);
	if(dataObj.hasOwnProperty('installer_company'     ) && dataObj['installer_company'     ] != "") data.append('installer_company'     , dataObj['installer_company'       ]);
	if(dataObj.hasOwnProperty('installer_telephone'   ) && dataObj['installer_telephone'   ] != "") data.append('installer_telephone'   , dataObj['installer_telephone'     ]);
	if(dataObj.hasOwnProperty('installer_email'       ) && dataObj['installer_email'       ] != "") data.append('installer_email'       , dataObj['installer_email'         ]);
	if(dataObj.hasOwnProperty('installer_password'    ) && dataObj['installer_password'    ] != "") data.append('installer_password'    , dataObj['installer_password'      ]);

	if(dataObj.hasOwnProperty('customer_gender'       ) && dataObj['customer_gender'       ] != "") data.append('customer_gender'       , dataObj['customer_gender'         ]);
	if(dataObj.hasOwnProperty('customer_firstname'    ) && dataObj['customer_firstname'    ] != "") data.append('customer_firstname'    , dataObj['customer_firstname'      ]);
	if(dataObj.hasOwnProperty('customer_lastname'     ) && dataObj['customer_lastname'     ] != "") data.append('customer_lastname'     , dataObj['customer_lastname'       ]);
	if(dataObj.hasOwnProperty('customer_email'        ) && dataObj['customer_email'        ] != "") data.append('customer_email'        , dataObj['customer_email'          ]);
	if(dataObj.hasOwnProperty('customer_telephone'    ) && dataObj['customer_telephone'    ] != "") data.append('customer_telephone'    , dataObj['customer_telephone'      ]);
	if(dataObj.hasOwnProperty('customer_country'      ) && dataObj['customer_country'      ] != "") data.append('customer_country'      , dataObj['customer_country'        ]);
	if(dataObj.hasOwnProperty('customer_city'         ) && dataObj['customer_city'         ] != "") data.append('customer_city'         , dataObj['customer_city'           ]);
	if(dataObj.hasOwnProperty('customer_zipcode'      ) && dataObj['customer_zipcode'      ] != "") data.append('customer_zipcode'      , dataObj['customer_zipcode'        ]);
	if(dataObj.hasOwnProperty('customer_address'      ) && dataObj['customer_address'      ] != "") data.append('customer_address'      , dataObj['customer_address'        ]);

	if(dataObj.hasOwnProperty('installation_country'  ) && dataObj['installation_country'  ] != "") data.append('installation_country'  , dataObj['installation_country'    ]);
	if(dataObj.hasOwnProperty('installation_city'     ) && dataObj['installation_city'     ] != "") data.append('installation_city'     , dataObj['installation_city'       ]);
	if(dataObj.hasOwnProperty('installation_zipcode'  ) && dataObj['installation_zipcode'  ] != "") data.append('installation_zipcode'  , dataObj['installation_zipcode'    ]);
	if(dataObj.hasOwnProperty('installation_address'  ) && dataObj['installation_address'  ] != "") data.append('installation_address'  , dataObj['installation_address'    ]);

	if(dataObj.hasOwnProperty('system_model'          ) && dataObj['system_model'          ] != "") data.append('system_model'          , dataObj['system_model'            ]); else data.append('system_model', 'batterX');
	if(dataObj.hasOwnProperty('system_serial'         ) && dataObj['system_serial'         ] != "") data.append('system_serial'         , dataObj['system_serial'           ]);

	if(dataObj.hasOwnProperty('device_serial'         ) && dataObj['device_serial'         ] != "") data.append('device_serial'         , dataObj['device_serial'           ]);
	if(dataObj.hasOwnProperty('device_model'          ) && dataObj['device_model'          ] != "") data.append('device_model'          , deviceModel[dataObj['device_model']]);
	if(dataObj.hasOwnProperty('solar_wattPeak'        ) && dataObj['solar_wattPeak'        ] != "") data.append('solar_wattPeak'        , dataObj['solar_wattPeak'          ]);
	if(dataObj.hasOwnProperty('solar_feedInLimitation') && dataObj['solar_feedInLimitation'] != "") data.append('solar_feedInLimitation', dataObj['solar_feedInLimitation'  ]);
	if(dataObj.hasOwnProperty('solar_info'            )                                           ) data.append('solar_info'            , dataObj['solar_info'              ]);
	if(dataObj.hasOwnProperty('note'                  )                                           ) data.append('note'                  , dataObj['note'                    ]);

	if(dataObj.hasOwnProperty('box_apikey'            ) && dataObj['box_apikey'            ] != "") data.append('box_apikey'            , dataObj['box_apikey'              ]);
	if(dataObj.hasOwnProperty('box_serial'            ) && dataObj['box_serial'            ] != "") data.append('box_serial'            , dataObj['box_serial'              ]);
	if(dataObj.hasOwnProperty('software_version'      ) && dataObj['software_version'      ] != "") data.append('software_version'      , dataObj['software_version'        ]);

	if(dataObj.hasOwnProperty('battery_type')) {
		if(dataObj['battery_type'] == "lifepo") {
			if(dataObj.hasOwnProperty('battery_type'    ) && dataObj['battery_type'    ] != "") data.append('battery_type'    , dataObj['battery_type'    ]);
			if(dataObj.hasOwnProperty('battery1_serial' ) && dataObj['battery1_serial' ] != "") data.append('battery1_serial' , dataObj['battery1_serial' ]);
			if(dataObj.hasOwnProperty('battery2_serial' ) && dataObj['battery2_serial' ] != "") data.append('battery2_serial' , dataObj['battery2_serial' ]);
			if(dataObj.hasOwnProperty('battery3_serial' ) && dataObj['battery3_serial' ] != "") data.append('battery3_serial' , dataObj['battery3_serial' ]);
			if(dataObj.hasOwnProperty('battery4_serial' ) && dataObj['battery4_serial' ] != "") data.append('battery4_serial' , dataObj['battery4_serial' ]);
			if(dataObj.hasOwnProperty('battery5_serial' ) && dataObj['battery5_serial' ] != "") data.append('battery5_serial' , dataObj['battery5_serial' ]);
			if(dataObj.hasOwnProperty('battery6_serial' ) && dataObj['battery6_serial' ] != "") data.append('battery6_serial' , dataObj['battery6_serial' ]);
			if(dataObj.hasOwnProperty('battery7_serial' ) && dataObj['battery7_serial' ] != "") data.append('battery7_serial' , dataObj['battery7_serial' ]);
			if(dataObj.hasOwnProperty('battery8_serial' ) && dataObj['battery8_serial' ] != "") data.append('battery8_serial' , dataObj['battery8_serial' ]);
			if(dataObj.hasOwnProperty('battery9_serial' ) && dataObj['battery9_serial' ] != "") data.append('battery9_serial' , dataObj['battery9_serial' ]);
			if(dataObj.hasOwnProperty('battery10_serial') && dataObj['battery10_serial'] != "") data.append('battery10_serial', dataObj['battery10_serial']);
			if(dataObj.hasOwnProperty('battery11_serial') && dataObj['battery11_serial'] != "") data.append('battery11_serial', dataObj['battery11_serial']);
			if(dataObj.hasOwnProperty('battery12_serial') && dataObj['battery12_serial'] != "") data.append('battery12_serial', dataObj['battery12_serial']);
			if(dataObj.hasOwnProperty('battery13_serial') && dataObj['battery13_serial'] != "") data.append('battery13_serial', dataObj['battery13_serial']);
			if(dataObj.hasOwnProperty('battery14_serial') && dataObj['battery14_serial'] != "") data.append('battery14_serial', dataObj['battery14_serial']);
			if(dataObj.hasOwnProperty('battery15_serial') && dataObj['battery15_serial'] != "") data.append('battery15_serial', dataObj['battery15_serial']);
			if(dataObj.hasOwnProperty('battery16_serial') && dataObj['battery16_serial'] != "") data.append('battery16_serial', dataObj['battery16_serial']);
		} else if(dataObj['battery_type'] == "carbon") {
			if(dataObj.hasOwnProperty('battery_type'    ) && dataObj['battery_type'    ] != "") data.append('battery_type'    , dataObj['battery_type'    ]);
			if(dataObj.hasOwnProperty('battery_model'   ) && dataObj['battery_model'   ] != "") data.append('battery_model'   , dataObj['battery_model'   ]);
			if(dataObj.hasOwnProperty('battery_strings' ) && dataObj['battery_strings' ] != "") data.append('battery_strings' , dataObj['battery_strings' ]);
			if(dataObj.hasOwnProperty('battery_capacity') && dataObj['battery_capacity'] != "") data.append('battery_capacity', dataObj['battery_capacity']);
		} else if(dataObj['battery_type'] == "other") {
			if(dataObj.hasOwnProperty('battery_type'    ) && dataObj['battery_type'    ] != "") data.append('battery_type'    , dataObj['battery_type'    ]);
			if(dataObj.hasOwnProperty('battery_capacity') && dataObj['battery_capacity'] != "") data.append('battery_capacity', dataObj['battery_capacity']);
		}
	}

	$('#confirmLoadCorrect').removeClass('d-none');

	html2canvas(document.querySelector('#summary'), {
		windowWidth: 1200,
		scale: 2
	}).then(async canvas => {

		var img = canvas.toDataURL('image/jpeg');
		var dimensions = await getImageDimensions(img);

		var ratio = dimensions.w / dimensions.h;
		var w = 190, h = 190 / ratio;
		if(ratio < 0.68) { h = 277; w = 277 * ratio; }

		var pdf = new jsPDF("portrait", "mm", "a4");
		pdf.addImage(img, 'JPEG', (210 - w) / 2, (297 - h) / 2, w, h); // img, type, x, y, width, height
		var pdfBlob = pdf.output('blob');

		// HIDE FIELD AFTER CREATION

		$('#confirmLoadCorrect').addClass('d-none');

		// USE BLOB TO SAVE PDF-FILE TO CLOUD

		data.append('pdf_file', pdfBlob, lang['summary_installation_summary']);

		$.post({
			url: "https://api.batterx.io/v2/commissioning_v2.php",
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			error: function() { alert("E001. Please refresh the page!"); },
			success: function(response) {
				if(response == '1') {
					showSuccess();
					$('#confirmLoadCorrect').removeClass('d-none');
				}
				else {
					$('#btnFinishInstallation').removeAttr('disabled');
					alert("Error: " + response);
				}
			}
		});

	});

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
		windowWidth: 1200,
		scale: 2,
		onclone: function(clonedDoc) { clonedDoc.getElementById('summary').style.display = 'block'; }
	}).then(async canvas => {
		var img = canvas.toDataURL('image/jpeg');
		var dimensions = await getImageDimensions(img);
		
		var ratio = dimensions.w / dimensions.h;
		var w = 190, h = 190 / ratio;
		if(ratio < 0.68) { h = 277; w = 277 * ratio; }

		var pdf = new jsPDF("portrait", "mm", "a4");
		pdf.addImage(img, 'JPEG', (210 - w) / 2, (297 - h) / 2, w, h); // img, type, x, y, width, height
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
	// SHOW LOADING
	$('.notif').removeClass('loading error success').addClass('loading');
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
				// SHOW SUCCESS
				$('.notif').removeClass('loading error success').addClass('success');
			}
		}
	});
}

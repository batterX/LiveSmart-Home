// Get All Needed Strings

var lang = {
	"device_model":        "Device Model",
	"serial_number":       "Serial Number",
	"error":               "An error has occured",
	"info_update_success": "Information has been updated successfully"
}





// Get All Needed SESSION Variables

var token = "";










/*
	BOTH CLOUD AND LOCAL ARE SAME BELOW THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










// Init All Variables

var panelId              = "";

var device_model         = "";
var device_serial_number = "";

var service_company      = "";
var service_phone        = "";
var service_email        = "";
var service_website      = "";

var info_solar           = "";
var info_storage         = "";
var info_installation    = "";
var info_customer        = "";





// Show Panel

function showPanel(id) {
	
	panelId = id;
	
	if(id == 'model')
		$("#textBox textarea").val(lang['device_model'] + ":\r\n" + device_model + "\r\n\r\n" + lang['serial_number'] + ":\r\n" + device_serial_number);
	else if(id == 'solar')
		$("#textBox textarea").val(info_solar);
	else if(id == 'storage')
		$("#textBox textarea").val(info_storage);
	else if(id == 'installation')
		$("#textBox textarea").val(info_installation);
	else if(id == 'customer')
		$("#textBox textarea").val(info_customer);
	else
		$("#textBox textarea").val('');
	
	if($("#btnSave").length != 0 || $("#textBox textarea").val() != "")
		$("#textBox, #btnClose").css("display", "block");
	
	if(id != "model") $("#btnSave").css("display", "block");
	
	if($("#btnSave").length == 0 || id == "model")
		$("#textBox textarea").attr("readonly", "readonly");
	else
		$("#textBox textarea").removeAttr("readonly");

}





// Hide Panel

function hidePanel() {
	panelId = "";
	$("#textBox textarea").val("");
	$("#textBox, #btnClose, #btnSave").css("display", "none");
}





// Save Changes - Button Save

function saveChanges() {
	var setting = "";
	var value = "";
	
	switch(panelId) {
		case "solar":
			info_solar = $("#textBox textarea").val();
			setting = "info_solar";
			value = info_solar;
			break;
		case "storage":
			info_storage = $("#textBox textarea").val();
			setting = "info_storage";
			value = info_storage;
			break;
		case "installation":
			info_installation = $("#textBox textarea").val();
			setting = "info_installation";
			value = info_installation;
			break;
		case "customer":
			info_customer = $("#textBox textarea").val();
			setting = "info_customer";
			value = info_customer;
			break;
		default:
			break;
	}
	
	if(setting != "") {
		$.ajax({
			type: "POST",
			url: "db-interaction/data.php",
			data: {
				"action": "setDeviceInfo",
				"setting": setting,
				"value": value,
				"token": token
			},
			success: function (response) {
				if(response == true)
					alert(lang['info_update_success']);
				else
					alert(lang['error']);
			}
		});
	}
}





// Right-Side-Slider

var slider = document.getElementById('slider');
var toggle = document.getElementById('slideToggle');
toggle.addEventListener('click', function() {
	var isOpen = slider.classList.contains('slide-in');
	if(isOpen) {
		toggle.style.backgroundImage = "url(img/slideToggle-closed.png)";
		slider.setAttribute('class', 'slide-out');
	} else {
		toggle.style.backgroundImage = "url(img/slideToggle-open.png)";
		slider.setAttribute('class', 'slide-in');
	}
});





// Image Upload Button Listeners

$('#fileSelect').on("change", function() {
	$("#imageUploadForm").submit();
});

$('#imageUploadForm').on("submit", function(e) {
	e.preventDefault();
	$.ajax({
		url: "db-interaction/uploadDeviceImage.php",
		type: "POST",
		data: new FormData(this),
		contentType: false,
		cache: false,
		processData: false,
		success: function(response) {
			alert(response);
		}
	});
});





// Removes Current Image OnClick

function removeImage(imageUrl) {
	$.ajax({
		type: "POST",
		url: "db-interaction/files.php",
		data: {
			"action": "removeDeviceImage",
			"token": token,
			"filename": imageUrl
		},
		success: function (response) {
			i = $(".slick-active").attr("data-slick-index");
			$(".images").slick('slickRemove', i);
			var j = 0;
			$(".slick-slide").each(function(){
				$(this).attr("data-slick-index", j);
				j++;
			});
		}
	});
}





// Make Image Carousel
$.ajax({
	type: "POST",
	url: "db-interaction/files.php",
	data: { "token": token, "action": "getDeviceImages" },
	success: function (response) {
		// Parse Response to JSON
		var json = JSON.parse(response);
		// Display Images
		$(".images").css("display", "none");
		for(var x = 0; x < json.length; x++) {
			if($("#uploadButton").length > 0)
				$(".images").prepend(
					'<div style="background-image: url(uploads/' + json[x] + ')">' + 
						'<div id="btnRemoveImage" onclick="removeImage(\'' + json[x] + '\')"></div>' + 
					'</div>'
				);
			else
				$(".images").prepend( '<a style="background-image: url(uploads/' + json[x] + ')" href="uploads/' + json[x] + '" data-lightbox="device-images"></a>' );
		}
		// Make Carousel
		$('.images').waitForImages(function() {
			$('.images').css('display', 'block');
			$('.images').slick({
				autoplay: false,
				autoplaySpeed: 5000,
				infinite: true,
				speed: 500,
				fade: true,
				cssEase: 'linear'
			});
		});
		// Hide Overlay
		$('.overlay').fadeOut();
	}
});










/*
	BOTH CLOUD AND LOCAL ARE SAME ABOVE THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










// Get All Needed Data from Database

$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: { "action": "getDeviceInfo" },
	success: function (response) {
		// Parse Response to JSON
		var json = JSON.parse(response);
		// BatterX Model
		if(json.hasOwnProperty("device_model"))         device_model         = json["device_model"];
		if(json.hasOwnProperty("device_serial_number")) device_serial_number = json["device_serial_number"];
		// Editable Panels
		if(json.hasOwnProperty("info_solar"))           info_solar           = json["info_solar"];
		if(json.hasOwnProperty("info_storage"))         info_storage         = json["info_storage"];
		if(json.hasOwnProperty("info_installation"))    info_installation    = json["info_installation"];
		if(json.hasOwnProperty("info_customer"))        info_customer        = json["info_customer"];
		// Service Partner
		if(json.hasOwnProperty("service_company"))      service_company      = json["service_company"];
		if(json.hasOwnProperty("service_phone"))        service_phone        = json["service_phone"];
		if(json.hasOwnProperty("service_email"))        service_email        = json["service_email"];
		if(json.hasOwnProperty("service_website"))      service_website      = json["service_website"];
		// Set Service Partner Information
		$("#service_company").text(service_company).attr("href", service_website);
		$("#service_phone"  ).text(service_phone  ).attr("href", "tel:" + service_phone);
		$("#service_email"  ).text(service_email  ).attr("href", "mailto:" + service_email);
	}
});

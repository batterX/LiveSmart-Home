var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

var password = "914706ee0483ce46dd61f26907167baf";
var authenticated = false;

function checkPassword() {
	if(!authenticated) {
		pw = prompt("Enter Password", "");
		if(password == MD5(pw)) 
			authenticated = true;
	}

	if(!authenticated) {
		alert("That password is incorrect!");
		return false;
	}
	
	return true;
}










// Retries

var numRetries = 0;










/*
	Initial Settings
*/

var deviceModel = "";

var maxGridFeedInPower = "";
var waitTimeForFeed = "";

var maxChargingCurrent = "";
var maxChargingCurrentAC = "";
var bulkChargingVoltage = "";
var floatChargingVoltage = "";
var batteryType = "";
var cutoffVoltageHybrid = "";
var redischargeVoltageHybrid = "";
var cutoffVoltage = "";
var redischargeVoltage = "";
var maxDischargeCurrentHybrid = "";

var solarEnergyPriority = "";

var allowBatteryCharging = "";
var allowBatteryChargingAC = "";
var allowGridFeedIn = "";
var allowBatteryDischargeSolarOK = "";
var allowBatteryDischargeSolarNOK = "";

var LCDActiveTime = "";
var deviceDate = "";
var deviceTime = "";
var muteBuzzer = "";
var muteBuzzerStandby = "";
var muteBuzzerBattery = "";
var wideInputRange = "";
var generatorAsInput = "";
var ngRelayFunction = "";










/*
	New Settings
*/

var new_maxGridFeedInPower = "";
var new_waitTimeForFeed = "";

var new_maxChargingCurrent = "";
var new_maxChargingCurrentAC = "";
var new_bulkChargingVoltage = "";
var new_floatChargingVoltage = "";
var new_batteryType = "";
var new_cutoffVoltageHybrid = "";
var new_redischargeVoltageHybrid = "";
var new_cutoffVoltage = "";
var new_redischargeVoltage = "";
var new_maxDischargeCurrentHybrid = "";

var new_solarEnergyPriority = "";

var new_allowBatteryCharging = "";
var new_allowBatteryChargingAC = "";
var new_allowGridFeedIn = "";
var new_allowBatteryDischargeSolarOK = "";
var new_allowBatteryDischargeSolarNOK = "";

var new_LCDActiveTime = "";
var new_deviceDate = "";
var new_deviceTime = "";
var new_muteBuzzer = "";
var new_muteBuzzerStandby = "";
var new_muteBuzzerBattery = "";
var new_wideInputRange = "";
var new_generatorAsInput = "";
var new_ngRelayFunction = "";










/*
	Get Device Model
*/

$.ajax({
	type: "POST",
	url: "../db-interaction/data.php",
	data: { "action": "getDeviceModel" },
	success: function (response) {
		if(response) {
			switch(response.toLowerCase()) {
				case 'batterx h3':
					deviceModel = "batterx h3";
					$('._h3').css('display', 'flex');
					break;
				case 'batterx h5':
					deviceModel = "batterx h5";
					$('._h5').css('display', 'flex');
					break;
				case 'batterx h5-eco':
					deviceModel = "batterx h5-eco";
					$('._h5e').css('display', 'flex');
					break;
				case 'batterx h10':
					deviceModel = "batterx h10";
					$('._h10').css('display', 'flex');
					break;
				default:
					$('._h3, ._h5e, ._h5, ._h10').hide();
					break;
			}
			deviceModel = "batterx h5";
			setQuickCarbonBatterySetup();
		}
	}
});










/*
	Get Inverter Parameters & Initialize Fields
*/

$.ajax({
	type: 'POST',
	url: '../db-interaction/service.php',
	data: { "action": 'getSettings' },
	success: function (response) {
		if(response) {
			
			var json = JSON.parse(response);
			
			if(json.hasOwnProperty('InverterParameters')) json = json['InverterParameters']; else return;
			
			//  0 - Inverter DateTime
			if(json.hasOwnProperty('0') && json['0']['S1'].toString().length == 14) {
				deviceDate = json['0']['S1'].substr(0, 4) + "-" + json['0']['S1'].substr(4, 2)  + "-" + json['0']['S1'].substr(6, 2);
				deviceTime = json['0']['S1'].substr(8, 2) + ":" + json['0']['S1'].substr(10, 2) + ":" + json['0']['S1'].substr(12, 2);
			}
			//  1 - Flag Status
			if(json.hasOwnProperty('1') && json['1']['S1'].toString().split(",").length >= 4) {
				var tempArr = json['1']['S1'].split(',');
				muteBuzzer        = parseInt(tempArr[0] || 0);
				muteBuzzerStandby = parseInt(tempArr[1] || 0);
				muteBuzzerBattery = parseInt(tempArr[2] || 0);
				wideInputRange    = parseInt(tempArr[3] || 0);
				generatorAsInput  = parseInt(tempArr[4] || 0);
				ngRelayFunction   = parseInt(tempArr[5] || 0);
			}
			//  2 - Energy Distribution
			if(json.hasOwnProperty('2') && json['2']['S1'].toString().length == 13) {
				allowBatteryCharging          = parseInt(json['2']['S1'].charAt(0));
				allowBatteryChargingAC        = parseInt(json['2']['S1'].charAt(2));
				allowGridFeedIn               = parseInt(json['2']['S1'].charAt(4));
				allowBatteryDischargeSolarOK  = parseInt(json['2']['S1'].charAt(6));
				allowBatteryDischargeSolarNOK = parseInt(json['2']['S1'].charAt(8));
			}
			//  3 - LCD Active Time
			if(json.hasOwnProperty('3') && json['3']['S1'].toString().length == 2)
				LCDActiveTime = json['3']['S1'].toString();
			//  4 - Waiting time before grid-connection
			if(json.hasOwnProperty('4'))
				waitTimeForFeed = parseInt(json['4']['S1'].toString());
			//  5 - Battery Type
			if(json.hasOwnProperty('5') && (json['5']['S1'].toString() == "0" || json['5']['S1'].toString() == "1"))
				batteryType = parseInt(json['5']['S1'].toString());
			//  6 - Solar Energy Priority
			if(json.hasOwnProperty('6') && (json['6']['S1'].toString() == "0" || json['6']['S1'].toString() == "1" || json['6']['S1'].toString() == "2"))
				solarEnergyPriority = parseInt(json['6']['S1'].toString());
			// 15 - Max. Grid Feed-in Power
			if(json.hasOwnProperty('15') && !isNaN(json['15']['S1'].toString()))
				maxGridFeedInPower = parseInt(json['15']['S1'].toString());
			// 30 - Max. Battery Charging Current
			if(json.hasOwnProperty('30') && !isNaN(json['30']['S1'].toString()))
				maxChargingCurrent = parseInt(json['30']['S1'].toString());
			// 31 - Max. Battery Charging Current From AC
			if(json.hasOwnProperty('31') && !isNaN(json['31']['S1'].toString()))
				maxChargingCurrentAC = parseInt(json['31']['S1'].toString());
			// 32 - Battery Charging Voltage
			if(json.hasOwnProperty('32') && json['32']['S1'].toString().split(',').length == 2) {
				bulkChargingVoltage  = parseInt(json['32']['S1'].toString().split(',')[0]);
				floatChargingVoltage = parseInt(json['32']['S1'].toString().split(',')[1]);
			}
			// 33 - Battery Discharging Voltage
			if(json.hasOwnProperty('33') && json['33']['S1'].toString().split(',').length == 4) {
				cutoffVoltageHybrid      = parseInt(json['33']['S1'].toString().split(',')[0]);
				redischargeVoltageHybrid = parseInt(json['33']['S1'].toString().split(',')[1]);
				cutoffVoltage            = parseInt(json['33']['S1'].toString().split(',')[2]);
				redischargeVoltage       = parseInt(json['33']['S1'].toString().split(',')[3]);
			}
			// 34 - Max. Battery Discharging Current in Hybrid Mode
			if(json.hasOwnProperty('34') && !isNaN(json['34']['S1'].toString()))
				maxDischargeCurrentHybrid = parseFloat(json['34']['S1'].toString());
			
			
			
			// Grid Parameters
			$('#maxGridFeedInPower'           ).val(maxGridFeedInPower);
			$('#waitTimeForFeed'              ).val(waitTimeForFeed);
			// Battery Parameters
			$('#maxChargingCurrent'           ).val(maxChargingCurrent / 100);
			$('#maxChargingCurrentAC'         ).val(maxChargingCurrentAC / 100);
			$('#bulkChargingVoltage'          ).val(bulkChargingVoltage / 100);
			$('#floatChargingVoltage'         ).val(floatChargingVoltage / 100);
			$('#batteryType'                  ).val(batteryType);
			$('#cutoffVoltageHybrid'          ).val(cutoffVoltageHybrid / 100);
			$('#redischargeVoltageHybrid'     ).val(redischargeVoltageHybrid / 100);
			$('#cutoffVoltage'                ).val(cutoffVoltage / 100);
			$('#redischargeVoltage'           ).val(redischargeVoltage / 100);
			$('#maxDischargeCurrentHybrid'    ).val(maxDischargeCurrentHybrid);
			// Energy Distribution
			$('#solarEnergyPriority'          ).val(solarEnergyPriority);
			$('#allowBatteryCharging'         ).prop('checked', allowBatteryCharging);
			$('#allowBatteryChargingAC'       ).prop('checked', allowBatteryChargingAC);
			$('#allowGridFeedIn'              ).prop('checked', allowGridFeedIn);
			$('#allowBatteryDischargeSolarOK' ).prop('checked', allowBatteryDischargeSolarOK);
			$('#allowBatteryDischargeSolarNOK').prop('checked', allowBatteryDischargeSolarNOK);
			// Other Parameters
			$('#LCDActiveTime'                ).val(LCDActiveTime);
			$('#deviceDate'                   ).val(deviceDate);
			$('#deviceTime'                   ).val(deviceTime);
			$('#muteBuzzer'                   ).prop('checked', muteBuzzer);
			$('#muteBuzzerStandby'            ).prop('checked', muteBuzzerStandby);
			$('#muteBuzzerBattery'            ).prop('checked', muteBuzzerBattery);
			$('#wideInputRange'               ).prop('checked', wideInputRange);
			$('#generatorAsInput'             ).prop('checked', generatorAsInput);
			$('#ngRelayFunction'              ).prop('checked', ngRelayFunction);
		
		}
	}
});










/*
	Submit Parameters - Send Commands
*/

$('#submit').on('click', function() {
	
	if(!checkPassword()) return; // Check Password
	
	
	
	// New Grid Parameters
	new_maxGridFeedInPower            = Math.round($('#maxGridFeedInPower').val());
	new_waitTimeForFeed               = Math.round($('#waitTimeForFeed').val());
	// New Battery Parameters
	new_maxChargingCurrent            = Math.round($('#maxChargingCurrent').val() * 100);
	new_maxChargingCurrentAC          = Math.round($('#maxChargingCurrentAC').val() * 100);
	new_bulkChargingVoltage           = Math.round($('#bulkChargingVoltage').val() * 100);
	new_floatChargingVoltage          = Math.round($('#floatChargingVoltage').val() * 100);
	new_batteryType                   = Math.round($('#batteryType').val());
	new_cutoffVoltageHybrid           = Math.round($('#cutoffVoltageHybrid').val() * 100);
	new_redischargeVoltageHybrid      = Math.round($('#redischargeVoltageHybrid').val() * 100);
	new_cutoffVoltage                 = Math.round($('#cutoffVoltage').val() * 100);
	new_redischargeVoltage            = Math.round($('#redischargeVoltage').val() * 100);
	new_maxDischargeCurrentHybrid     = Math.round($('#maxDischargeCurrentHybrid').val());
	// New Energy Distribution
	new_solarEnergyPriority           = Math.round($('#solarEnergyPriority').val());
	new_allowBatteryCharging          = $('#allowBatteryCharging').is(':checked') ? 1 : 0;
	new_allowBatteryChargingAC        = $('#allowBatteryChargingAC').is(':checked') ? 1 : 0;
	new_allowGridFeedIn               = $('#allowGridFeedIn').is(':checked') ? 1 : 0;
	new_allowBatteryDischargeSolarOK  = $('#allowBatteryDischargeSolarOK').is(':checked') ? 1 : 0;
	new_allowBatteryDischargeSolarNOK = $('#allowBatteryDischargeSolarNOK').is(':checked') ? 1 : 0;
	// New Other Parameters
	new_LCDActiveTime                 = $('#LCDActiveTime').val();
	new_muteBuzzer                    = $('#muteBuzzer').is(':checked') ? 1 : 0;
	new_muteBuzzerStandby             = $('#muteBuzzerStandby').is(':checked') ? 1 : 0;
	new_muteBuzzerBattery             = $('#muteBuzzerBattery').is(':checked') ? 1 : 0;
	new_wideInputRange                = $('#wideInputRange').is(':checked') ? 1 : 0;
	new_generatorAsInput              = $('#generatorAsInput').is(':checked') ? 1 : 0;
	new_ngRelayFunction               = $('#ngRelayFunction').is(':checked') ? 1 : 0;
	//new_deviceDate                  = $('#deviceDate').val();
	//new_deviceTime                  = $('#deviceTime').val();
	
	
	
	// Send Grid Parameters
	if(maxGridFeedInPower != new_maxGridFeedInPower && new_maxGridFeedInPower.toString() != "")
		sendCommand(24085, 0, "", new_maxGridFeedInPower);
	if(waitTimeForFeed != new_waitTimeForFeed && new_waitTimeForFeed.toString() != "")
		sendCommand(24068, 0, "", new_waitTimeForFeed);
	// Send Battery Parameters
	if(maxChargingCurrent != new_maxChargingCurrent && new_maxChargingCurrent.toString() != "")
		sendCommand(24112, 0, "", new_maxChargingCurrent);
	if(maxChargingCurrentAC != new_maxChargingCurrentAC && new_maxChargingCurrentAC.toString() != "")
		sendCommand(24113, 0, "", new_maxChargingCurrentAC);
	if((bulkChargingVoltage != new_bulkChargingVoltage || floatChargingVoltage != new_floatChargingVoltage) && new_bulkChargingVoltage.toString() != "" && new_floatChargingVoltage.toString() != "")
		sendCommand(24114, 0, "", new_bulkChargingVoltage + "," + new_floatChargingVoltage);
	if(batteryType != new_batteryType && new_batteryType.toString() != "")
		sendCommand(24069, 0, "", new_batteryType);
	if((cutoffVoltageHybrid != new_cutoffVoltageHybrid || redischargeVoltageHybrid != new_redischargeVoltageHybrid || cutoffVoltage != new_cutoffVoltage || redischargeVoltage != new_redischargeVoltage) && new_cutoffVoltageHybrid.toString() != "" && new_redischargeVoltageHybrid.toString() != "" && new_cutoffVoltage.toString() != "" && new_redischargeVoltage.toString() != "")
		sendCommand(24115, 0, "", new_cutoffVoltageHybrid + "," + new_redischargeVoltageHybrid + "," + new_cutoffVoltage + "," + new_redischargeVoltage);
	if(maxDischargeCurrentHybrid != new_maxDischargeCurrentHybrid && new_maxDischargeCurrentHybrid.toString() != "")
		sendCommand(24116, 0, "", new_maxDischargeCurrentHybrid);
	// Send Energy Distribution
	if(solarEnergyPriority != new_solarEnergyPriority && new_solarEnergyPriority.toString() != "") {
		sendCommand(24070, 0, "", new_solarEnergyPriority);
		sendCommand(24066, 0, "", "A," + new_allowBatteryCharging);
		sendCommand(24066, 0, "", "B," + new_allowBatteryChargingAC);
		sendCommand(24066, 0, "", "C," + new_allowGridFeedIn);
		sendCommand(24066, 0, "", "D," + new_allowBatteryDischargeSolarOK);
		sendCommand(24066, 0, "", "E," + new_allowBatteryDischargeSolarNOK);
	} else {
		if(allowBatteryCharging != new_allowBatteryCharging && new_allowBatteryCharging.toString() != "")
			sendCommand(24066, 0, "", "A," + new_allowBatteryCharging);
		if(allowBatteryChargingAC != new_allowBatteryChargingAC && new_allowBatteryChargingAC.toString() != "")
			sendCommand(24066, 0, "", "B," + new_allowBatteryChargingAC);
		if(allowGridFeedIn != new_allowGridFeedIn && new_allowGridFeedIn.toString() != "")
			sendCommand(24066, 0, "", "C," + new_allowGridFeedIn);
		if(allowBatteryDischargeSolarOK != new_allowBatteryDischargeSolarOK && new_allowBatteryDischargeSolarOK.toString() != "")
			sendCommand(24066, 0, "", "D," + new_allowBatteryDischargeSolarOK);
		if(allowBatteryDischargeSolarNOK != new_allowBatteryDischargeSolarNOK && new_allowBatteryDischargeSolarNOK.toString() != "")
			sendCommand(24066, 0, "", "E," + new_allowBatteryDischargeSolarNOK);
	}
	// Send Other Parameters
	if(LCDActiveTime != new_LCDActiveTime && new_LCDActiveTime.toString() != "")
		sendCommand(24067, 0, "", new_LCDActiveTime);
	if(muteBuzzer != new_muteBuzzer && new_muteBuzzer.toString() != "")
		sendCommand(24065, 0, "", "A," + new_muteBuzzer);
	if(muteBuzzerStandby != new_muteBuzzerStandby && new_muteBuzzerStandby.toString() != "")
		sendCommand(24065, 0, "", "B," + new_muteBuzzerStandby);
	if(muteBuzzerBattery != new_muteBuzzerBattery && new_muteBuzzerBattery.toString() != "")
		sendCommand(24065, 0, "", "C," + new_muteBuzzerBattery);
	if(wideInputRange != new_wideInputRange && new_wideInputRange.toString() != "")
		sendCommand(24065, 0, "", "D," + new_wideInputRange);
	if(generatorAsInput != new_generatorAsInput && new_generatorAsInput.toString() != "")
		sendCommand(24065, 0, "", "E," + new_generatorAsInput);
	if(ngRelayFunction != new_ngRelayFunction && new_ngRelayFunction.toString() != "")
		sendCommand(24065, 0, "", "F," + new_ngRelayFunction);
	
});





var checkParametersInterval;

function sendCommand(type, entity, text1, text2) {
	// Check Password
	if(!checkPassword()) return;
	// Send Command
	$.ajax({
		type: 'POST',
		url: '../db-interaction/service.php',
		data: {
			"action": 'setCommand',
			"type": type,
			"entity": entity,
			"text1": text1.toString(),
			"text2": text2.toString()
		},
		success: function (response) {
			if(response) {
				$('body').addClass('no-scroll');
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
				$('.overlay').show();
				if(checkParametersInterval == undefined)
					checkParametersInterval = setInterval(checkParameters, 5000);
			} else alert("Error, please try again!");
		},
		error: function (response) { alert("Hard Error, please try again!"); }
	});
}










/*
	Check If Parameters Are Set Successfully
*/

function checkParameters() {
	$.ajax({
		type: 'POST',
		url: '../db-interaction/service.php',
		data: { "action": 'getSettings' },
		success: function (response) {
			if(response) {
				
				
				
				/*
					Return If Parameters Not Changed Yet
				*/
				
				var json = JSON.parse(response);
				if(json.hasOwnProperty('InverterParameters')) json = json['InverterParameters']; else return;
				//  0 - Inverter DateTime
				if(json.hasOwnProperty('0') && json['0']['S1'].toString().length == 14) {
					var tempDeviceTime = json['0']['S1'].substr(8, 2) + ":" + json['0']['S1'].substr(10, 2) + ":" + json['0']['S1'].substr(12, 2);
					if(deviceTime == tempDeviceTime) return false;
				}
				
				
				
				/*
					Get Inverter Parameters
				*/
				
				var notSetParameters = {};
				
				//  0 - Inverter DateTime
				if(json.hasOwnProperty('0') && json['0']['S1'].toString().length == 14) {
					deviceDate = json['0']['S1'].substr(0, 4) + "-" + json['0']['S1'].substr(4, 2)  + "-" + json['0']['S1'].substr(6, 2);
					deviceTime = json['0']['S1'].substr(8, 2) + ":" + json['0']['S1'].substr(10, 2) + ":" + json['0']['S1'].substr(12, 2);
				}
				//  1 - Flag Status
				if(json.hasOwnProperty('1') && json['1']['S1'].toString().split(",").length >= 4) {
					var tempArr = json['1']['S1'].split(',');
					muteBuzzer        = parseInt(tempArr[0] || 0);
					muteBuzzerStandby = parseInt(tempArr[1] || 0);
					muteBuzzerBattery = parseInt(tempArr[2] || 0);
					wideInputRange    = parseInt(tempArr[3] || 0);
					generatorAsInput  = parseInt(tempArr[4] || 0);
					ngRelayFunction   = parseInt(tempArr[5] || 0);
				}
				//  2 - Energy Distribution
				if(json.hasOwnProperty('2') && json['2']['S1'].toString().length == 13) {
					allowBatteryCharging          = parseInt(json['2']['S1'].charAt(0));
					allowBatteryChargingAC        = parseInt(json['2']['S1'].charAt(2));
					allowGridFeedIn               = parseInt(json['2']['S1'].charAt(4));
					allowBatteryDischargeSolarOK  = parseInt(json['2']['S1'].charAt(6));
					allowBatteryDischargeSolarNOK = parseInt(json['2']['S1'].charAt(8));
				}
				//  3 - LCD Active Time
				if(json.hasOwnProperty('3') && json['3']['S1'].toString().length == 2)
					LCDActiveTime = json['3']['S1'].toString();
				//  4 - Waiting time before grid-connection
				if(json.hasOwnProperty('4'))
					waitTimeForFeed = parseInt(json['4']['S1'].toString());
				//  5 - Battery Type
				if(json.hasOwnProperty('5') && (json['5']['S1'].toString() == "0" || json['5']['S1'].toString() == "1"))
					batteryType = parseInt(json['5']['S1'].toString());
				//  6 - Solar Energy Priority
				if(json.hasOwnProperty('6') && (json['6']['S1'].toString() == "0" || json['6']['S1'].toString() == "1" || json['6']['S1'].toString() == "2"))
					solarEnergyPriority = parseInt(json['6']['S1'].toString());
				// 15 - Max. Grid Feed-in Power
				if(json.hasOwnProperty('15') && !isNaN(json['15']['S1'].toString()))
					maxGridFeedInPower = parseInt(json['15']['S1'].toString());
				// 30 - Max. Battery Charging Current
				if(json.hasOwnProperty('30') && !isNaN(json['30']['S1'].toString()))
					maxChargingCurrent = parseInt(json['30']['S1'].toString());
				// 31 - Max. Battery Charging Current From AC
				if(json.hasOwnProperty('31') && !isNaN(json['31']['S1'].toString()))
					maxChargingCurrentAC = parseInt(json['31']['S1'].toString());
				// 32 - Battery Charging Voltage
				if(json.hasOwnProperty('32') && json['32']['S1'].toString().split(',').length == 2) {
					bulkChargingVoltage  = parseInt(json['32']['S1'].toString().split(',')[0]);
					floatChargingVoltage = parseInt(json['32']['S1'].toString().split(',')[1]);
				}
				// 33 - Battery Discharging Voltage
				if(json.hasOwnProperty('33') && json['33']['S1'].toString().split(',').length == 4) {
					cutoffVoltageHybrid      = parseInt(json['33']['S1'].toString().split(',')[0]);
					redischargeVoltageHybrid = parseInt(json['33']['S1'].toString().split(',')[1]);
					cutoffVoltage            = parseInt(json['33']['S1'].toString().split(',')[2]);
					redischargeVoltage       = parseInt(json['33']['S1'].toString().split(',')[3]);
				}
				// 34 - Max. Battery Discharging Current in Hybrid Mode
				if(json.hasOwnProperty('34') && !isNaN(json['34']['S1'].toString()))
					maxDischargeCurrentHybrid = parseFloat(json['34']['S1'].toString());
				
				
				
				/*
					Set Parameter Fields
				*/
				
				// Grid Parameters
				$('#maxGridFeedInPower'           ).val(maxGridFeedInPower);
				$('#waitTimeForFeed'              ).val(waitTimeForFeed);
				// Battery Parameters
				$('#maxChargingCurrent'           ).val(maxChargingCurrent / 100);
				$('#maxChargingCurrentAC'         ).val(maxChargingCurrentAC / 100);
				$('#bulkChargingVoltage'          ).val(bulkChargingVoltage / 100);
				$('#floatChargingVoltage'         ).val(floatChargingVoltage / 100);
				$('#batteryType'                  ).val(batteryType);
				$('#cutoffVoltageHybrid'          ).val(cutoffVoltageHybrid / 100);
				$('#redischargeVoltageHybrid'     ).val(redischargeVoltageHybrid / 100);
				$('#cutoffVoltage'                ).val(cutoffVoltage / 100);
				$('#redischargeVoltage'           ).val(redischargeVoltage / 100);
				$('#maxDischargeCurrentHybrid'    ).val(maxDischargeCurrentHybrid);
				// Energy Distribution
				$('#solarEnergyPriority'          ).val(solarEnergyPriority);
				$('#allowBatteryCharging'         ).prop('checked', allowBatteryCharging);
				$('#allowBatteryChargingAC'       ).prop('checked', allowBatteryChargingAC);
				$('#allowGridFeedIn'              ).prop('checked', allowGridFeedIn);
				$('#allowBatteryDischargeSolarOK' ).prop('checked', allowBatteryDischargeSolarOK);
				$('#allowBatteryDischargeSolarNOK').prop('checked', allowBatteryDischargeSolarNOK);
				// Other Parameters
				$('#LCDActiveTime'                ).val(LCDActiveTime);
				$('#deviceDate'                   ).val(deviceDate);
				$('#deviceTime'                   ).val(deviceTime);
				$('#muteBuzzer'                   ).prop('checked', muteBuzzer);
				$('#muteBuzzerStandby'            ).prop('checked', muteBuzzerStandby);
				$('#muteBuzzerBattery'            ).prop('checked', muteBuzzerBattery);
				$('#wideInputRange'               ).prop('checked', wideInputRange);
				$('#generatorAsInput'             ).prop('checked', generatorAsInput);
				$('#ngRelayFunction'              ).prop('checked', ngRelayFunction);
				
				
				
				/*
					Verify All Parameters
				*/
				
				// Grid Parameters
				if(maxGridFeedInPower != new_maxGridFeedInPower)
					notSetParameters['maxGridFeedInPower'] = new_maxGridFeedInPower;
				if(waitTimeForFeed != new_waitTimeForFeed)
					notSetParameters['waitTimeForFeed'] = new_waitTimeForFeed;
				// Battery Parameters
				if(maxChargingCurrent != new_maxChargingCurrent)
					notSetParameters['maxChargingCurrent'] = new_maxChargingCurrent;
				if(maxChargingCurrentAC != new_maxChargingCurrentAC)
					notSetParameters['maxChargingCurrentAC'] = new_maxChargingCurrentAC;
				if(bulkChargingVoltage != new_bulkChargingVoltage)
					notSetParameters['bulkChargingVoltage'] = new_bulkChargingVoltage;
				if(floatChargingVoltage != new_floatChargingVoltage)
					notSetParameters['floatChargingVoltage'] = new_floatChargingVoltage;
				if(batteryType != new_batteryType)
					notSetParameters['batteryType'] = new_batteryType;
				if(cutoffVoltageHybrid != new_cutoffVoltageHybrid)
					notSetParameters['cutoffVoltageHybrid'] = new_cutoffVoltageHybrid;
				if(redischargeVoltageHybrid != new_redischargeVoltageHybrid)
					notSetParameters['redischargeVoltageHybrid'] = new_redischargeVoltageHybrid;
				if(cutoffVoltage != new_cutoffVoltage)
					notSetParameters['cutoffVoltage'] = new_cutoffVoltage;
				if(redischargeVoltage != new_redischargeVoltage)
					notSetParameters['redischargeVoltage'] = new_redischargeVoltage;
				if(maxDischargeCurrentHybrid != new_maxDischargeCurrentHybrid)
					notSetParameters['maxDischargeCurrentHybrid'] = new_maxDischargeCurrentHybrid;
				// Energy Distribution
				if(solarEnergyPriority != new_solarEnergyPriority)
					notSetParameters['solarEnergyPriority'] = new_solarEnergyPriority;
				if(allowBatteryCharging != new_allowBatteryCharging)
					notSetParameters['allowBatteryCharging'] = new_allowBatteryCharging;
				if(allowBatteryChargingAC != new_allowBatteryChargingAC)
					notSetParameters['allowBatteryChargingAC'] = new_allowBatteryChargingAC;
				if(allowGridFeedIn != new_allowGridFeedIn)
					notSetParameters['allowGridFeedIn'] = new_allowGridFeedIn;
				if(allowBatteryDischargeSolarOK != new_allowBatteryDischargeSolarOK)
					notSetParameters['allowBatteryDischargeSolarOK'] = new_allowBatteryDischargeSolarOK;
				if(allowBatteryDischargeSolarNOK != new_allowBatteryDischargeSolarNOK)
					notSetParameters['allowBatteryDischargeSolarNOK'] = new_allowBatteryDischargeSolarNOK;
				// Other Parameters
				if(LCDActiveTime != new_LCDActiveTime)
					notSetParameters['LCDActiveTime'] = new_LCDActiveTime;
				if(muteBuzzer != new_muteBuzzer)
					notSetParameters['muteBuzzer'] = new_muteBuzzer;
				if(muteBuzzerStandby != new_muteBuzzerStandby)
					notSetParameters['muteBuzzerStandby'] = new_muteBuzzerStandby;
				if(muteBuzzerBattery != new_muteBuzzerBattery)
					notSetParameters['muteBuzzerBattery'] = new_muteBuzzerBattery;
				if(wideInputRange != new_wideInputRange)
					notSetParameters['wideInputRange'] = new_wideInputRange;
				if(generatorAsInput != new_generatorAsInput)
					notSetParameters['generatorAsInput'] = new_generatorAsInput;
				if(ngRelayFunction != new_ngRelayFunction)
					notSetParameters['ngRelayFunction'] = new_ngRelayFunction;
				
				
				
				/*
					Clear Interval
				*/
				
				clearInterval(checkParametersInterval);
				checkParametersInterval = undefined;
				
				/*
					Reload Page If All Parameters Set Successfully
				*/
				
				console.log(notSetParameters);
				
				var retry = false;
				
				if(Object.keys(notSetParameters).length === 0) {
					location.reload(true);
				} else if(numRetries == 0) {
					retry = true;
					numRetries++;
				} else {
					retry = confirm('Some parameters were not set correctly.\n\nWould you like to retry?');
				}
				
				if(retry) {
					// Grid Parameters
					if(notSetParameters.hasOwnProperty('maxGridFeedInPower'))
						$('#maxGridFeedInPower'           ).val(notSetParameters['maxGridFeedInPower']);
					if(notSetParameters.hasOwnProperty('waitTimeForFeed'))
						$('#waitTimeForFeed'              ).val(notSetParameters['waitTimeForFeed']);
					// Battery Parameters
					if(notSetParameters.hasOwnProperty('maxChargingCurrent'))
						$('#maxChargingCurrent'           ).val(notSetParameters['maxChargingCurrent'] / 100);
					if(notSetParameters.hasOwnProperty('maxChargingCurrentAC'))
						$('#maxChargingCurrentAC'         ).val(notSetParameters['maxChargingCurrentAC'] / 100);
					if(notSetParameters.hasOwnProperty('bulkChargingVoltage'))
						$('#bulkChargingVoltage'          ).val(notSetParameters['bulkChargingVoltage'] / 100);
					if(notSetParameters.hasOwnProperty('floatChargingVoltage'))
						$('#floatChargingVoltage'         ).val(notSetParameters['floatChargingVoltage'] / 100);
					if(notSetParameters.hasOwnProperty('batteryType'))
						$('#batteryType'                  ).val(notSetParameters['batteryType']);
					if(notSetParameters.hasOwnProperty('cutoffVoltageHybrid'))
						$('#cutoffVoltageHybrid'          ).val(notSetParameters['cutoffVoltageHybrid'] / 100);
					if(notSetParameters.hasOwnProperty('redischargeVoltageHybrid'))
						$('#redischargeVoltageHybrid'     ).val(notSetParameters['redischargeVoltageHybrid'] / 100);
					if(notSetParameters.hasOwnProperty('cutoffVoltage'))
						$('#cutoffVoltage'                ).val(notSetParameters['cutoffVoltage'] / 100);
					if(notSetParameters.hasOwnProperty('redischargeVoltage'))
						$('#redischargeVoltage'           ).val(notSetParameters['redischargeVoltage'] / 100);
					if(notSetParameters.hasOwnProperty('maxDischargeCurrentHybrid'))
						$('#maxDischargeCurrentHybrid'    ).val(notSetParameters['maxDischargeCurrentHybrid']);
					// Energy Distribution
					if(notSetParameters.hasOwnProperty('solarEnergyPriority'))
						$('#solarEnergyPriority'          ).val(notSetParameters['solarEnergyPriority']);
					if(notSetParameters.hasOwnProperty('allowBatteryCharging'))
						$('#allowBatteryCharging'         ).prop('checked', notSetParameters['allowBatteryCharging']);
					if(notSetParameters.hasOwnProperty('allowBatteryChargingAC'))
						$('#allowBatteryChargingAC'       ).prop('checked', notSetParameters['allowBatteryChargingAC']);
					if(notSetParameters.hasOwnProperty('allowGridFeedIn'))
						$('#allowGridFeedIn'              ).prop('checked', notSetParameters['allowGridFeedIn']);
					if(notSetParameters.hasOwnProperty('allowBatteryDischargeSolarOK'))
						$('#allowBatteryDischargeSolarOK' ).prop('checked', notSetParameters['allowBatteryDischargeSolarOK']);
					if(notSetParameters.hasOwnProperty('allowBatteryDischargeSolarNOK'))
						$('#allowBatteryDischargeSolarNOK').prop('checked', notSetParameters['allowBatteryDischargeSolarNOK']);
					// Other Parameters
					if(notSetParameters.hasOwnProperty('LCDActiveTime'))
						$('#LCDActiveTime'                ).val(notSetParameters['LCDActiveTime']);
					if(notSetParameters.hasOwnProperty('deviceDate'))
						$('#deviceDate'                   ).val(notSetParameters['deviceDate']);
					if(notSetParameters.hasOwnProperty('deviceTime'))
						$('#deviceTime'                   ).val(notSetParameters['deviceTime']);
					if(notSetParameters.hasOwnProperty('muteBuzzer'))
						$('#muteBuzzer'                   ).prop('checked', notSetParameters['muteBuzzer']);
					if(notSetParameters.hasOwnProperty('muteBuzzerStandby'))
						$('#muteBuzzerStandby'            ).prop('checked', notSetParameters['muteBuzzerStandby']);
					if(notSetParameters.hasOwnProperty('muteBuzzerBattery'))
						$('#muteBuzzerBattery'            ).prop('checked', notSetParameters['muteBuzzerBattery']);
					if(notSetParameters.hasOwnProperty('wideInputRange'))
						$('#wideInputRange'               ).prop('checked', notSetParameters['wideInputRange']);
					if(notSetParameters.hasOwnProperty('generatorAsInput'))
						$('#generatorAsInput'             ).prop('checked', notSetParameters['generatorAsInput']);
					if(notSetParameters.hasOwnProperty('ngRelayFunction'))
						$('#ngRelayFunction'              ).prop('checked', notSetParameters['ngRelayFunction']);
				
					$('#submit').click();
				} else {
					location.reload(true);
				}
				
				
				
			}
		}
	});
}










/*
	Quick Setup
*/

function setQuickCarbonBatterySetup() {
	if(deviceModel == 'batterx h3') {
		$('#batteryStorage').html(`
			<option disabled selected></option>
			<option>Sc 6</option>
			<option>Sc 8</option>
			<option>Sc 12</option>
		`);
	} else if(deviceModel == 'batterx h5-eco') {
		$('#batteryStorage').html(`
			<option disabled selected></option>
			<option>Mc 6</option>
			<option>Mc 8</option>
			<option>Mc 12</option>
			<option>Mc 16</option>
		`);
	} else if(deviceModel == 'batterx h5') {
		$('#batteryStorage').html(`
			<option disabled selected></option>
			<option>Lc 6</option>
			<option>Lc 8</option>
			<option>Lc 12</option>
			<option>Lc 16</option>
			<option>Lc 24</option>
			<option>Lc 30</option>
		`);
	} else if(deviceModel == 'batterx h10') {
		$('#batteryStorage').html(`
			<option disabled selected></option>
			<option>XLc 12</option>
			<option>XLc 16</option>
			<option>XLc 24</option>
			<option>XLc 30</option>
		`);
	}
}

$('#showAdvanced').on('click', function() {
	$('#quickSetup, #showAdvanced').addClass('d-none');
	$('#advancedSetup').removeClass('d-none');
});

$('#applyLiFePO').on('click', function() {
	
	var numberOfModules = $('#numberOfModules').val();
	if(!parseInt(numberOfModules)) return false;
	
	var enable_feedInLimit_70p = $('#enable_feedInLimit_70p_lifepo').is(':checked');
	
	var _maxChargingCurrent = 25;
	var _maxDischargingCurrent = 150;
	     if(deviceModel == 'batterx h3')     { _maxChargingCurrent =  25; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5-eco') { _maxChargingCurrent =  60; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5')     { _maxChargingCurrent = 100; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h10')    { _maxChargingCurrent = 200; _maxDischargingCurrent = 300; }
	
	var temp_maxGridFeedInPower = "";
	     if(deviceModel == 'batterx h3')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "2100" :  "3000";
	else if(deviceModel == 'batterx h5-eco') temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3850" :  "5500";
	else if(deviceModel == 'batterx h5')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3500" :  "5000";
	else if(deviceModel == 'batterx h10')    temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "7000" : "10000";
	if(temp_maxGridFeedInPower != "") $('#maxGridFeedInPower').val(temp_maxGridFeedInPower);
	
	$('#maxChargingCurrent'           ).val(Math.min(numberOfModules * 37, _maxChargingCurrent));
	$('#maxChargingCurrentAC'         ).val(Math.min(numberOfModules * 37, Math.min(72, _maxChargingCurrent)));
	$('#maxDischargeCurrentHybrid'    ).val(Math.min(numberOfModules * 37, _maxDischargingCurrent));
	$('#bulkChargingVoltage'          ).val('53.2');
	$('#floatChargingVoltage'         ).val('53.2');
	$('#cutoffVoltageHybrid'          ).val('46.0');
	$('#redischargeVoltageHybrid'     ).val('50.0');
	$('#cutoffVoltage'                ).val('46.0');
	$('#redischargeVoltage'           ).val('50.0');
	$('#solarEnergyPriority'          ).val('1');
	$('#batteryType'                  ).val('1');
	$('#allowBatteryCharging'         ).prop('checked', true);
	$('#allowBatteryChargingAC'       ).prop('checked', false);
	$('#allowGridFeedIn'              ).prop('checked', true);
	$('#allowBatteryDischargeSolarOK' ).prop('checked', true);
	$('#allowBatteryDischargeSolarNOK').prop('checked', true);
	
	$('#submit').click();
	
});

$('#applyCarbon').on('click', function() {
	
	var numberOfBatteries = $('#numberOfBatteries').val();
	var batteryCapacity = $('#batteryCapacity').val();
	var depthOfDischarge = $('#depthOfDischarge').val();
	if(!parseInt(numberOfBatteries) || !parseInt(batteryCapacity) || !parseInt(depthOfDischarge)) {
		$('.carbon.setting-preview').addClass('d-none');
		return false;
	}
	
	var enable_feedInLimit_70p = $('#enable_feedInLimit_70p_carbon').is(':checked');
	
	var _maxChargingCurrent = 25;
	var _maxDischargingCurrent = 150;
	     if(deviceModel == 'batterx h3')     { _maxChargingCurrent =  25; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5-eco') { _maxChargingCurrent =  60; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5')     { _maxChargingCurrent = 100; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h10')    { _maxChargingCurrent = 200; _maxDischargingCurrent = 300; }
	
	var temp_maxGridFeedInPower = "";
	     if(deviceModel == 'batterx h3')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "2100" :  "3000";
	else if(deviceModel == 'batterx h5-eco') temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3850" :  "5500";
	else if(deviceModel == 'batterx h5')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3500" :  "5000";
	else if(deviceModel == 'batterx h10')    temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "7000" : "10000";
	if(temp_maxGridFeedInPower != "") $('#maxGridFeedInPower').val(temp_maxGridFeedInPower);
	
	var temp_cutoffVoltageHybrid = "48.0";
	     if(depthOfDischarge == 70) temp_cutoffVoltageHybrid = "47.9";
	else if(depthOfDischarge == 60) temp_cutoffVoltageHybrid = "48.5";
	else if(depthOfDischarge == 50) temp_cutoffVoltageHybrid = "49.1";
	else if(depthOfDischarge == 40) temp_cutoffVoltageHybrid = "49.7";
	
	var temp_storageCapacity = numberOfBatteries / 4 * batteryCapacity;
	
	$('#maxChargingCurrent'           ).val(Math.round(Math.min(temp_storageCapacity * 0.15, _maxChargingCurrent)));
	$('#maxChargingCurrentAC'         ).val(Math.round(Math.min(temp_storageCapacity * 0.15, _maxChargingCurrent)));
	$('#maxDischargeCurrentHybrid'    ).val(Math.round(Math.min(temp_storageCapacity * 0.40, _maxDischargingCurrent)));
	$('#bulkChargingVoltage'          ).val('56.0');
	$('#floatChargingVoltage'         ).val('54.5');
	$('#cutoffVoltageHybrid'          ).val(temp_cutoffVoltageHybrid);
	$('#redischargeVoltageHybrid'     ).val('54.0');
	$('#cutoffVoltage'                ).val('42.0');
	$('#redischargeVoltage'           ).val('48.0');
	$('#solarEnergyPriority'          ).val('1');
	$('#batteryType'                  ).val('0');
	$('#allowBatteryCharging'         ).prop('checked', true);
	$('#allowBatteryChargingAC'       ).prop('checked', false);
	$('#allowGridFeedIn'              ).prop('checked', true);
	$('#allowBatteryDischargeSolarOK' ).prop('checked', true);
	$('#allowBatteryDischargeSolarNOK').prop('checked', true);
	
	$('#submit').click();
	
});



$('#numberOfModules, #enable_feedInLimit_70p_lifepo').on('change', function() {
	
	var numberOfModules = $('#numberOfModules').val();
	if(!parseInt(numberOfModules)) {
		$('.lifepo.setting-preview').addClass('d-none');
		$('.lifepoSpace').removeClass('d-none');
		return false;
	}
	
	var enable_feedInLimit_70p = $('#enable_feedInLimit_70p_lifepo').is(':checked');
	
	var _maxChargingCurrent = 25;
	var _maxDischargingCurrent = 150;
	     if(deviceModel == 'batterx h3')     { _maxChargingCurrent =  25; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5-eco') { _maxChargingCurrent =  60; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5')     { _maxChargingCurrent = 100; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h10')    { _maxChargingCurrent = 200; _maxDischargingCurrent = 300; }
	
	var temp_maxGridFeedInPower = "";
	     if(deviceModel == 'batterx h3')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "2100" :  "3000";
	else if(deviceModel == 'batterx h5-eco') temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3850" :  "5500";
	else if(deviceModel == 'batterx h5')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3500" :  "5000";
	else if(deviceModel == 'batterx h10')    temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "7000" : "10000";
	if(temp_maxGridFeedInPower != "") $('.lifepo .maxGridFeedInPower').text(temp_maxGridFeedInPower + " W");
	
	$('.lifepo .maxChargingCurrent'           ).text(Math.min(numberOfModules * 37, _maxChargingCurrent) + " A");
	$('.lifepo .maxChargingCurrentAC'         ).text(Math.min(numberOfModules * 37, Math.min(72, _maxChargingCurrent)) + " A");
	$('.lifepo .maxDischargeCurrentHybrid'    ).text(Math.min(numberOfModules * 37, _maxDischargingCurrent) + " A");
	$('.lifepo .bulkChargingVoltage'          ).text('53.2 V');
	$('.lifepo .floatChargingVoltage'         ).text('53.2 V');
	$('.lifepo .cutoffVoltageHybrid'          ).text('46.0 V');
	$('.lifepo .redischargeVoltageHybrid'     ).text('50.0 V');
	$('.lifepo .cutoffVoltage'                ).text('46.0 V');
	$('.lifepo .redischargeVoltage'           ).text('50.0 V');
	$('.lifepo .solarEnergyPriority'          ).text('L-B-G');
	$('.lifepo .batteryType'                  ).text('Li-Fe');
	$('.lifepo .allowBatteryCharging'         ).text('ON');
	$('.lifepo .allowBatteryChargingAC'       ).text('OFF');
	$('.lifepo .allowGridFeedIn'              ).text('ON');
	$('.lifepo .allowBatteryDischargeSolarOK' ).text('ON');
	$('.lifepo .allowBatteryDischargeSolarNOK').text('ON');
	
	$('.lifepo.setting-preview').removeClass('d-none');
	$('.lifepoSpace').addClass('d-none');
	
});

$('#batteryCapacity, #numberOfBatteries, #depthOfDischarge, #enable_feedInLimit_70p_carbon').on('change', function() {
	
	var numberOfBatteries = $('#numberOfBatteries').val();
	var batteryCapacity = $('#batteryCapacity').val();
	var depthOfDischarge = $('#depthOfDischarge').val();
	if(!parseInt(numberOfBatteries) || !parseInt(batteryCapacity) || !parseInt(depthOfDischarge)) {
		$('.carbon.setting-preview').addClass('d-none');
		return false;
	}
	
	var enable_feedInLimit_70p = $('#enable_feedInLimit_70p_carbon').is(':checked');
	
	var _maxChargingCurrent = 25;
	var _maxDischargingCurrent = 150;
	     if(deviceModel == 'batterx h3')     { _maxChargingCurrent =  25; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5-eco') { _maxChargingCurrent =  60; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h5')     { _maxChargingCurrent = 100; _maxDischargingCurrent = 150; }
	else if(deviceModel == 'batterx h10')    { _maxChargingCurrent = 200; _maxDischargingCurrent = 300; }
	
	var temp_maxGridFeedInPower = "";
	     if(deviceModel == 'batterx h3')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "2100" :  "3000";
	else if(deviceModel == 'batterx h5-eco') temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3850" :  "5500";
	else if(deviceModel == 'batterx h5')     temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "3500" :  "5000";
	else if(deviceModel == 'batterx h10')    temp_maxGridFeedInPower = enable_feedInLimit_70p ?  "7000" : "10000";
	if(temp_maxGridFeedInPower != "") $('.carbon .maxGridFeedInPower').text(temp_maxGridFeedInPower + " W");
	
	var temp_cutoffVoltageHybrid = "48.0";
	     if(depthOfDischarge == 70) temp_cutoffVoltageHybrid = "47.9";
	else if(depthOfDischarge == 60) temp_cutoffVoltageHybrid = "48.5";
	else if(depthOfDischarge == 50) temp_cutoffVoltageHybrid = "49.1";
	else if(depthOfDischarge == 40) temp_cutoffVoltageHybrid = "49.7";
	
	var temp_storageCapacity = numberOfBatteries / 4 * batteryCapacity;
	
	$('.carbon .maxChargingCurrent'           ).text(Math.round(Math.min(temp_storageCapacity * 0.15, _maxChargingCurrent)) + " A");
	$('.carbon .maxChargingCurrentAC'         ).text(Math.round(Math.min(temp_storageCapacity * 0.15, _maxChargingCurrent)) + " A");
	$('.carbon .maxDischargeCurrentHybrid'    ).text(Math.round(Math.min(temp_storageCapacity * 0.40, _maxDischargingCurrent)) + " A");
	$('.carbon .bulkChargingVoltage'          ).text('56.0 V');
	$('.carbon .floatChargingVoltage'         ).text('54.5 V');
	$('.carbon .cutoffVoltageHybrid'          ).text(temp_cutoffVoltageHybrid + " V");
	$('.carbon .redischargeVoltageHybrid'     ).text('54.0 V');
	$('.carbon .cutoffVoltage'                ).text('42.0 V');
	$('.carbon .redischargeVoltage'           ).text('48.0 V');
	$('.carbon .solarEnergyPriority'          ).text('L-B-G');
	$('.carbon .batteryType'                  ).text('Ordinary');
	$('.carbon .allowBatteryCharging'         ).text('ON');
	$('.carbon .allowBatteryChargingAC'       ).text('OFF');
	$('.carbon .allowGridFeedIn'              ).text('ON');
	$('.carbon .allowBatteryDischargeSolarOK' ).text('ON');
	$('.carbon .allowBatteryDischargeSolarNOK').text('ON');
	
	$('.carbon.setting-preview').removeClass('d-none');
	
});
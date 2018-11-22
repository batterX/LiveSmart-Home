// Get All Needed Strings

var lang = {
	"solar":   "SOLAR",
	"grid":    "GRID",
	"battery": "BATTERY",
	"load":    "LOAD",
	"off":     "OFF",
	"on":      "ON"
}





// Get Device Model

var token = "";
var model = "";










/*
	BOTH CLOUD AND LOCAL ARE SAME BELOW THIS COMMENT
	
	WHEN EDITING, IT'S BETTER TO USE THE CLOUD FILE
*/










// Get Device Model

$.ajax({
	type: "POST",
	url: "db-interaction/data.php",
	data: { "token": token, "action": "getDeviceModel" },
	success: function (response) {
		if(response) {
			model = response.toLowerCase();
			if(model.toLowerCase() == "batterx h3")
				$("body").addClass('bx_h3');
			else if(model.toLowerCase() == "batterx h5-eco")
				$("body").addClass('bx_h5e');
			else if(model.toLowerCase() == "batterx h10")
				$("body").addClass('bx_h10');
			else if(model.toLowerCase() == "batterx bs")
				$("body").addClass('bx_bs');
			else
				$("body").addClass('bx_h5');
		}
	}
});










// Fade-Toggle All Arrows Every 1 Second

setInterval(function() { $(".arrow-line").fadeToggle(1000); }, 900);










// System ProgressBar Design

var bar = new ProgressBar.Circle(progressBar, {
	color: '#87d403',
	trailColor: '#7b7b7b',
	strokeWidth: 4,
	trailWidth: 4,
	easing: 'easeInOut',
	duration: 5000,
	text: {
		style: {
			color: '#ffffff',
			position: 'absolute',
			left: '50%',
			top: '50%',
			padding: 0,
			margin: 0,
			fontFamily: "'Raleway'",
			transform: {
				prefix: true,
				value: 'translate(-50%, -50%)'
			}
		},
		autoStyleContainer: false
	},
	svgStyle: {
		transform: 'rotate(180deg)',
		display: 'block',
		width: '100%'
	},
	fill: '#000000',
	from: { color: '#ff0000', width: 4 },
	to:   { color: '#87d403', width: 4 },
	step: function(state, circle) {
		circle.path.setAttribute('stroke', state.color);
		circle.path.setAttribute('stroke-width', state.width);
		// Set Value Inside Circle
		var value = Math.round(circle.value() * 100);
		circle.setText(value + "<sup>%</sup>");
	}
});










// Start Main Loop Function
// Handles Updating Everything on the Page
// Loop - Long Polling - Every 5 seconds

mainLoop();

function mainLoop() {
	
	$.ajax({
		type: "POST",
		url: "db-interaction/data.php",
		data: { "token": token, "action": "getCurrentState" },
		complete: function (data) {
			// Long Polling Every 5 Seconds
			setTimeout(function() { mainLoop(); }, 5000);
			// Fade Out the Overlay (Visible only on first run)
			$('.overlay').fadeOut();
		},
		success: function (response) {
			
			
			
			
			
			
			
			
			
			
			/*
				Format Response To JSON
			*/
			
			var json = JSON.parse(response);
			
			var json_has = function(type, entity) {
				if(entity !== undefined)
					return json.hasOwnProperty(''+type) && json[type].hasOwnProperty(''+entity);
				return json.hasOwnProperty(type);
			}
			var json_get = function(type, entity) {
				if(entity !== undefined)
					return json[type][entity];
				return json[type][Object.keys(json[type])[0]];
			}
			
			
			
			
			
			
			
			
			
			
			/*
				Update Last Timestamp in Index.php
			*/
			
			window.parent.updateLastTimestamp(json["logtime"]);
			
			
			
			
			
			
			
			
			
			
			/*
				Set Working Mode (sblg sblgh sblghe)
			*/
			
			$('body').removeClass("sblg sblgh sblghe");
			
			if(json_has(0xB61, 0) && json_has(0xB61, 2))
				if(json_has(0xB61, 3))
					$('body').addClass('sblghe');
				else
					$('body').addClass('sblgh');
			else
				$('body').addClass('sblg');
			
			
			
			
			
			
			
			
			
			
			/*
				Hide Blocks
			*/
			
			$('body').removeClass("hide_extsol hide_solar hide_battery hide_grid hide_house hide_load");
			
			// Hide Grid
			let grid1 = json_has(0x111) ? json_get(0x111) : 0,
				grid2 = json_has(0x112) ? json_get(0x112) : 0,
				grid3 = json_has(0x113) ? json_get(0x113) : 0;
			if(grid1 < 500 && grid2 < 500 && grid3 < 500)
				$('body').addClass('hide_grid hide_house hide_extsol');
			
			// Hide House
			if(!json_has(0xB61, 2))
				$('body').addClass('hide_house');
			
			// Hide External Solar
			if(!json_has(0xB61, 3))
				$('body').addClass('hide_extsol');
			
			// Hide Battery
			let batteryMinus = json_has(0x411) ? json_get(0x411) : 0,
				batteryPlus  = json_has(0x412) ? json_get(0x412) : 0;
			if(batteryMinus < 500 && batteryPlus < 500)
				$('body').addClass('hide_battery');
			
			// Hide Load
			let load1 = json_has(0x511) ? json_get(0x511) : 0,
				load2 = json_has(0x512) ? json_get(0x512) : 0,
				load3 = json_has(0x513) ? json_get(0x513) : 0;
			if(load1 < 500 & load2 < 500 && load3 < 500)
				$('body').addClass('hide_load');
			
			// Hide Solar
			let c1_mppt1 = json_has(0x611, 1) ? json_get(0x611, 1) : 0,
				c1_mppt2 = json_has(0x612, 1) ? json_get(0x612, 1) : 0,
				c1_mppt3 = json_has(0x613, 1) ? json_get(0x613, 1) : 0,
				c1_mppt4 = json_has(0x614, 1) ? json_get(0x614, 1) : 0,
				c2_mppt1 = json_has(0x611, 2) ? json_get(0x611, 2) : 0,
				c2_mppt2 = json_has(0x612, 2) ? json_get(0x612, 2) : 0,
				c2_mppt3 = json_has(0x613, 2) ? json_get(0x613, 2) : 0,
				c2_mppt4 = json_has(0x614, 2) ? json_get(0x614, 2) : 0;
			if(c1_mppt1 < 500 && c1_mppt2 < 500 && c1_mppt3 < 500 && c1_mppt4 < 500 &&
			   c2_mppt1 < 500 && c2_mppt2 < 500 && c2_mppt3 < 500 && c2_mppt4 < 500)
				$('body').addClass('hide_solar');
			
			
			
			
			
			
			
			
			
			
			/*
				Get All Needed Values
			*/
			
			let battery_minus          = json_has(0x411),
				battery_plus           = json_has(0x412);
			let battery_minus_voltage  = round( (json_has(0x411) ? json_get(0x411) : 0) * 0.01, 1 ),
				battery_minus_current  = round( (json_has(0x421) ? json_get(0x421) : 0) * 0.01, 1 ),
				battery_minus_capacity = round( (json_has(0x431) ? json_get(0x431) : 0) * 1.00, 0 ),
				battery_plus_voltage   = round( (json_has(0x412) ? json_get(0x412) : 0) * 0.01, 1 ),
				battery_plus_current   = round( (json_has(0x422) ? json_get(0x422) : 0) * 0.01, 1 ),
				battery_plus_capacity  = round( (json_has(0x432) ? json_get(0x432) : 0) * 1.00, 0 ),
				battery_power_total    = round( (json_has(0x461) ? json_get(0x461) : 0) * 1.00, 0 );
			
			
			let house_L1               = json_has(0xB51, 2),
				house_L2               = json_has(0xB52, 2),
				house_L3               = json_has(0xB53, 2);
			let house_L1_power         = json_has(0xB51, 2) ? json_get(0xB51, 2) : 0,
				house_L2_power         = json_has(0xB52, 2) ? json_get(0xB52, 2) : 0,
				house_L3_power         = json_has(0xB53, 2) ? json_get(0xB53, 2) : 0,
				house_power_total      = json_has(0xB61, 2) ? json_get(0xB61, 2) : 0;
			
			
			let load_L1                = json_has(0x511),
				load_L2                = json_has(0x512),
				load_L3                = json_has(0x513);
			let load_L1_voltage        = round( (json_has(0x511) ? json_get(0x511) : 0) * 0.01, 1 ),
				load_L1_power          = round( (json_has(0x551) ? json_get(0x551) : 0) * 1.00, 0 ),
				load_L2_voltage        = round( (json_has(0x512) ? json_get(0x512) : 0) * 0.01, 1 ),
				load_L2_power          = round( (json_has(0x552) ? json_get(0x552) : 0) * 1.00, 0 ),
				load_L3_voltage        = round( (json_has(0x513) ? json_get(0x513) : 0) * 0.01, 1 ),
				load_L3_power          = round( (json_has(0x553) ? json_get(0x553) : 0) * 1.00, 0 ),
				load_power_total       = round( (json_has(0x561) ? json_get(0x561) : 0) * 1.00, 0 );
			
			
			let extsol_L1              = json_has(0xB51, 3),
				extsol_L2              = json_has(0xB52, 3),
				extsol_L3              = json_has(0xB53, 3);
			let extsol_L1_power        = json_has(0xB51, 3) ? json_get(0xB51, 3) : 0,
				extsol_L2_power        = json_has(0xB52, 3) ? json_get(0xB52, 3) : 0,
				extsol_L3_power        = json_has(0xB53, 3) ? json_get(0xB53, 3) : 0,
				extsol_power_total     = json_has(0xB61, 3) ? json_get(0xB61, 3) : 0;
			
			
			let grid_L1                = json_has(0x111),
				grid_L2                = json_has(0x112),
				grid_L3                = json_has(0x113);
			let grid_L1_voltage        = round( (json_has(0x111) ? json_get(0x111) : 0) * 0.01, 1 ),
				grid_L1_power          = round( (json_has(0x151) ? json_get(0x151) : 0) * 1.00, 0 ),
				grid_L2_voltage        = round( (json_has(0x112) ? json_get(0x112) : 0) * 0.01, 1 ),
				grid_L2_power          = round( (json_has(0x152) ? json_get(0x152) : 0) * 1.00, 0 ),
				grid_L3_voltage        = round( (json_has(0x113) ? json_get(0x113) : 0) * 0.01, 1 ),
				grid_L3_power          = round( (json_has(0x153) ? json_get(0x153) : 0) * 1.00, 0 ),
				grid_power_total       = round( (json_has(0x161) ? json_get(0x161) : 0) * 1.00, 0 );
			
			
			let emeter_L               = json_has(0xB61, 0),
				emeter_L1              = json_has(0xB51, 0),
				emeter_L2              = json_has(0xB52, 0),
				emeter_L3              = json_has(0xB53, 0);
			let emeter_L1_voltage      = round( (json_has(0xB11, 0) ? json_get(0xB11, 0) : 0) * 0.01, 1 ),
				emeter_L1_power        = round( (json_has(0xB51, 0) ? json_get(0xB51, 0) : 0) * 1.00, 0 ),
				emeter_L2_voltage      = round( (json_has(0xB12, 0) ? json_get(0xB12, 0) : 0) * 0.01, 1 ),
				emeter_L2_power        = round( (json_has(0xB52, 0) ? json_get(0xB52, 0) : 0) * 1.00, 0 ),
				emeter_L3_voltage      = round( (json_has(0xB13, 0) ? json_get(0xB13, 0) : 0) * 0.01, 1 ),
				emeter_L3_power        = round( (json_has(0xB53, 0) ? json_get(0xB53, 0) : 0) * 1.00, 0 ),
				emeter_power_total     = round( (json_has(0xB61, 0) ? json_get(0xB61, 0) : 0) * 1.00, 0 );
			
			
			let solar_c1_mppt1         = json_has(0x611, 1),
				solar_c1_mppt2         = json_has(0x612, 1),
				solar_c1_mppt3         = json_has(0x613, 1),
				solar_c1_mppt4         = json_has(0x614, 1),
				solar_c2_mppt1         = json_has(0x611, 2),
				solar_c2_mppt2         = json_has(0x612, 2),
				solar_c2_mppt3         = json_has(0x613, 2),
				solar_c2_mppt4         = json_has(0x614, 2);
			let solar_c1               = solar_c1_mppt1 || solar_c1_mppt2 || solar_c1_mppt3 || solar_c1_mppt4,
				solar_c2               = solar_c2_mppt1 || solar_c2_mppt2 || solar_c2_mppt3 || solar_c2_mppt4;
			let solar_c1_mppt1_voltage = round( (json_has(0x611, 1) ? json_get(0x611, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt1_current = round( (json_has(0x621, 1) ? json_get(0x621, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt1_power   = round( (json_has(0x651, 1) ? json_get(0x651, 1) : 0) * 1.00, 0 ),
				solar_c1_mppt2_voltage = round( (json_has(0x612, 1) ? json_get(0x612, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt2_current = round( (json_has(0x622, 1) ? json_get(0x622, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt2_power   = round( (json_has(0x652, 1) ? json_get(0x652, 1) : 0) * 1.00, 0 ),
				solar_c1_mppt3_voltage = round( (json_has(0x613, 1) ? json_get(0x613, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt3_current = round( (json_has(0x623, 1) ? json_get(0x623, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt3_power   = round( (json_has(0x653, 1) ? json_get(0x653, 1) : 0) * 1.00, 0 ),
				solar_c1_mppt4_voltage = round( (json_has(0x614, 1) ? json_get(0x614, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt4_current = round( (json_has(0x624, 1) ? json_get(0x624, 1) : 0) * 0.01, 1 ),
				solar_c1_mppt4_power   = round( (json_has(0x654, 1) ? json_get(0x654, 1) : 0) * 1.00, 0 ),
				solar_c2_mppt1_voltage = round( (json_has(0x611, 2) ? json_get(0x611, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt1_current = round( (json_has(0x621, 2) ? json_get(0x621, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt1_power   = round( (json_has(0x651, 2) ? json_get(0x651, 2) : 0) * 1.00, 0 ),
				solar_c2_mppt2_voltage = round( (json_has(0x612, 2) ? json_get(0x612, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt2_current = round( (json_has(0x622, 2) ? json_get(0x622, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt2_power   = round( (json_has(0x652, 2) ? json_get(0x652, 2) : 0) * 1.00, 0 ),
				solar_c2_mppt3_voltage = round( (json_has(0x613, 2) ? json_get(0x613, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt3_current = round( (json_has(0x623, 2) ? json_get(0x623, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt3_power   = round( (json_has(0x653, 2) ? json_get(0x653, 2) : 0) * 1.00, 0 ),
				solar_c2_mppt4_voltage = round( (json_has(0x614, 2) ? json_get(0x614, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt4_current = round( (json_has(0x624, 2) ? json_get(0x624, 2) : 0) * 0.01, 1 ),
				solar_c2_mppt4_power   = round( (json_has(0x654, 2) ? json_get(0x654, 2) : 0) * 1.00, 0 ),
				solar_power_total      = round( (json_has(0x662, 0) ? json_get(0x662, 0) : 0) * 1.00, 0 );
			
			
			
			
			
			
			
			
			
			
			/*
				Update Battery
			*/
			
			$("#battery .power").html(json_has(0x461) ? Math.abs(battery_power_total) + " W" : "-");
			
			$("#modal_battery .nav").show();
			if(!battery_minus) $("#modal_battery .nav").hide();
			
			$("#battery_minus .voltage  .value").html(json_has(0x411) ? battery_minus_voltage  + " V" : "-");
			$("#battery_minus .current  .value").html(json_has(0x421) ? battery_minus_current  + " A" : "-");
			$("#battery_minus .capacity .value").html(json_has(0x431) ? battery_minus_capacity + " %" : "-");
			$("#battery_plus  .voltage  .value").html(json_has(0x412) ? battery_plus_voltage   + " V" : "-");
			$("#battery_plus  .current  .value").html(json_has(0x422) ? battery_plus_current   + " A" : "-");
			$("#battery_plus  .capacity .value").html(json_has(0x432) ? battery_plus_capacity  + " %" : "-");
			
			$('.arrow-line.battery').removeClass('hide');
			if(battery_power_total == 0) $('.arrow-line.battery').addClass('hide');
			$('.arrow-line.battery .arrow').removeClass('arrow-up arrow-down').addClass(battery_power_total < 0 ? 'arrow-down' : 'arrow-up');
			
			
			
			
			
			/*
				Update House
			*/
			
			$("#house .power").html(json_has(0xB61, 2) ? Math.max(house_power_total, 0) + " W" : "-");
			
			$("#modal_house .power1, #modal_house .power2, #modal_house .power3").show();
			if(!house_L1) $("#modal_house .power1").hide();
			if(!house_L2) $("#modal_house .power2").hide();
			if(!house_L3) $("#modal_house .power3").hide();
			
			$("#modal_house .power1 .value").html(json_has(0xB51, 2) ? Math.max(house_L1_power, 0) + " W" : "-");
			$("#modal_house .power2 .value").html(json_has(0xB52, 2) ? Math.max(house_L2_power, 0) + " W" : "-");
			$("#modal_house .power3 .value").html(json_has(0xB53, 2) ? Math.max(house_L3_power, 0) + " W" : "-");
			
			$('.arrow-line.house-emeter').removeClass('hide');
			if(house_power_total == 0) $('.arrow-line.house-emeter').addClass('hide');
			
			
			
			
			
			/*
				Update Load
			*/
			
			$("#load .power").html(json_has(0x511) ? Math.abs(load_power_total) + " W" : "-");
			
			$("#modal_load .nav").show();
			if(!load_L2 && !load_L3) $("#modal_load .nav").hide();
			
			$("#load_1 .voltage .value").html(json_has(0x511) ? load_L1_voltage + " V" : "-");
			$("#load_1 .power   .value").html(json_has(0x551) ? load_L1_power   + " W" : "-");
			$("#load_2 .voltage .value").html(json_has(0x512) ? load_L2_voltage + " V" : "-");
			$("#load_2 .power   .value").html(json_has(0x552) ? load_L2_power   + " W" : "-");
			$("#load_3 .voltage .value").html(json_has(0x513) ? load_L3_voltage + " V" : "-");
			$("#load_3 .power   .value").html(json_has(0x553) ? load_L3_power   + " W" : "-");
			
			$('.arrow-line.load').removeClass('hide');
			if(load_power_total == 0) $('.arrow-line.load').addClass('hide');
			
			
			
			
			
			/*
				Update External Solar
			*/
			
			$("#extsol .power").html(json_has(0xB61, 3) ? Math.max(-1 * extsol_power_total, 0) + " W" : "-");
			
			$("#modal_extsol .power1, #modal_extsol .power2, #modal_extsol .power3").show();
			if(!extsol_L1) $("#modal_extsol .power1").hide();
			if(!extsol_L2) $("#modal_extsol .power2").hide();
			if(!extsol_L3) $("#modal_extsol .power3").hide();
			
			$("#modal_extsol .power1 .value").html(json_has(0xB51, 3) ? Math.max(extsol_L1_power * -1, 0) + " W" : "-");
			$("#modal_extsol .power2 .value").html(json_has(0xB52, 3) ? Math.max(extsol_L2_power * -1, 0) + " W" : "-");
			$("#modal_extsol .power3 .value").html(json_has(0xB53, 3) ? Math.max(extsol_L3_power * -1, 0) + " W" : "-");
			
			
			
			
			
			/*
				Update Grid + Emeter
			*/
			
			if(!emeter_L && !emeter_L1 && !emeter_L2 && !emeter_L3)
			{
				$("#grid .power").html(json_has(0x161) ? grid_power_total + " W" : "-");

				$("#modal_grid .nav").show();
				if(!grid_L2 && !grid_L3) $("#modal_grid .nav").hide();
				
				$("#grid_1 .voltage .value").html(json_has(0x111) ? grid_L1_voltage + " V" : "-");
				$("#grid_1 .power   .value").html(json_has(0x151) ? grid_L1_power   + " W" : "-");
				$("#grid_2 .voltage .value").html(json_has(0x112) ? grid_L2_voltage + " V" : "-");
				$("#grid_2 .power   .value").html(json_has(0x152) ? grid_L2_power   + " W" : "-");
				$("#grid_3 .voltage .value").html(json_has(0x113) ? grid_L3_voltage + " V" : "-");
				$("#grid_3 .power   .value").html(json_has(0x153) ? grid_L3_power   + " W" : "-");

				$('.arrow-line.grid, .arrow-line.grid .arrow').removeClass('hide');
				if(grid_power_total == 0) $('.arrow-line.grid').addClass('hide');
				$('.arrow-line.grid .arrow').removeClass('arrow-up arrow-down').addClass(grid_power_total < 0 ? 'arrow-down' : 'arrow-up');
			}
			else
			{
				$("#grid .power").html(json_has(0xB61, 0) ? emeter_power_total + " W" : "-");
				
				$("#modal_grid .nav").show();
				if(!emeter_L2 && !emeter_L3) $("#modal_grid .nav").hide();

				$("#grid_1 .voltage .value").html(json_has(0xB11, 0) ? emeter_L1_voltage + " V" : "-");
				$("#grid_1 .power   .value").html(json_has(0xB51, 0) ? emeter_L1_power   + " W" : "-");
				$("#grid_2 .voltage .value").html(json_has(0xB12, 0) ? emeter_L2_voltage + " V" : "-");
				$("#grid_2 .power   .value").html(json_has(0xB52, 0) ? emeter_L2_power   + " W" : "-");
				$("#grid_3 .voltage .value").html(json_has(0xB13, 0) ? emeter_L3_voltage + " V" : "-");
				$("#grid_3 .power   .value").html(json_has(0xB53, 0) ? emeter_L3_power   + " W" : "-");

				// Device-Grid Arrow
				$('.arrow-line.grid, .arrow-line.grid .arrow').removeClass('hide arrow-up arrow-down');
				if( (grid_L1_power >= 0 && grid_L2_power >= 0 && grid_L3_power >= 0) && (grid_L1_power > 0 || grid_L2_power > 0 || grid_L3_power > 0) )
					$('.arrow-line.grid .arrow').addClass('arrow-up');
				else if( (grid_L1_power <= 0 && grid_L2_power <= 0 && grid_L3_power <= 0) && (emeter_L1_power >= 0 && emeter_L2_power >= 0 && emeter_L3_power >= 0) )
					$('.arrow-line.grid').addClass('hide');
				else if( (grid_L1_power <= 0 && grid_L2_power <= 0 && grid_L3_power <= 0 ) && (grid_L1_power < 0 || grid_L2_power < 0 || grid_L3_power < 0) && (emeter_L1_power < 0 || emeter_L2_power < 0 || emeter_L3_power < 0) )
					$('.arrow-line.grid .arrow').addClass('arrow-down');
				else if( (grid_L1_power < 0 || grid_L2_power < 0 || grid_L3_power < 0) && (emeter_L1_power < 0 || emeter_L2_power < 0 || emeter_L3_power < 0) )
					$('.arrow-line.grid .arrow').addClass('hide');
				else
					$('.arrow-line.grid').addClass('hide');
				
				// House-Device Arrow
				$('.arrow-line.house-device').removeClass('hide');
				if(house_power_total <= 0 || grid_power_total >= 0)
					$('.arrow-line.house-device').addClass('hide');
				
				// House-Emeter Arrow
				$('.arrow-line.house-emeter').removeClass('hide');
				if(house_power_total <= 0 || emeter_power_total <= 0)
					$('.arrow-line.house-emeter').addClass('hide');
			}
			
			
			
			
			
			/*
				Update Solar
			*/
			
			let solar_controllerNum = 0;
			if(solar_c1) solar_controllerNum++;
			if(solar_c2) solar_controllerNum++;
			
			let solar_c1_mpptNum = 0;
			if(solar_c1_mppt1) solar_c1_mpptNum++;
			if(solar_c1_mppt2) solar_c1_mpptNum++;
			if(solar_c1_mppt3) solar_c1_mpptNum++;
			if(solar_c1_mppt4) solar_c1_mpptNum++;
			
			let solar_c2_mpptNum = 0;
			if(solar_c2_mppt1) solar_c2_mpptNum++;
			if(solar_c2_mppt2) solar_c2_mpptNum++;
			if(solar_c2_mppt3) solar_c2_mpptNum++;
			if(solar_c2_mppt4) solar_c2_mpptNum++;
			
			$("#solar .power").html(json_has(0x662, 0) ? solar_power_total + " W" : "-");
			
			$("#modal_solar .controller-nav, #modal_solar h6").show();
			if(solar_controllerNum == 1) $("#modal_solar .controller-nav, #modal_solar h6").hide();
			
			$("#controller_1 .mppt-4, #controller_1 .mppt-3, #controller_1 .mppt-nav, #controller_1 h6").show();
			if(solar_c1_mpptNum < 4) $("#controller_1 .mppt-4").hide();
			if(solar_c1_mpptNum < 3) $("#controller_1 .mppt-3").hide();
			if(solar_c1_mpptNum < 2) $("#controller_1 .mppt-nav, #controller_1 h6").hide();
			
			$("#controller_2 .mppt-4, #controller_2 .mppt-3, #controller_2 .mppt-nav, #controller_2 h6").show();
			if(solar_c2_mpptNum < 4) $("#controller_2 .mppt-4").hide();
			if(solar_c2_mpptNum < 3) $("#controller_2 .mppt-3").hide();
			if(solar_c2_mpptNum < 2) $("#controller_2 .mppt-nav, #controller_2 h6").hide();
			
			$("#c1_mppt1 .voltage .value").html(json_has(0x611, 1) ? solar_c1_mppt1_voltage + " V" : "-");
			$("#c1_mppt1 .current .value").html(json_has(0x621, 1) ? solar_c1_mppt1_current + " A" : "-");
			$("#c1_mppt1 .power   .value").html(json_has(0x651, 1) ? solar_c1_mppt1_power   + " W" : "-");
			$("#c1_mppt2 .voltage .value").html(json_has(0x612, 1) ? solar_c1_mppt2_voltage + " V" : "-");
			$("#c1_mppt2 .current .value").html(json_has(0x622, 1) ? solar_c1_mppt2_current + " A" : "-");
			$("#c1_mppt2 .power   .value").html(json_has(0x652, 1) ? solar_c1_mppt2_power   + " W" : "-");
			$("#c1_mppt3 .voltage .value").html(json_has(0x613, 1) ? solar_c1_mppt3_voltage + " V" : "-");
			$("#c1_mppt3 .current .value").html(json_has(0x623, 1) ? solar_c1_mppt3_current + " A" : "-");
			$("#c1_mppt3 .power   .value").html(json_has(0x653, 1) ? solar_c1_mppt3_power   + " W" : "-");
			$("#c1_mppt4 .voltage .value").html(json_has(0x614, 1) ? solar_c1_mppt4_voltage + " V" : "-");
			$("#c1_mppt4 .current .value").html(json_has(0x624, 1) ? solar_c1_mppt4_current + " A" : "-");
			$("#c1_mppt4 .power   .value").html(json_has(0x654, 1) ? solar_c1_mppt4_power   + " W" : "-");
			
			$("#c2_mppt1 .voltage .value").html(json_has(0x611, 2) ? solar_c2_mppt1_voltage + " V" : "-");
			$("#c2_mppt1 .current .value").html(json_has(0x621, 2) ? solar_c2_mppt1_current + " A" : "-");
			$("#c2_mppt1 .power   .value").html(json_has(0x651, 2) ? solar_c2_mppt1_power   + " W" : "-");
			$("#c2_mppt2 .voltage .value").html(json_has(0x612, 2) ? solar_c2_mppt2_voltage + " V" : "-");
			$("#c2_mppt2 .current .value").html(json_has(0x622, 2) ? solar_c2_mppt2_current + " A" : "-");
			$("#c2_mppt2 .power   .value").html(json_has(0x652, 2) ? solar_c2_mppt2_power   + " W" : "-");
			$("#c2_mppt3 .voltage .value").html(json_has(0x613, 2) ? solar_c2_mppt3_voltage + " V" : "-");
			$("#c2_mppt3 .current .value").html(json_has(0x623, 2) ? solar_c2_mppt3_current + " A" : "-");
			$("#c2_mppt3 .power   .value").html(json_has(0x653, 2) ? solar_c2_mppt3_power   + " W" : "-");
			$("#c2_mppt4 .voltage .value").html(json_has(0x614, 2) ? solar_c2_mppt4_voltage + " V" : "-");
			$("#c2_mppt4 .current .value").html(json_has(0x624, 2) ? solar_c2_mppt4_current + " A" : "-");
			$("#c2_mppt4 .power   .value").html(json_has(0x654, 2) ? solar_c2_mppt4_power   + " W" : "-");
			
			$('.arrow-line.solar').removeClass('hide');
			if(solar_power_total == 0) $('.arrow-line.solar').addClass('hide');
			
			
			
			
			
			
			
			
			
			
			// Update Autarky Progress-Bar
			
			let gridPower    = (emeter_L) ? emeter_power_total : grid_power_total,
				loadPower    = load_power_total + house_power_total,
				batteryPower = battery_power_total;
			
			if(gridPower <= 0) bar.animate(1); else bar.animate(Math.max(1 - gridPower / (loadPower + Math.max(batteryPower, 0)), 0));
			
			
			
			
			
			
			
			
			
			
			// Update System Status
			
			let devicePFC   = '-';
			let deviceBoost = '-';
			let deviceECO   = '-';
			let temp        = null;
			
			temp = json_has(0x6001) ? parseInt(json_get(0x6001)) : null;
			if(temp == 0) devicePFC   = lang['off'].toUpperCase(); else if(temp == 1) devicePFC   = lang['on'].toUpperCase();
			temp = json_has(0x6002) ? parseInt(json_get(0x6002)) : null;
			if(temp == 0) deviceBoost = lang['off'].toUpperCase(); else if(temp == 1) deviceBoost = lang['on'].toUpperCase();
			temp = json_has(0x6003) ? parseInt(json_get(0x6003)) : null;
			if(temp == 0) deviceECO   = lang['off'].toUpperCase(); else if(temp >= 1) deviceECO   = lang['on'].toUpperCase() + " " + temp;
			
			$('#modal_device .pfc   .value').html(devicePFC);
			$('#modal_device .boost .value').html(deviceBoost);
			$('#modal_device .eco   .value').html(deviceECO);
			
			
			
			
			
			
			
			
			
			
		}
	});
	
}










// Round Number to X decimal places (in order to avoid 230.70000000000002)
function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

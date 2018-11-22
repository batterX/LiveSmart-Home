/*
	WARNING_ID: [
		TITLE,
		DESCRIPTION,
		TYPE (0=Warning 1=Fault)
	]
*/

var warningsList = {
	
	"0": [
		"",
		"",
		0
	],
	
	"16640": [
		"AC Input Loss",
		"AC input disconnected",
		0
	],
	"16641": [
		"AC Input Island",
		"AC input has been detected for the island",
		0
	],
	"16642": [
		"AC Input Phase Dislocation",
		"AC input three phase dislocation",
		0
	],
	"16643": [
		"AC Input Wave Loss",
		"AC Input Wave Loss",
		0
	],
	"16644": [
		"AC Input Ground Loss",
		"AC Input Ground Loss",
		1
	],
	"16657": [
		"AC Input Voltage Loss",
		"The AC input voltage is out of range",
		0
	],
	"16658": [
		"AC Input Voltage High Loss",
		"The AC input voltage has exceed the highest limit",
		0
	],
	"16659": [
		"AC Input Voltage Low Loss",
		"The AC input voltage has exceed the lowest limit",
		0
	],
	"16660": [
		"AC Input Average Voltage Over",
		"The average AC input voltage has exceed the upper limit",
		0
	],
	"16738": [
		"AC Input Frequency Loss",
		"The AC input frequency is out of range",
		0
	],
	"16739": [
		"AC Input Frequency High Loss",
		"The AC input frequency has exceed the highest limit",
		0
	],
	"16740": [
		"AC Input Frequency Low Loss",
		"The AC input frequency has exceed the lowest limit",
		0
	],

	"17152": [
		"BUS Soft Start Timeout",
		"BUS Soft Start Timeout",
		1
	],
	"17169": [
		"BUS Over Voltage",
		"BUS Over Voltage",
		1
	],
	"17170": [
		"Bus Under Voltage",
		"Bus Under Voltage",
		1
	],

	"17408": [
		"Battery Open",
		"Battery disconnected",
		1
	],
	"17425": [
		"Battery Voltage Too High",
		"Battery voltage exceed the highest level",
		1
	],
	"17426": [
		"Battery Low",
		"Battery voltage is too low",
		0
	],
	"17441": [
		"Battery Weak",
		"Battery weak for starting the generator",
		0
	],
	"17442": [
		"Battery Discharge Low",
		"Low voltage from over discharging",
		0
	],
	"17443": [
		"Battery Low in Hybrid Mode",
		"Battery voltage drop to unacceptable level of hybrid mode",
		0
	],
	"17444": [
		"Battery Over Charge",
		"Battery Over Charge",
		1
	],
	"17457": [
		"Battert Over Current",
		"Battert Over Current",
		1
	],

	"17665": [
		"AC Output Short",
		"AC Output Short",
		1
	],
	"17682": [
		"AC Output Voltage High Loss",
		"The AC output voltage has exceed the highest limit",
		1
	],
	"17683": [
		"AC Output Voltage Low Loss",
		"The AC output voltage has exceed the lowest limit",
		1
	],
	"17761": [
		"AC Output Over Load",
		"AC Output Over Load",
		1
	],

	"17920": [
		"PV Loss",
		"No input on PV",
		0
	],
	"17921": [
		"PV Input 1 loss",
		"PV input 1 disconnected",
		0
	],
	"17922": [
		"PV Input 2 loss",
		"PV input 2 disconnected",
		0
	],
	"17929": [
		"PV Input Short",
		"PV Input Short",
		1
	],
	"17937": [
		"PV Voltage Too High",
		"PV voltage exceed the highest level",
		1
	],
	"17938": [
		"PV Voltage Too Low",
		"PV voltage exceed the lowest level",
		0
	],
	"17953": [
		"PV Input 1 Voltage Too High",
		"PV input 1 voltage exceed the highest level",
		0
	],
	"17954": [
		"PV Input 2 Voltage Too High",
		"PV input 2 voltage exceed the highest level",
		0
	],
	"17969": [
		"PV Over Current",
		"PV Over Current",
		1
	],
	"18017": [
		"PV Input Power Abnormal",
		"PV Input Power Abnormal",
		0
	],
	"18065": [
		"PV Insulation Fault",
		"PV Insulation Fault",
		1
	],

	"18176": [
		"Inverter Soft Start Timeout",
		"Inverter Soft Start Timeout",
		1
	],
	"18177": [
		"Inverter Relay Fault",
		"Inverter Relay Fault",
		1
	],
	"18225": [
		"Inverter Current Too High",
		"Inverter Current Too High",
		1
	],
	"18226": [
		"Inverter Over Current For Long Time",
		"Inverter Over Current For Long Time",
		1
	],

	"18689": [
		"Over Temperature",
		"Over Temperature",
		1
	],
	"18690": [
		"Control Board Wiring Error",
		"Control Board Wiring Error",
		1
	],
	"18691": [
		"External Flash Fail",
		"External Flash Fail",
		0
	],
	"18692": [
		"Initial Fail",
		"Initialization failed in CPU",
		0
	],
	"18693": [
		"Fan Stop",
		"Problem found in Fan module",
		1
	],
	"18694": [
		"EPO Active",
		"Emergent power off active",
		0
	],
	"18696": [
		"DC Current Sensor Fail",
		"DC Current Sensor Fail",
		1
	],
	"18697": [
		"Power Down",
		"Power Down",
		1
	],
	"18704": [
		"Leakage current too high",
		"Leakage current too high",
		1
	],
	"18705": [
		"Leakage current sensor fault",
		"Leakage current sensor fault",
		1
	],
	"18706": [
		"Line value consistent fail between MCU & DSP",
		"The AC input voltage or frequency has been detected different between master CPU and slave CPU",
		1
	],
	"18707": [
		"Connect fail between MCU & DSP",
		"Communicate data discordant between master CPU and slave CPU",
		1
	],
	"18708": [
		"Communication fail between MCU & DSP",
		"Communication loss between master CPU and slave CPU",
		1
	],
	"18709": [
		"Current Sensor Fault",
		"Current Sensor Fault",
		1
	],
	"18710": [
		"Discharge Fail",
		"Discharge Fail",
		1
	],
	"18711": [
		"Discharge Soft Time Out",
		"Discharge Soft Time Out",
		1
	],
	"18712": [
		"SPS Power Voltage Abnormal",
		"SPS Power Voltage Abnormal",
		1
	],
	"18713": [
		"AC Circuit Voltage Sample Error",
		"AC Circuit Voltage Sample Error",
		1
	],

	"18928": [
		"Energy Meter Not Working",
		"Energy Meter Not Working",
		0
	],
	
}

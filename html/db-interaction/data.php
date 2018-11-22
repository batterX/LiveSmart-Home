<?php

include_once "../inc/class.data.inc.php";

if(!empty($_POST['action']))
{
	$dataObj = new BatterXData();
	
	switch($_POST['action'])
	{
		case 'getDeviceInfo':
			echo $dataObj->getDeviceInfo();
			break;
		case 'setDeviceInfo':
			echo $dataObj->setDeviceInfo();
			break;
			
		case 'getDeviceModel':
			echo $dataObj->getDeviceModel();
			break;
		
		case 'getCurrentState':
			echo $dataObj->getCurrentState();
			break;
		case 'getEnergyData':
			echo $dataObj->getEnergyData();
			break;
		case 'getPowerData':
			echo $dataObj->getPowerData();
			break;
		case 'getWarningsData':
			echo $dataObj->getWarningsData();
			break;
			
		case 'getCollectedData':
			echo $dataObj->getCollectedData();
			break;
		case 'getCollectedData_compare':
			echo $dataObj->getCollectedData_compare();
			break;
			
		case 'getPinConfig':
			echo $dataObj->getPinConfig();
			break;
		
		default:
			echo "";
			break;
	}
}
else
{
	echo "";
	exit;
}

?>
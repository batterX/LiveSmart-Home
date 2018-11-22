<?php

include_once "../inc/class.files.inc.php";

if(!empty($_POST['action']))
{
	$filesObj = new BatterXFiles();
	
	switch($_POST['action'])
	{
		case 'getDeviceImages':
			echo $filesObj->getDeviceImages();
			break;
		case 'removeDeviceImage':
			echo $filesObj->removeDeviceImage();
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
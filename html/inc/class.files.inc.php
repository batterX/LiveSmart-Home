<?php

/*
	Handles pulling device filenames from MySql database
	
	* getDeviceImage()
	* removeDeviceImage()
	
	@author Ivan Gavrilov
*/

class BatterXFiles
{
	public function __construct($db=NULL) {}
	
	/*
		Queries Filenames from Device_Images Table using 'deviceid'
		
		Outputs JSON Array
		['imageid.format', ...]
	*/
	public function getDeviceImages() 
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		$result = $db->query('SELECT `filename` FROM `device_images`');

		$array = $result->fetchAll(PDO::FETCH_COLUMN, 0);
		
		return json_encode($array);
	}
	
	/*
		Removes Selected Image from Database
	*/
	public function removeDeviceImage()
	{
		if(isset($_POST['filename']))
		{
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			$temp = explode(".", $_POST['filename']);
			$imageid = $temp[0];
			
			$sql = "DELETE FROM `device_images` WHERE `imageid`='" . $imageid . "' LIMIT 1";
			
			try {
				$stmt = $db->prepare($sql);
				$stmt->execute();
				$stmt->closeCursor();
				return "Image has been succesfully removed";
			} catch(Exception $e) {
				return $e->getMessage();
			}
		}
		
		return "Error! Please try again";
	}
	
}
<?php

/*
	Handles pulling device data from SQLite database
	
	* getDeviceInfo()
	* setDeviceInfo()
	* getDeviceModel()
	* getCurrentState()
	* getEnergyData()
	* getPowerData()
	* getWarningsData()
	
	@author Ivan Gavrilov
*/

class BatterXData
{
	public function __construct() {}
	
	/*
		Queries Data from Device_Info Table
		
		Outputs JSON Object
		
		{
			setting: value,
			...
		}
	*/
	public function getDeviceInfo() 
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
				
		$result = $db->query('SELECT `setting`, `value` FROM `device_info`');

		$dbh = new stdClass();

		foreach($result as $row) {
			$setting = (string) $row['setting'];
			$value = (string) $row['value'];
			
			$dbh->$setting = $value;
		}
		
		return json_encode($dbh, JSON_FORCE_OBJECT);
	}
	
	public function setDeviceInfo()
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		$sql = "REPLACE INTO `device_info` (`value`, `setting`) VALUES ('" . $_POST['value'] . "', '" . $_POST['setting'] . "')";
		
		try {
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if($stmt->rowCount() == 1)
				return TRUE;
			$stmt->closeCursor();
		} catch(PDOException $e) {}
		
		return FALSE;
	}
	
	public function getDeviceModel()
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		$result = $db->query('SELECT `value` FROM `device_info` WHERE `setting`="device_model"');
		
		return $result->fetchColumn();
	}
	
	/*
		Queries Data from CurrentState Table
		
		Outputs JSON Object
		
		{
			logtime: LOGTIME,
			TYPE: {
				ENTITY: VALUE,
				...
			},
			...
		}
	*/
	public function getCurrentState() 
	{
		$db = new PDO('sqlite:/srv/bx/ram/currentD.db3');
		
		$result = $db->query('SELECT type, entity, entityvalue, logtime FROM CurrentState', PDO::FETCH_ASSOC);

		$dbh = new stdClass();

		foreach($result as $row) {
			$type = (string) $row['type'];
			$entity = (string) $row['entity'];
			if(!isset($dbh->$type)) 
				$dbh->$type = new stdClass();
			$dbh->$type->$entity = intval($row['entityvalue']);
			$dbh->logtime = (string) $row['logtime'];
		}
		
		return json_encode($dbh, JSON_FORCE_OBJECT);
	}
	
	/*
		Queries Data from EnergyData Table
		
		Outputs JSON Array
		
		1, 2, 3, 4, 5, 6, 7, 8, 9, ...
	*/
	public function getEnergyData()
	{
		if(isset($_POST['type']) && isset($_POST['entity'])) {
			// Create Array With IDs (Keys)
			$keys = explode(",", $_POST["type"]);
			// Create Array Full with Zeros (Values)
			$values = array_fill(0, count($keys), 0);
			
			// Build the Array [type: entityvalue, type: entityvalue, ...]
			$resultArray = array_combine($keys, $values);
			
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			// Build SQL String
			$sql = "SELECT type, entityvalue FROM EnergyData WHERE entity=" . $_POST['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
			
			// Fetch All Rows That Exist
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$resultArray[$row["type"]] = $row["entityvalue"];
			}
			
			return implode(',', $resultArray);
		}
		else
			return "0";
	}
	
	/*
		Queries Data from PowerData Table
		
		Outputs JSON Array
		
		1, 2, 3, 4, 5, 6, 7, 8, 9, ...
	*/
	public function getPowerData()
	{
		if(isset($_POST['type']) && isset($_POST['entity'])) {
			// Create Array With IDs (Keys)
			$keys = explode(",", $_POST["type"]);
			// Create Array Full with Zeros (Values)
			$values = array_fill(0, count($keys), 0);
			
			// Build the Array [type: entityvalue, type: entityvalue, ...]
			$resultArray = array_combine($keys, $values);
			
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			// Build SQL String
			$sql = "SELECT type, entityvalue FROM PowerData WHERE entity=" . $_POST['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
			
			// Fetch All Rows That Exist
			$result = $db->query($sql);
			
			foreach($result as $row) {
				$resultArray[$row["type"]] = $row["entityvalue"];
			}
			
			return implode(',', $resultArray);
		}
		else
			return "0";
	}

	/*
		Queries Data from WarningsData Table using 'deviceid'
		
		Outputs JSON Object
	
		[
			{
				id: ...,
				type: ...,
				entity: ...,
				value: ...,
				logtime: ...
			}, 
			...
		]
	*/
	public function getWarningsData() 
	{
		if (isset($_POST['count'])) {
			// Connect to Database
			$db = new PDO('sqlite:/srv/bx/usv.db3');
			
			$result = $db->query("SELECT * FROM (SELECT id, type, entity, entityvalue, logtime FROM WarningsData ORDER BY id DESC LIMIT " . $_POST['count']. ") ORDER BY id ASC", PDO::FETCH_ASSOC);

			$dbh = array();
			
			foreach($result as $r)
				$dbh[] = $r;
			
			return json_encode($dbh);
		}
		else
			return "";
	}
	
}

?>
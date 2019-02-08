<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// GET CurrentState

if(isset($_GET['get']) && strtolower($_GET['get']) == 'currentstate') {
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/ram/currentD.db3');
	
	// Returns the value with the selected type and entity
	// ?get=currentstate&type=273&entity=1
	if(isset($_GET['type']) && isset($_GET['entity'])) {
		$result = $db->query('SELECT entityvalue FROM CurrentState WHERE type=' . $_GET['type'] . ' AND entity=' . $_GET['entity'] . ' LIMIT 1');
		$res = $result->fetchColumn();
		echo strval($res);
	}
	
	// Returns the full CurrentState table
	// ?get=currentstate
	else {
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
		header('Content-Type: application/json');
		echo json_encode($dbh, JSON_FORCE_OBJECT);
	}
	
}

// GET EnergyData

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'energydata') {
	
	if(isset($_GET['entity']))
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		// Returns the Total Energy (since first day) in Wh for selected entity
		// ?get=energydata&entity=10
		if(!isset($_GET['type'])) 
		{
			$result = $db->query('SELECT IFNULL(SUM(entityvalue), 0) FROM EnergyData WHERE entity=' . $_GET['entity']);
			$res = $result->fetchColumn();
			echo strval($res);
		} 
		else 
		{
			// Create Array With IDs (Keys)
			$keys = explode(",", $_GET["type"]);
			
			// Returns the Energy in Wh for selected day/s with entity
			// ?get=energydata&entity=10&type=20180128,20180129
			if(strlen($keys[0]) == 8) {
				$values = array_fill(0, count($keys), 0);
				$resultArray = array_combine($keys, $values);
				$sql = "SELECT type, entityvalue FROM EnergyData WHERE entity=" . $_GET['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
				$result = $db->query($sql);
				foreach($result as $row) { $resultArray[$row["type"]] = $row["entityvalue"]; }
				echo implode(',', $resultArray);
			}
			// Returns the Energy in Wh for selected month/s with entity
			// ?get=energydata&entity=10&type=201801,201802
			else if(strlen($keys[0]) == 6) {
				$resultStr = "";
				foreach($keys as $key) {
					$result = $db->query('SELECT IFNULL(SUM(entityvalue), 0) FROM EnergyData WHERE entity=' . $_GET['entity'] . ' AND type>' . $key . '00 AND type<' . $key . '99');
					$res = $result->fetchColumn();
					if(strlen($resultStr) == 0) $resultStr .= $res;
					else $resultStr .= "," . $res;
				}
				echo strval($resultStr);
			}
			// Returns the Energy in Wh for selected year/s with entity
			// ?get=energydata&entity=10&type=2017,2018
			else if(strlen($keys[0]) == 4) {
				$resultStr = "";
				foreach($keys as $key) {
					$result = $db->query('SELECT IFNULL(SUM(entityvalue), 0) FROM EnergyData WHERE entity=' . $_GET['entity'] . ' AND type>' . $key . '0000 AND type<' . $key . '9999');
					$res = $result->fetchColumn();
					if(strlen($resultStr) == 0) $resultStr .= $res;
					else $resultStr .= "," . $res;
				}
				echo strval($resultStr);
			}
		}
	}
	else echo "0";
	
}

// GET PowerData

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'powerdata') {
	
	// Returns String with power data for each 15 min. for selected day/s with entity
	// ?get=powerdata&entity=10&type=20180121,20180122
	if(isset($_GET['type']) && isset($_GET['entity'])) 
	{
		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		// Create Array With IDs (Keys)
		$keys = explode(",", $_GET["type"]);
		
		// Create Array Full with Zeros (Values)
		$values = array_fill(0, count($keys), 0);
		
		// Build the Array -> array(type=>entityvalue, type=>entityvalue, ...)
		$resultArray = array_combine($keys, $values);
		
		// Build SQL String
		$sql = "SELECT type, entityvalue FROM PowerData WHERE entity=" . $_GET['entity'] . " AND type IN(" . implode(',', $keys) . ") LIMIT " . count($keys);
		
		// Fetch All Rows That Exist
		$result = $db->query($sql);
		
		foreach($result as $row) { $resultArray[$row["type"]] = $row["entityvalue"]; }
		
		echo implode(',', $resultArray);
	}
	else echo "0";
	
}

// GET WarningsData

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'warningsdata') {
	
	// Returns JSON Object with the latest X entries from the Warnings Table
	// ?get=warningsdata&count=5
	
	// Get Count
	$count = "1";
	if(isset($_GET['count'])) $count = $_GET['count'];
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/usv.db3');
	
	$result = $db->query("SELECT * FROM (SELECT id, type, entity, entityvalue, logtime FROM WarningsData ORDER BY id DESC LIMIT " . $count . ") ORDER BY id ASC", PDO::FETCH_ASSOC);
	
	$dbh = array();
	foreach($result as $r) { $dbh[] = $r; }
	
	header('Content-Type: application/json');
	echo json_encode($dbh);
	
	
}

// GET Settings

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'settings') {
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/usv.db3');
	
	// Returns the full Settings table
	// ?get=settings
	$result = $db->query('SELECT VarName, entity, Name, InUse, Mode, V1, V2, V3, V4, V5, V6, S1, S2, UpDateTime FROM Settings', PDO::FETCH_ASSOC);
	$dbh = new stdClass();
	foreach($result as $row) {
		$VarName = (string) $row['VarName'];
		$entity = (string) $row['entity'];
		if(!isset($dbh->$VarName)) 
			$dbh->$VarName = new stdClass();
		$dbh->$VarName->$entity = $row;
	}
	
	header('Content-Type: application/json');
	echo json_encode($dbh, JSON_FORCE_OBJECT);
	
}

// GET DeviceInfo

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'deviceinfo') {
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/usv.db3');
	
	// Returns the full Settings table
	// ?get=deviceinfo
	$result = $db->query("SELECT setting, value FROM DeviceInfo", PDO::FETCH_ASSOC);
	$dbh = new stdClass();
	foreach($result as $row) {
		$setting = (string) $row['setting'];
		$value = (string) $row['value'];
		$dbh->$setting = $value;
	}
	
	header('Content-Type: application/json');
	echo json_encode($dbh, JSON_FORCE_OBJECT);
	
}

// SET Command

else if(isset($_GET['set']) && strtolower($_GET['set']) == 'command') {
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	
	// Build Command
	$type = ""; $entity = "0"; $text1 = ""; $text2 = "";
	if(isset($_GET['type']))   $type   = $_GET['type'];
	if(isset($_GET['entity'])) $entity = $_GET['entity'];
	if(isset($_GET['text1']))  $text1  = $_GET['text1'];
	if(isset($_GET['text2']))  $text2  = $_GET['text2'];
	
	// Send Command to Database
	if($type != "" && $entity != "") {
		$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(".$type.", ".$entity.", '".$text1."', '".$text2."')";
		try {
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if($stmt->rowCount() == 1) echo '1';
			$stmt->closeCursor();
		} catch(PDOException $e) {}
	}
	
}

// SET Commands

// NOT POSSIBLE YET
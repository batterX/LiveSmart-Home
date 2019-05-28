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

// GET WarningsData

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'warningsdata') {
	
	// Returns JSON Object with the latest X entries from the Warnings Table
	// ?get=warningsdata&count=5
	
	// Get Count
	$count = "1";
	if(isset($_GET['count'])) $count = $_GET['count'];
	
	// Connect to Database
	$db = new PDO('sqlite:/srv/bx/usv.db3');
	
	$result = $db->query("SELECT * FROM (SELECT id, value, logtime FROM WarningsData ORDER BY id DESC LIMIT " . $count . ") ORDER BY id ASC", PDO::FETCH_ASSOC);
	
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

// GET History

else if(isset($_GET['get']) && strtolower($_GET['get']) == 'historydata') {

	if(isset($_GET['from']) && isset($_GET['to']) && strlen($_GET['from']) == 8 && strlen($_GET['to']) == 8)
	{
		$from = substr($_GET['from'], 0, 4) . '-' . substr($_GET['from'], 4, 2) . '-' . substr($_GET['from'], 6, 2);
		$to   = substr($_GET['to'  ], 0, 4) . '-' . substr($_GET['to'  ], 4, 2) . '-' . substr($_GET['to'  ], 6, 2);

		// Connect to Database
		$db = new PDO('sqlite:/srv/bx/usv.db3');
		
		// Returns HistoryData for Selected Range
		// ?get=historydata&from=YYYYMMDD&to=YYYYMMDD
		$result = $db->query('SELECT * FROM History WHERE logtime > "' . $from . ' 00:00:00" AND logtime < "' . $to . ' 23:59:59"', PDO::FETCH_ASSOC);
		$arr = (array) [];
		foreach($result as $row) {
			$arr[] = [
				$row['logtime'],
				$row['battery_voltage_minus'],
				$row['battery_voltage_plus'],
				$row['battery_level_minus'],
				$row['battery_level_plus'],
				$row['battery_power_from'],
				$row['battery_power_to'],
				$row['input_power_from'],
				$row['input_power_to'],
				$row['grid_power_from'],
				$row['grid_power_to'],
				$row['load_power'],
				$row['house_power'],
				$row['solar_power'],
				$row['extsol_power']
			];
		}
		
		header('Content-Type: application/json');
		echo json_encode($arr);
	}

}
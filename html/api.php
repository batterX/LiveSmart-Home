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

// SET Multiple Commands

// NOT POSSIBLE YET
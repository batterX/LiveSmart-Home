<?php

// SWITCHES

if(isset($_POST['switch1'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['switch1'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '1', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['switch2'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['switch2'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '2', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['switch3'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['switch3'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '3', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['switch4'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['switch4'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20736, 0, '4', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
}

// OUTPUTS

else if(isset($_POST['output1'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['output1'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20737, 0, '1', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['output2'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['output2'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20737, 0, '2', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['output3'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['output3'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20737, 0, '3', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['output4'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['output4'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20737, 0, '4', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
}

// COMMANDS

else if(isset($_POST['command1'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['command1'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20738, 0, '1', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['command2'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['command2'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20738, 0, '2', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['command3'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['command3'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20738, 0, '3', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
} 
else if(isset($_POST['command4'])) 
{
	$db = new PDO('sqlite:/srv/bx/ram/currentC.db3');
	$state = $_POST['command4'];
	$sql = "INSERT INTO `CommandsIn` (`type`, `entity`, `text1`, `text2`) VALUES(20738, 0, '4', '" . $state . "')";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		if($stmt->rowCount() == 1) echo TRUE;
		$stmt->closeCursor();
	} catch(PDOException $e) {}
}
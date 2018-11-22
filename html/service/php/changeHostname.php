<?php
	if(isset($_GET['hostname']) && $_GET['hostname'] != "") {
		exec("sudo sed -i '1 s/^.*$/" . $_GET['hostname'] . "/' /etc/hostname");
		exec("sudo sed -i 's/.*127.0.1.1.*/127.0.1.1 " . $_GET['hostname'] . "/' /etc/hosts");
		$output = "";
		exec("sudo cat /etc/hostname", $output);
		echo json_encode($output);
	}
?>
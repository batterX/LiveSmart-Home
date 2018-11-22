<?php

// Create a database object
$db = new PDO('sqlite:/srv/bx/usv.db3');



// Checks if file is selected
if(isset($_FILES["file"]["type"]))
{
	$validextensions = array("jpeg", "jpg", "png");
	$temporary = explode(".", $_FILES["file"]["name"]);
	$file_extension = end($temporary);
	
	// Needed Fields For MySQL Logging
	$imageid = uniqid();
	$format = $file_extension;
	$filename = $imageid . "." . $format;
	
	// Checks if file format and size are correct
	if((($_FILES["file"]["type"] == "image/png") || ($_FILES["file"]["type"] == "image/jpg") || ($_FILES["file"]["type"] == "image/jpeg")) && 
	   in_array($file_extension, $validextensions) && ($_FILES["file"]["size"] < 2000000) /* Approx. 2MB files can be uploaded */ ) 
	{
		// Checks if there are some errors
		if($_FILES["file"]["error"] > 0) {
			echo "Error! Return Code: " . $_FILES["file"]["error"];
		} else {
			// Checks if file already exists (existance not possible, but better to check than not)
			if(file_exists("../uploads/" . $imageid . "." . $format)) {
				echo "File with the same name already exists. Please try again.";
			} else {
				// Store sourcePath and create targetPath
				$sourcePath = $_FILES['file']['tmp_name'];
				$targetPath = "../uploads/" . $imageid . "." . $format;
				$target_dir = "../uploads/";

				// Checks if target directory exists / is writable
				if(is_dir($target_dir) && is_writable($target_dir)) 
				{
					// Move uploaded file to target path
					move_uploaded_file($sourcePath, $targetPath);
					
					// Insert New User Into Database
					$sql = "INSERT INTO `device_images` (`imageid`, `format`, `filename`) 
							VALUES (:imageid, :format, :filename)";
					
					try {
						$stmt = $db->prepare($sql);
						$stmt->bindParam(":imageid", $imageid, PDO::PARAM_STR);
						$stmt->bindParam(":format", $format, PDO::PARAM_STR);
						$stmt->bindParam(":filename", $filename, PDO::PARAM_STR);
						$stmt->execute();
						if($stmt->rowCount() == 1)
							echo "Image Uploaded Successfully";
						$stmt->closeCursor();
					} catch(PDOException $e) {}
				} 
				else 
				{
					// Echo errors
					if(is_dir($target_dir))
						echo 'Upload directory is not writable -> ' . $target_dir;
					else
						echo 'Upload directory does not exist -> ' . $target_dir;
				}
			}
		}
	}
	else
	{
		echo "*** Invalid file Size or Type ***";
	}
}
else
{
	echo "File not Selected";
}

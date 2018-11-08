<?php

$id = time();
$eventName = $_POST["eventName"];
$price = $_POST["eventPrice"];
$eventTickets = $_POST["eventTickets"];
$description = $_POST["eventDescription"];
$creatorID = 404;

$target_dir = "uploads/";
$target_file = $target_dir . "$id".".jpg";
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}

// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT * FROM events WHERE eventName = '$eventName';");

move_uploaded_file($_FILES["fileUpload"]["tmp_name"],$path.$_FILES["fileUpload"]["name"]);

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        try {
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "INSERT INTO events (ID, eventName, eventPrice, eventTickets, eventDescription, imageSrc, creatorID)
            VALUES ($id, '$eventName', '$price', $eventTickets, '$description', '$target_file', $creatorID)";
            // use exec() because no results are returned
            $conn->exec($sql);
            header("Location: http://intranet-secure.de/TicketCorner");
        }
        catch(PDOException $e)
        {
            echo $sql . "<br>" . $e->getMessage();
        }


    }
    else{
        echo "Not_ok" ;
    }
}
else{
    echo "Error2";
}
$conn = null;





?>
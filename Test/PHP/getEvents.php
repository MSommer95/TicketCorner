<?php

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT eventName, imageSrc  FROM events WHERE 1");

$events = array();

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    echo "Error";
}

echo json_encode($result);

$conn = null;
?>

<?php

$ID = $_POST["ID"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT ID, eventName, eventDate, eventPrice, eventDescription, imageSrc, eventTickets, maxEventTickets  FROM events WHERE ID = $ID ORDER BY ID DESC");

$events = array();

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    echo "Error";
}

echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>
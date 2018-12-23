<?php
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$userId = $_POST["userId"];
$eventId = $_POST["eventId"];

//Select Statement zum Fetchen aller Events
$stmt = $conn->prepare("SELECT events.ID FROM users_events INNER JOIN events ON events.ID = users_events.eventId WHERE users_events.userId = $userId AND users_events.eventId = $eventId");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    header("Location: https://intranet-secure.de/TicketCorner/index.html?Message=SQLError");
}
//Echoed die gefechten Events als JSON encoded String
echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>
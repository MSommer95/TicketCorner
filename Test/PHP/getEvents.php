<?php
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

//Select Statement zum Fetchen aller Events
$stmt = $conn->prepare("SELECT ID, eventName, eventDate, eventTickets, maxEventTickets, eventDescription, eventPrice, eventLocation, imageSrc  FROM events WHERE 1 ORDER BY ID DESC");

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


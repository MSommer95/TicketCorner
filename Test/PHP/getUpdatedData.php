<?php
//Initialisierung der übergebenen $_POST Werte
$ID = $_POST["ID"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Select Statement zum Fetchen der Ticketanzahl des spezifischen Events
$stmt = $conn->prepare("SELECT eventTickets FROM events WHERE ID = $ID");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html?Message=SQLError");
}
//Echoed die gefetchte Ticketanzahl als JSON encoded String
echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>


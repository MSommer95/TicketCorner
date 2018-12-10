<?php
//Initialisierung der übergebenen $_POST Werte
$postID = $_POST["postID"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Select Statement zum Fetchen des Ratings für das spezifische Event
$stmt = $conn->prepare("SELECT userID, oneStar, twoStars, threeStars, fourStars, fiveStars  FROM ratings WHERE eventID = $postID");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html?Message=SQLError");
}
//Echoed das gefetchte Rating als JSON encoded String
echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>


<?php
//Initialisierung der übergebenen $_POST Werte
$postID = $_POST["postID"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Select Statement zum Fetchen der Kommentare, für ein spezifisches Event
$stmt = $conn->prepare("SELECT userName, datetime, message  FROM comments WHERE postID = $postID ORDER BY ID DESC");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
}

else{
    echo "Error";
}
//Echoed die Kommentare, als JSON encoded String
echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>


<?php
//Initialisierung der übergebenen $_POST Werte
$postID = $_POST["postID"];
$commentID = $_POST["commentID"];
$userID = $_POST["userID"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Select Statement zum Fetchen der Kommentare, für ein spezifisches Event
$stmt = $conn->prepare("SELECT * FROM comments WHERE postID = $postID AND ID = $commentID AND userID = $userID");
$deleteStmt = $conn->prepare("DELETE FROM comments WHERE postID = $postID AND ID = $commentID AND userID = $userID");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        header("Location: https://intranet-secure.de/TicketCorner/Events/html/$postID.html?Message=NoComment");
    }
    else {
        $deleteStmt ->execute();
    }
}

else{
    header("Location: https://intranet-secure.de/TicketCorner/Events/html/$postID.html?Message=SQLError");
}
//Echoed die Kommentare, als JSON encoded String
echo json_encode($result, JSON_UNESCAPED_SLASHES);

$conn = null;
?>


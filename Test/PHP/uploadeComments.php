<?php
//Initialisierung der übergebenen $_POST Werte
$userID = $_POST["userID"];
$userName = $_POST["userName"];
$postID = $_POST["postID"];
$date = date('Y-m-d H:i:s');
$message = $_POST["message"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

//Select Statement zum Fetchen des Users
$stmt = $conn->prepare("SELECT * FROM users WHERE ID = $userID");
if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        try {
        // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "INSERT INTO comments ( userID, userName ,postID, dateTime, message )
          VALUES ($userID,'$userName',$postID, '$date', '$message')";
            // use exec() because no results are returned
            $conn->exec($sql);
            echo "Fine";
        } catch(PDOException $e)
        {
            echo $sql . "<br>" . $e->getMessage();
        }
    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/Events/html/$postID.html?Message=WrongUser");
    }
} else {
    header("Location: https://intranet-secure.de/TicketCorner/Events/html/$postID.html?Message=SQLError");
}


?>
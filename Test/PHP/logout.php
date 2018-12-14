<?php
//Initialisierung der übergebenen $_POST Werte
$userID = $_POST["ID"];
$forename = $_POST["forename"];
$surname = $_POST["surname"];
$email = $_POST["email"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Prepare Logout Statement (Kontrolliert, ob der User existiert und aktualisiert den Login Status
$stmt = $conn->prepare("SELECT * FROM users WHERE ID = $userID AND forename = '$forename' AND surname = '$surname' AND email = '$email'");
$prepareLogout = $conn->prepare("UPDATE  users SET loggedIn = loggedIn - 1 WHERE email= '$email';");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        $prepareLogout->execute();
        header("Location: https://intranet-secure.de/TicketCorner/index.html?Message=loggedOut");
    }
    else{
        header ("Location: https://intranet-secure.de/TicketCorner?Message=UserDoesntExist");
    }
}

else{
    header ("Location: https://intranet-secure.de/TicketCorner?Message=SQLError");
}
$conn = null;
?>


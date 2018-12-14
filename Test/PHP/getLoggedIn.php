<?php
//Initialisierung der übergebenen $_POST Werte
$email = $_POST["email"];

//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$getLoggedIn = $conn->prepare("SELECT loggedIn FROM users WHERE email= '$email';");

if($getLoggedIn->execute()){
    $result=$getLoggedIn->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        header("Location: https://intranet-secure.de/TicketCorner/signIn.html?Message=UserDoesntExist");
    }
    else {
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $loggedIn = $value;
            }
        }

    }
}
else{
    header("Location: https://intranet-secure.de/TicketCorner/signIn.html?Message=SQLError");
}
echo json_encode($loggedIn, JSON_UNESCAPED_SLASHES);
$conn = null;

?>
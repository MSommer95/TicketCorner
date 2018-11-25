<?php
$userID = $_POST["ID"];
$forename = $_POST["forename"];
$surname = $_POST["surname"];
$email = $_POST["email"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT * FROM users WHERE ID = $userID AND forename = '$forename' AND surname = '$surname' AND email = '$email'");
$prepareLogout = $conn->prepare("UPDATE  users SET loggedIn = 0 WHERE email= '$email';");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        $prepareLogout->execute();
        header("Location: https://intranet-secure.de/TicketCorner/");
    }
}

else{
    echo "Error";
}
$conn = null;
?>


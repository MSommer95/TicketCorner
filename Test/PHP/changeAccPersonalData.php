<?php
$changeForename = $_POST["change-forename"];
$changeSurname = $_POST["change-surname"];
$changeEmail = $_POST["change-email"];

$forename = $_POST["forename"];
$surname = $_POST["surname"];
$email = $_POST["email"];
$ID = $_POST["ID"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestPermissionToChange= $conn->prepare("SELECT * FROM users WHERE ID = $ID AND forename = '$forename' AND surname = '$surname' AND email = '$email';");

if($requestPermissionToChange->execute()){
    $result=$requestPermissionToChange->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        $updateAccount = "UPDATE users SET forename = '$changeForename', surname = '$changeSurname', email='$changeEmail' WHERE ID=$ID";
        $conn->exec($updateAccount);

        setrawcookie("forename", $changeForename, time() + (86400*30), "/");
        setrawcookie("surname", $changeSurname, time() + (86400*30), "/");
        setrawcookie("email", $changeEmail, time() + (86400*30), "/");

        header("Location: http://intranet-secure.de/TicketCorner/accountManagement.html=?OK");
    }
    else{
        header("Location: http://intranet-secure.de/TicketCorner/accountManagement.html=?NOTOK");
    }
}
$conn = null;
?>
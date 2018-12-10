<?php
//PHP Script um die Änderungen eines Passwortes durchzuführen
//Initialisierung der übergebenen $_POST Werte + Server Variablen
$changePassword = $_POST["change-password"];
$oldPassword = $_POST["oldPassword"];

$forename = $_POST["forename"];
$surname = $_POST["surname"];
$email = $_POST["email"];
$ID = $_POST["ID"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

//Start der Connection für die Datenbank + Preparation für das kontrollierende Select Statement
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestPermissionToChange= $conn->prepare("SELECT password FROM users WHERE ID = $ID AND forename = '$forename' AND surname = '$surname' AND email = '$email' AND loggedIn = 1;");

if($requestPermissionToChange->execute()){
    $result=$requestPermissionToChange->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnHash = $value;
            }
        }
        //If Statement checked das eingegebene Passwort gegen und Updated das neue Passwort in die Datenbank
        if(crypt($oldPassword, $returnHash) == $returnHash) {
            $newPW = password_hash($changePassword, PASSWORD_BCRYPT);
            $updateAccount = "UPDATE users SET password = '$newPW' WHERE ID=$ID";
            $conn->exec($updateAccount);
            header("Location: https://intranet-secure.de/TicketCorner/index.html?Message=pwChanged");
        }
        else {
            header("Location: https://intranet-secure.de/TicketCorner/accountManagement.html?Message=NoPwGiven");
        }
    }
    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/accountManagement.html?Message=SQLError");
}
$conn = null;
?>
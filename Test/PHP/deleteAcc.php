<?php
//PHP Script um die Änderungen eines Passwortes durchzuführen
//Initialisierung der übergebenen $_POST Werte + Server Variablen
$confirmePassword = $_POST["confirm-delete"];

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
$requestPermissionToDelete= $conn->prepare("SELECT password FROM users WHERE ID = $ID AND forename = '$forename' AND surname = '$surname' AND email = '$email';");

if($requestPermissionToDelete->execute()){
    $result=$requestPermissionToDelete->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnHash = $value;
            }
        }
        //If Statement checked das eingegebene Passwort gegen und Updated das neue Passwort in die Datenbank
        if(crypt($confirmePassword, $returnHash) == $returnHash) {
            $deleteAcc = $conn -> prepare("DELETE FROM users WHERE ID = $ID AND forename = '$forename' AND surname = '$surname' AND email = '$email';");
            $deleteAcc->execute();
            echo "accountDeleted";
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
<?php
//Initialisierung der übergebenen $_POST Werte
$email = $_POST["email"];
$userPassword = $_POST["password"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
/*Prepared 3 SQL Querys: VarifyAcc = kontrolliert, ob der User existiert und welchen Login Status er zur Zeit hat
prepareLogin = Update Statement zum updaten des Login Status
getUserData zum Fetchen der User Daten
*/
$varifyAcc = $conn->prepare("SELECT email,password FROM users WHERE email= '$email';");
$prepareLogin = $conn->prepare("UPDATE  users SET loggedIn = loggedIn + 1 WHERE email= '$email';");
$getUserData = $conn ->prepare("SELECT ID, forename, surname, email, creatorStatus FROM users WHERE email = '$email';");



if($varifyAcc->execute()){
    $result=$varifyAcc->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        header("Location: https://intranet-secure.de/TicketCorner/signIn.html?Message=WrongLoginData");
    }
    else {
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnHash = $value;
            }
        }
        if(crypt($userPassword, $returnHash) == $returnHash) {
            $getUserData->execute();
            $userdata = $getUserData->fetchAll(PDO::FETCH_ASSOC);
            foreach ($userdata as $row){
                foreach ($row as $key => $value){
                    $data = $data.":".$value;
                }
            }
            //Split die gefetchten User Daten und speichert sie als cookies
            $splitData = explode(":", $data);
            setcookie("ID", $splitData[1], time() + (3600*100)*10, "/");
            setrawcookie("forename", $splitData[2], time() + (3600*100)*10, "/");
            setrawcookie("surname", $splitData[3], time() + (3600*100)*10, "/");
            setrawcookie("email", $splitData[4], time() + (3600*100)*10, "/");
            setcookie("creatorStatus", $splitData[5], time() + (3600*100)*10, "/");
            $prepareLogin->execute();
            header("Location: https://intranet-secure.de/TicketCorner/");


        }
        else{
            header("Location: https://intranet-secure.de/TicketCorner/signIn.html?Message=WrongLoginData");
        }
    }
}
else{
    header("Location: https://intranet-secure.de/TicketCorner/signIn.html?Message=WrongLoginData");
}
$conn = null;
?>


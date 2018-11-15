<?php
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

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestPermissionToChange= $conn->prepare("SELECT password FROM users WHERE ID = $ID AND forename = '$forename' AND surname = '$surname' AND email = '$email';");

if($requestPermissionToChange->execute()){
    $result=$requestPermissionToChange->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnHash = $value;
            }
        }
        if(crypt($oldPassword, $returnHash) == $returnHash) {
            $newPW = password_hash($changePassword, PASSWORD_BCRYPT);
            $updateAccount = "UPDATE users SET password = '$newPW' WHERE ID=$ID";
            $conn->exec($updateAccount);
            header("Location: https://intranet-secure.de/TicketCorner");
        }
        else {
            echo "noPasswordGiven";
        }
    }
    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/accountManagement.html=?NOTOK");
}
$conn = null;
?>
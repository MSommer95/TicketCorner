<?php

$email = $_POST["email"];
$passwort = $_POST["passwort"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$varifyAcc = $conn->prepare("SELECT Email,Passwort FROM users WHERE Email= '$email';");

if($varifyAcc->execute()){
    $result=$varifyAcc->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        echo "UserNotCreated";
    }
    else {
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnHash = $value;
            }
        }
        if(crypt($passwort, $returnHash) == $returnHash) {
            echo "valid";


        }
        else{
            echo "not valid";
        }
    }
}
else{
    echo "Error";
}

$conn = null;
?>

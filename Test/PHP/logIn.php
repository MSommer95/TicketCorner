<?php
$email = $_POST["email"];
$userPassword = $_POST["password"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$varifyAcc = $conn->prepare("SELECT email,password FROM users WHERE email= '$email' AND loggedIn = 0;");
$prepareLogin = $conn->prepare("UPDATE  users SET loggedIn = 1 WHERE email= '$email';");
$getUserData = $conn ->prepare("SELECT ID, forename, surname, email, creatorStatus FROM users WHERE email = '$email';");

if($varifyAcc->execute()){
    $result=$varifyAcc->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
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

            $splitData = explode(":", $data);
            setcookie("ID", $splitData[1], time() + (86400*30), "/");
            setrawcookie("forename", $splitData[2], time() + (86400*30), "/");
            setrawcookie("surname", $splitData[3], time() + (86400*30), "/");
            setrawcookie("email", $splitData[4], time() + (86400*30), "/");
            setcookie("creatorStatus", $splitData[5], time() + (86400*30), "/");
            session_start();
            header("Location: http://intranet-secure.de/TicketCorner/");
        }
        else{
            echo $userPassword.":".$returnHash;
        }
    }
}
else{
    echo "Error";
}
$conn = null;
?>

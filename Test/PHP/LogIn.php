<?php

$email = $_POST["email"];
$passwort = $_POST["passwort"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$varifyAcc = $conn->prepare("SELECT Email,Passwort FROM users WHERE Email= '$email' AND LoggedIn = 0;");
$prepareLogin = $conn->prepare("UPDATE  users SET LoggedIn = 1 WHERE Email= '$email';");
$getUserData = $conn ->prepare("SELECT ID, Vorname, Nachname, Email FROM users WHERE Email = '$email';");

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

        if(crypt($passwort, $returnHash) == $returnHash) {



            $getUserData->execute();
            $userdata = $getUserData->fetchAll(PDO::FETCH_ASSOC);

            foreach ($userdata as $row){
                foreach ($row as $key => $value){
                    $data = $data.":".$value;
                }
            }

            $splitData = explode(":", $data);
            setcookie("ID", $splitData[1], time() + (86400*30), "/");
            setcookie("Vorname", $splitData[2], time() + (86400*30), "/");
            setcookie("Nachname", $splitData[3], time() + (86400*30), "/");
            setcookie("Email", $splitData[4], time() + (86400*30), "/");
            session_start();



            header("Location: http://intranet-secure.de/TicketCorner/");

           // echo $_SESSION['user'];
           // echo json_encode($userdata);
            //echo "valid";
        }
        else{
            echo $passwort.":".$returnHash;
        }

    }
}
else{
    echo "Error";
}
$conn = null;
?>

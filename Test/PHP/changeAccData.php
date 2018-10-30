<?php

$email = $_POST["email"];
$vorname = $_POST["vorname"];
$nachname = $_POST["nachname"];
$passwort = $_POST["passwort"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";


$salt = '$2a$12$Da346dCSf35dsc$';

if (CRYPT_BLOWFISH == 1)
{
    $hashedPW = crypt($passwort, '$2a$09$anexamplestringforsalt$');
}
else
{
    echo "Blowfish DES not supported.\n<br>";
}

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestStory= $conn->prepare("SELECT * FROM users WHERE Email = '$email';");

if($requestStory->execute()){
    $result=$requestStory->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        $updateAccount = "UPDATE users SET Vorname = '$vorname', Nachname = '$nachname', Email='$email', Passwort='$hashedPW' WHERE Email='$email'";
        $conn->exec($updateAccount);
        echo "Updated User.";
    }
    else{
            echo "NoUser";
    }
}
$conn = null;

?>
<?php

$id = time();
$vorname = $_POST["vorname"];
$nachname = $_POST["nachname"];
$email = $_POST["email"];
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

$stmt = $conn->prepare("SELECT * FROM users WHERE Email = '$email';");

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        try {
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "INSERT INTO users (ID, Vorname, Nachname, Email, Passwort)
            VALUES ($id, '$vorname', '$nachname', '$email', '$hashedPW')";
            // use exec() because no results are returned
            $conn->exec($sql);
            header("Location: http://intranet-secure.de/TicketCorner/signIn");
        }
        catch(PDOException $e)
        {
            echo $sql . "<br>" . $e->getMessage();
        }

        $conn = null;
    }
    else{
        echo "Not_ok" ;
    }
}
else{
    echo "Error2";
}
?>
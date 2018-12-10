<?php
//Initialisierung der übergebenen $_POST Werte
$id = time();
$forename = $_POST["forename"];
$surname = $_POST["surname"];
$email = $_POST["email"];
$userPassword = $_POST["password"];
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";
//Hashed das Passwort durch den Blowfish Algorithmus
$hashedPW = password_hash($userPassword, PASSWORD_BCRYPT);

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Kontrolliert, ob die eingegebene Emailadresse bereits vergeben ist
$stmt = $conn->prepare("SELECT * FROM users WHERE email = '$email';");

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        try {
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //Legt einen neuen User in der Datenbank an
            $sql = "INSERT INTO users (ID, forename, surname, email, password)
            VALUES ($id, '$forename', '$surname', '$email', '$hashedPW')";
            // use exec() because no results are returned
            $conn->exec($sql);
            header("Location: https://intranet-secure.de/TicketCorner/signIn");
        }
        catch(PDOException $e)
        {
            echo $sql . "<br>" . $e->getMessage();
        }

        $conn = null;
    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/registration.html?Message=UserAlreadyExists");
    }
}
else{
    header("Location: https://intranet-secure.de/TicketCorner/registration.html?Message=SQLError");
}
?>
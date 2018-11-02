<?php

$id = time();
$name = $_POST["name"];
$preis = $_POST["preis"];
$tickets = $_POST["ticekts"];
$beschreibung = $_POST["beschreibung"];
$picture = $_POST["path"];
$creatorID = x;

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT * FROM events WHERE EventName = '$name';");

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        try {
            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "INSERT INTO events (ID, EventName, Preis, AnzahlTickets, Beschreibung, Bildpfad, ErstellerID)
            VALUES ($id, '$name', '$preis', '$tickets', '$beschreibung', '$picture', $creatorID)";
            // use exec() because no results are returned
            $conn->exec($sql);
            header("Location: http://intranet-secure.de/TicketCorner");
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
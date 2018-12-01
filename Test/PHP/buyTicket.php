<?php
//PHP Script um den Ticketkauf durchzuführen
//Initialisierung der übergebenen $_POST Werte + Server Variablen
$ID = $_POST["ID"];
$eventName = $_POST["eventName"];
$eventPrice = $_POST["eventPrice"];
$eventDescription = $_POST["eventDescription"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

//Start der Connection für die Datenbank + Preparation für das kontrollierende Select Statement
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestToBuyTicket= $conn->prepare("SELECT eventTickets FROM events WHERE ID = $ID AND  eventName = '$eventName' AND eventPrice = '$eventPrice' AND eventDescription = '$eventDescription';");

if($requestToBuyTicket->execute()){
    //Fetched mögliche Ergebnisse aus der Datenbank -> Kontrolliert, ob das Event existiert
    $result=$requestToBuyTicket->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnTicket = $value;
            }
        }
        //If Statement überprüft, ob noch Tickets verfügbar sind
        if($returnTicket >=1){
            //Updated die Ticketanzahl in der Datenbank
            $returnTicket -= 1;
            $updateTickets = "UPDATE events SET eventTickets = $returnTicket WHERE ID=$ID";
            $conn->exec($updateTickets);
            header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html?Message=OK");
        } else {

            header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html?Message=NoMoreTickets");
        }


    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html?Message=NOTOK");
    }
}
$conn = null;
?>

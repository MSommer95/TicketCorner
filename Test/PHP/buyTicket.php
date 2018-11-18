<?php
$ID = $_POST["ID"];
$eventName = $_POST["eventName"];
$eventPrice = $_POST["eventPrice"];
$eventDescription = $_POST["eventDescription"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
$requestToBuyTicket= $conn->prepare("SELECT eventTickets FROM events WHERE ID = $ID AND  eventName = '$eventName' AND eventPrice = '$eventPrice' AND eventDescription = '$eventDescription';");

if($requestToBuyTicket->execute()){
    $result=$requestToBuyTicket->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        foreach ($result as $row){
            foreach ($row as $key => $value){
                $returnTicket = $value;
            }
        }
        if($returnTicket >=1){
            $returnTicket -= 1;
            $updateTickets = "UPDATE events SET eventTickets = $returnTicket WHERE ID=$ID";
            $conn->exec($updateTickets);
            header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html=?OK");
        } else {

            header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html=?NoMoreTickets");
        }


    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/Events/html/$ID.html=?NOTOK");
    }
}
$conn = null;
?>

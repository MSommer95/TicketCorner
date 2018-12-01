<?php
//Initialisierung der übergebenen $_POST Werte
$postID = $_POST["postID"];
$userID = $_POST["userID"];
$rating = $_POST["rating"];
//Initialisiert die Bewertungsvariablen
$oneStar = 0;
$twoStars = 0;
$threeStars = 0;
$fourStars = 0;
$fiveStars = 0;

switch ($rating){
    case "oneStar":
        $oneStar = 1;
        break;
    case "twoStars":
        $twoStars = 1;
        break;
    case "threeStars":
        $threeStars = 1;
        break;
    case "fourStars":
        $fourStars = 1;
        break;
    case "fiveStars":
        $fiveStars = 1;
        break;
}
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";


$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

//Select Statement zum Fetchen des Users
$stmt = $conn->prepare("SELECT * FROM users WHERE ID = $userID");
//Kontrolliert, ob der User schonmal eine Bewertung abgegeben hat
$controllStmt = $conn->prepare("SELECT * FROM ratings WHERE eventID = $postID AND userID = $userID ;");

if($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)>0){
        if ($controllStmt->execute()) {
            $result = $controllStmt->fetchAll(PDO::FETCH_ASSOC);
            try {
                if (count($result) == 0) {
                    // set the PDO error mode to exception
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    //Insert neuen Eintrag in die Rating Tabelle der Datenbank
                    $sql = "INSERT INTO ratings ( eventID, userID , oneStar, twoStars, threeStars, fourStars, fiveStars )
          VALUES ($postID, $userID, $oneStar, $twoStars, $threeStars, $fourStars, $fiveStars)";
                    // use exec() because no results are returned
                    $conn->exec($sql);
                    header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html?Message=RatingAbgegeben");
                }
                else {
                    //Updated das Rating des Events, falls der User schonmal eine Bewertung abgegeben hat
                    $updateRating = "UPDATE ratings SET oneStar = $oneStar, twoStars = $twoStars, threeStars = $threeStars, fourStars = $fourStars, fiveStars = $fiveStars WHERE eventID=$postID AND userID = $userID";
                    $conn->exec($updateRating);
                    header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html?Message=Changed");
                }

            }
            catch(PDOException $e)
            {
                echo $sql . "<br>" . $e->getMessage();
            }
        }
    }
    else{
        header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html?Message=UserDoesntExist");
    }

} else {
    header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html?Message=Error");
}


?>



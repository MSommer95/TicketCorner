<?php

$postID = $_POST["postID"];
$userID = $_POST["userID"];
$rating = $_POST["rating"];

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

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";


$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$controllStmt = $conn->prepare("SELECT * FROM ratings WHERE eventID = $postID AND userID = $userID ;");

if ($controllStmt->execute()) {
    $result = $controllStmt->fetchAll(PDO::FETCH_ASSOC);
    try {
        if (count($result) == 0) {


            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql = "INSERT INTO ratings ( eventID, userID , oneStar, twoStars, threeStars, fourStars, fiveStars )
          VALUES ($postID, $userID, $oneStar, $twoStars, $threeStars, $fourStars, $fiveStars)";
            // use exec() because no results are returned
            $conn->exec($sql);
            header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html");


        }
        else {

                $updateRating = "UPDATE ratings SET oneStar = $oneStar, twoStars = $twoStars, threeStars = $threeStars, fourStars = $fourStars, fiveStars = $fiveStars WHERE eventID=$postID AND userID = $userID";
                $conn->exec($updateRating);
                header("Location: https://intranet-secure.de/TicketCorner/Events/html/" . $postID . ".html=?Changed");


            }

    }
    catch(PDOException $e)
    {
            echo $sql . "<br>" . $e->getMessage();
    }

}
?>



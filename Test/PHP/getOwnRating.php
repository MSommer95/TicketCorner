<?php
$postID = $_POST["postID"];
$userID = $_POST["userID"];

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$getOwnRating = $conn->prepare("SELECT oneStar, twoStars, threeStars, fourStars, fiveStars  FROM ratings WHERE eventID = $postID AND userID = $userID");

if($getOwnRating->execute()){
    $resultOwn = $getOwnRating->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode($resultOwn, JSON_UNESCAPED_SLASHES);

$conn = null;
?>


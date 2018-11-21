<?php
$id = time();
$eventName = $_POST["eventName"];
$price = $_POST["eventPrice"];
$eventTickets = $_POST["eventTickets"];
$description = $_POST["eventDescription"];
$date = $_POST["eventDate"];
$creatorID = $_POST["ID"];

$target_dir = "../Events/img/";
$target_file = $target_dir . "$id".".jpg";
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}

// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 5000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}

function createHTML($id, $eventName, $date, $target_file, $price, $eventTickets, $description){
    $newHTML = fopen("../Events/html/"."$id".".html", "w") or die ("Unable to create.");
    $htmlData =
        "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>$eventName</title>
    <link rel=\"stylesheet\" href=\"https://intranet-secure.de/TicketCorner/css\bootstrap.css\">
    <link rel=\"stylesheet\" href=\"https://intranet-secure.de/TicketCorner/css\styles.css\">
    <link rel=\"icon\" href=\"https://intranet-secure.de/TicketCorner/icons/favicon.ico\" type=image/x-icon\">
</head>
<body>
<div class=\"slider\">
    <div class=\"load\">
    </div>
</div>
<nav class=\"navbar navbar-expand-lg navbar-light bg-light\" id=\"navbarIndex\">
    <a class=\"navbar-brand\">TicketCorner</a>
    <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">
        <span class=\"navbar-toggler-icon\"></span>
    </button>
    <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">
        <ul class=\"navbar-nav mr-auto\">
            <li class=\"nav-item\">
                <a class=\"nav-link\" href=\"https://intranet-secure.de/TicketCorner/index.html\">Home</a>
            </li>
            <li class=\"nav-item\">
                <a class=\"nav-link\" href=\"https://intranet-secure.de/TicketCorner/contact.html\">Kontakt</a>
            </li>
            <li class=\"nav-item dropdown loggedOutAcc\" id=\"loggedOutAcc\" >
                <a class=\"nav-link dropdown-toggle\" href=\"#\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                    Account
                </a>
                <div class=\"dropdown-menu\"  aria-labelledby=\"navbarDropdown\" >
                    <a class=\"dropdown-item\"   href=\"https://intranet-secure.de/TicketCorner/signIn.html\">Anmelden</a>
                    <div class=\"dropdown-divider\"></div>
                    <a class=\"dropdown-item\" href=\"https://intranet-secure.de/TicketCorner/registration.html\">Registrieren</a>
                </div>
            </li>
            <li class=\"nav-item dropdown loggedInAcc\" id=\"loggedInAcc\" >
                <a class=\"nav-link dropdown-toggle\" href=\"#\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">
                    Account
                </a>
                <div class=\"dropdown-menu\"  aria-labelledby=\"navbarDropdown\">
                    <a class=\"dropdown-item\"   href=\"https://intranet-secure.de/TicketCorner/accountManagement.html\">Einstellungen</a>
                    <div class=\"dropdown-divider\"></div>
                    <a class=\"dropdown-item\" href=\"#\" onclick=\"logout()\">Abmelden</a>
                </div>
            </li>
            <li class=\"nav-item loggedInAcc\">
                <a class=\"nav-link\" href=\"https://intranet-secure.de/TicketCorner/create.html\">Event erstellen</a>
            </li>
        </ul>
    </div>
</nav>
<div class=\"maintext\" id=\"maintext\">
    <p id='eventName'>Name: $eventName</p>
    <img src=\"https://intranet-secure.de/TicketCorner/PHP/$target_file\" id='eventImg'>
    <p id='eventDate'>Datum: $date</p>
    <p id='eventPrice'>Preis: $price</p>
    <p id='eventTickets'>Anzahl der Tickets: $eventTickets</p>
    <p id='eventDescription'>Beschreibung: $description</p>
    <button name=\"submit\" type=\"submit\" class=\"btn btn-primary\" onclick='getEventById(\"$id\")'>Ticket bestellen</button>
    <div class=\"dropdown-divider\"></div>
    <div class=\"Comments\">
        <form id=\"commentForm\" method=\"post\" role=\"form\" action=\"https://intranet-secure.de/TicketCorner/PHP/uploadeComments.php\">
            <div>
                <label for=\"comment-section\">Comment Section</label>
                <textarea id=\"comment-section\" name=\"comment-section\" rows=\"5\" cols=\"100\" maxlength=\"234\"></textarea>
            </div>
            <input type=\"submit\" value=\"Post Comment\" onclick=\"sendCommentForm()\"/>
        </form>
    </div>
</div>

<script src=\"https://code.jquery.com/jquery-3.3.1.slim.min.js\" integrity=\"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo\" crossorigin=\"anonymous\"></script>
<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js\" integrity=\"sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49\" crossorigin=\"anonymous\"></script>
<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\" integrity=\"sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy\" crossorigin=\"anonymous\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/indexJS.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/loginCheck.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/eventUpdater.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/buyTicket.js\"></script>
</body>
</html>";

    fwrite($newHTML,$htmlData);
    fclose($newHTML);
}

$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

$stmt = $conn->prepare("SELECT * FROM events WHERE eventName = '$eventName';");
$controllStmt = $conn->prepare("SELECT * FROM users WHERE ID = $creatorID AND creatorStatus = 1 ;");

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        if($controllStmt->execute()){
            $controllResult = $controllStmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($controllResult)>0){
                try {
                    // set the PDO error mode to exception
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $sql = "INSERT INTO events (ID, eventName, eventPrice, eventTickets, eventDescription, eventDate, imageSrc, creatorID)
                             VALUES ($id, '$eventName', '$price', $eventTickets, '$description', '$date', '$target_file', $creatorID)";
                    // use exec() because no results are returned
                    $conn->exec($sql);
                    // Check if $uploadOk is set to 0 by an error
                    if ($uploadOk == 0) {
                        echo "Sorry, your file was not uploaded.";
                        // if everything is ok, try to upload file
                    } else {
                        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                            //echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
                        } else {
                            echo "Sorry, there was an error uploading your file.";
                        }
                    }
                    move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $_FILES["fileUpload"]["name"]);
                    createHTML($id, $eventName, $date, $target_file, $price, $eventTickets, $description);

                    $protocol='http';
                    if (isset($_SERVER['HTTPS']))
                        if (strtoupper($_SERVER['HTTPS'])=='ON')
                            $protocol='https';

                    header("location: $protocol://intranet-secure.de/TicketCorner/Events/html/".$id.".html");



                }
                catch(PDOException $e)
                {
                    echo $sql . "<br>" . $e->getMessage();
                }
            }
        }
    }
    else {
        echo "Not_ok" ;
    }
}
else{
    echo "Error2";
}
$conn = null;
?>
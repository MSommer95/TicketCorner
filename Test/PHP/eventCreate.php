<?php
//PHP Script um die Änderungen eines Passwortes durchzuführen
//Initialisierung der übergebenen $_POST Werte
$id = time();
$eventName = $_POST["eventName"];
$price = $_POST["eventPrice"];
$eventTickets = $_POST["eventTickets"];
$description = $_POST["eventDescription"];
$date = $_POST["eventDate"];
$location = $_POST["eventLocation"];
$creatorID = $_POST["ID"];

//Initialisiert den Dateipfad für das Image des Events
$target_dir = "../Events/img/";
$target_file = $target_dir . "$id".".jpg";
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

//Checked, ob die gesendete Datei wirklich ein Image ist
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

//Checked, ob das Bild schon existiert
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
//Checked, ob die Größe des Bildes nicht zu groß ist
if ($_FILES["fileToUpload"]["size"] > 50000000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
//Erlaubt gewisse Bildformate
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}
//Funktion zum Erstellen des HTML Dokumentes für das zu erstellende Event und gibt diesem Werte über die Parameter mit
function createHTML($id, $eventName, $date, $location, $target_file, $price, $eventTickets, $description){
    $newHTML = fopen("../Events/html/"."$id".".html", "w") or die ("Unable to create.");
    $htmlData =
        "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>$eventName</title>
    <link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/eventStyles.css\">
    <link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/styles.css\">
	<link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/bootstrap.min.css\">
	<link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/animsition.min.css\">
	<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\">
	<link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/util.css\">
	<link rel=\"stylesheet\" type=\"text/css\" href=\"https://intranet-secure.de/TicketCorner/css/main.css\">
	<link rel=\"icon\" href=\"https://intranet-secure.de/TicketCorner/images/icons/favicon.ico\" type=image/x-icon\">
</head>
<body class=\"animsition\">
<header class=\"header1\" id=\"navbarIndex\">
		<div class=\"container-menu-header\">
			<div class=\"topbar\">
				<div class=\"topbar-social\">
					<a href=\"https://www.facebook.com/AStAHSHL/\" class=\"topbar-social-item fa fa-facebook\"></a>
					<a href=\"https://www.instagram.com/asta.hshl/\" class=\"topbar-social-item fa fa-instagram\"></a>
				</div>
				<div class=\"topbar-child2  loggedInAcc\"> <!-- wenn loggedInAcc dann verschiebt sich das element nach oben -->
					<span class=\"topbar-email\" id=\"loggedInAs\"> Logged in as... </span>
				</div>
				<div class=\"topbar-pay\">
					<a class=\"p-b-9\">
						<img class=\"h-size2\" src=\"https://intranet-secure.de/TicketCorner/images/icons/paypal.png\" alt=\"IMG-PAYPAL\">
					</a>
				</div>
			</div>
			<div class=\"wrap_header\" id=\"navbarSupportedContent\">
				<a href=\"https://intranet-secure.de/TicketCorner/index.html\" class=\"logo\">
					<img id=\"payPalLogo\" src=\"https://intranet-secure.de/TicketCorner/images/icons/logo.png\" alt=\"IMG-LOGO\">
				</a>
				<div class=\"wrap_menu\">
					<nav class=\"menu\">
						<ul class=\"main_menu\">
							<li>
								<a href=\"https://intranet-secure.de/TicketCorner/index.html\">Home</a>
							</li>
							<li>
								<a href=\"https://intranet-secure.de/TicketCorner/about.html\">Über uns</a>
							</li>
							<li>
								<a href=\"https://intranet-secure.de/TicketCorner/contact.html\">Kontakt</a>
							</li>
							<li style=\"position: absolute; right: 0; padding-right: 50px; \">
								<a><img src=\"https://intranet-secure.de/TicketCorner/images/icons/icon-header-01.png\" class=\"header-icon1\" alt=\"ICON\" style=\"height: 32px;\"></a>
								<ul class=\"sub_menu loggedInAcc\" style=\"margin-left: -100px;\">
									<li><a href=\"https://intranet-secure.de/TicketCorner/accountManagement.html\">Einstellungen</a></li>
									<li><a href=\"https://intranet-secure.de/TicketCorner/create.html\">Event erstellen</a></li>
                                    <li><a href=\"#\" onclick=\"logout()\">Abmelden</a></li>
								</ul>
								<ul class=\"sub_menu loggedOutAcc\" style=\"margin-left: -100px;\">
									<li><a href=\"https://intranet-secure.de/TicketCorner/signIn.html\">Anmelden</a></li>
                                    <li><a href=\"https://intranet-secure.de/TicketCorner/registration.html\">Registrieren</a></li>
								</ul>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</header>
	
	<div id=\"carouselExampleIndicators\" class=\"carousel slide\" data-ride=\"carousel\">
		<ol class=\"carousel-indicators\">
			<li data-target=\"#carouselExampleIndicators\" data-slide-to=\"0\" class=\"active\"></li>
			<li data-target=\"#carouselExampleIndicators\" data-slide-to=\"1\"></li>
			<li data-target=\"#carouselExampleIndicators\" data-slide-to=\"2\"></li>
		</ol>
		<div class=\"carousel-inner\">
			<div class=\"carousel-item active\">
				<a href=\"Events/html/test.html\" id=\"firstSlideshowLink\"><img class=\"d-block w-100\" id=\"firstSliderImg\" src=\"slideshow/slideshow1.jpg\" alt=\"First slide\" height=\"500\" width=\"1530\"></a>
			</div>
			<div class=\"carousel-item\">
				<a href=\"Events/html/test.html\" id=\"secondSlideshowLink\"><img class=\"d-block w-100\" id=\"secondSliderImg\" src=\"slideshow/slideshow2.jpg\" alt=\"Second slide\" height=\"500\" width=\"1530\"></a>
			</div>
			<div class=\"carousel-item\">
				<a href=\"Events/html/test.html\" id=\"thirdSlideshowLink\"> <img class=\"d-block w-100\"id=\"thirdSliderImg\" src=\"slideshow/slideshow3.jpg\" alt=\"Third slide\" height=\"500\" width=\"1530\"></a>
			</div>
		</div>
	</div>
	
<div class=\"maintext\" id=\"maintext\" style=\"padding-top: 4px\">
    <div class=\"eventImage\">
        <img src=\"https://intranet-secure.de/TicketCorner/PHP/$target_file\" id='eventImg' height='512' width='512'>
    </div>
    <div class=\"eventInfo\">
        <p id='eventName'><b>Name:</b> $eventName</p>
        <div class=\"dropdown-divider\"></div>
        <p id='eventDate'><b>Datum:</b> $date</p>
        <div class=\"dropdown-divider\"></div>
        <p id='eventLocation'><b>Veranstaltungsort:</b>  $location</p>
        <div class=\"dropdown-divider\"></div>
        <p id='eventPrice'><b>Preis:</b> $price €</p>
        <div class=\"dropdown-divider\"></div>
        <p id='eventTickets'><b>Anzahl der Tickets:</b> $eventTickets</p>
        <div class=\"dropdown-divider\"></div>
        <p id='eventDescription' style=\"width: 400px\"><b>Beschreibung:</b> $description</p>
    </div>
    <div class=\"submitEvent\">
        
        <button name=\"submit\" type=\"submit\" class=\"flex-c-m btn bg1 bo-rad-23 hov1 m-text3 trans-0-4 marginSpacer\" onclick='getEventById(\"$id\")'>Ticket bestellen</button>
        <div class=\"dropdown-divider\"></div>
    </div>
     <h5 class=\"ratings loggedInAcc marginSpacer\">--Deine Bewertung--</h5>
     <div class=\"ratings loggedInAcc\">
        <form id=\"ratingForm\" action=\"https://intranet-secure.de/TicketCorner/PHP/uploadeRating.php\" method=\"post\">
    		
            <span class=\"star-rating\">
            <input type=\"radio\" name=\"rating\" value=\"oneStar\" id=\"oneStar\"><i></i>
            <label for=\"oneStar\">Ein Stern</label>
            <input type=\"radio\" name=\"rating\" value=\"twoStars\" id=\"twoStars\"><i></i>
            <label for=\"twoStars\">Zwei Sterne</label>
            <input type=\"radio\" name=\"rating\" value=\"threeStars\" id=\"threeStars\"><i></i>
            <label for=\"threeStars\">Drei Sterne</label>
            <input type=\"radio\" name=\"rating\" value=\"fourStars\" id=\"fourStars\"><i></i>
            <label for=\"fourStars\">Vier Sterne</label>
            <input type=\"radio\" name=\"rating\" value=\"fiveStars\" id=\"fiveStars\"><i></i>
            <label for=\"fiveStars\">Fünf Sterne</label> 
                                  </span>
                                  <br>
            <button type=\"submit\" onclick=\"sendRatingForm()\" class=\"flex-c-m btn bg1 bo-rad-23 hov1 m-text3 trans-0-4 marginSpacer\">Submit Rating</button>
            
          </form>
    </div>
    <h3 class=\"marginSpacer\" >--Gesamt Bewertung--</h3>
    <p class=\"marginSpacer\" id=\"rating\">0</p>
    <span class=\"star-rating\">
    <input type=\"radio\" name=\"rating\" value=\"oneStar\" id=\"oneStarOverAll\" disabled><i></i>
    <label for=\"oneStar\">Ein Stern</label>
    <input type=\"radio\" name=\"rating\" value=\"twoStars\" id=\"twoStarsOverAll\" disabled><i></i>
    <label for=\"twoStars\">Zwei Sterne</label>
    <input type=\"radio\" name=\"rating\" value=\"threeStars\" id=\"threeStarsOverAll\" disabled><i></i>
    <label for=\"threeStars\">Drei Sterne</label>
    <input type=\"radio\" name=\"rating\" value=\"fourStars\" id=\"fourStarsOverAll\" disabled><i></i>
    <label for=\"fourStars\">Vier Sterne</label>
    <input type=\"radio\" name=\"rating\" value=\"fiveStars\" id=\"fiveStarsOverAll\" disabled><i></i>
    <label for=\"fiveStars\">Fünf Sterne</label>
    </span>
    <div class=\"dropdown-divider \"></div>
    <div class=\"Comments loggedInAcc\">
            <div>
                <h5>Comment Section</h5>
                <textarea id=\"comment-section\" name=\"comment-section\" rows=\"5\" cols=\"100\" maxlength=\"234\"></textarea>
            </div>
        <button onclick=\"sendCommentForm()\" class=\"flex-c-m btn bg1 bo-rad-23 hov1 m-text3 trans-0-4 marginSpacer\">Post Comment</button>
    </div>
    <div class=\" loggedOutAcc\">
        <a href=\"https://intranet-secure.de/TicketCorner/signIn.html\">Logge dich ein und hinterlasse dein Feedback. </a>
    </div>
</div>
	<div class=\"btn-back-to-top bg0-hov\" id=\"backToTopBtn\">
		<span class=\"symbol-btn-back-to-top\">
			<i class=\"fa fa-angle-double-up\" aria-hidden=\"true\"></i>
		</span>
	</div>
<script type=\"text/javascript\" src=\"https://intranet-secure.de/TicketCorner/jquery/jquery-3.2.1.min.js\"></script>
<script type=\"text/javascript\" src=\"https://intranet-secure.de/TicketCorner/js/animsition.min.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/js/main.js\"></script>
<script src=\"https://code.jquery.com/jquery-3.3.1.slim.min.js\" integrity=\"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo\" crossorigin=\"anonymous\"></script>
<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js\" integrity=\"sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49\" crossorigin=\"anonymous\"></script>
<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\" integrity=\"sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy\" crossorigin=\"anonymous\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/indexJS.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/loginCheck.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/buyTicket.js\"></script>
<script src=\"https://intranet-secure.de/TicketCorner/JS/eventUpdater.js\"></script>
</body>
</html>";

    fwrite($newHTML,$htmlData);
    fclose($newHTML);
}
//Initialisierung der Server Variablen
$servername = "db758436568.db.1and1.com";
$username = "dbo758436568";
$password = "M9OitgiOLq4&4j9";
$dbname = "db758436568";

$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//Select Statements zum Kontrollieren, ob das Event schon existiert und ob der User die Berechtigung zum Erstellen hat
$stmt = $conn->prepare("SELECT * FROM events WHERE eventName = '$eventName';");
$controllStmt = $conn->prepare("SELECT * FROM users WHERE ID = $creatorID AND creatorStatus = 1 AND loggedIn = 1;");

if ($stmt->execute()){
    $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($result)==0){
        if($controllStmt->execute()){
            $controllResult = $controllStmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($controllResult)>0){
                try {
                    // set the PDO error mode to exception
                    //Insert Befehl, um ein neuen Event Eintrag in die Datenbank zu schreiben
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $sql = "INSERT INTO events (ID, eventName, eventPrice, eventTickets, maxEventTickets, eventDescription, eventDate, eventLocation, imageSrc, creatorID)
                             VALUES ($id, '$eventName', '$price', $eventTickets, $eventTickets, '$description', '$date', '$location', '$target_file', $creatorID)";
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
                    createHTML($id, $eventName, $date, $location, $target_file, $price, $eventTickets, $description);

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
            else{
                header("location: https://intranet-secure.de/TicketCorner/create.html?Message=NotPropLoggedIn");
            }
        }
    }
    else {
        header("location: https://intranet-secure.de/TicketCorner/create.html?Message=EventDouble");
    }
}
else{
    echo "Error2";
}
$conn = null;
?>
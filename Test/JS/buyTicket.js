//Funktion zum Erstellen eines Event Objekts
/*function Event(id, img, name, date, price, description) {
    this.id = id;
    this.eventName = name;
    this.img = img;
    this.eventDate = date;
    this.eventPrice = price;
    this.eventDescription = description;
    this.expired = false;
    this.soldout = false;

    // Funktion im Event Objekt zum Kontrollieren, ob das Events schon stattgefunden hat
    this.checkIsExpired = function() {
        console.log("checkIsExpired | got called");
        if(!this.eventDate) {
            console.log("checkIsExpired | no date defined, returning");
            return;
        }

        let currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);
        let values = this.eventDate.split(".");

        let eventDate = new Date(parseInt(values[2]), parseInt(values[1]) - 1, parseInt(values[0]));

        console.log("checkIsExpired | eventDate is: " + eventDate);

        if(eventDate < currentDate) {

            console.log("checkIsExpired | event is expired, should mark");

            //let expiredDiv = document.createElement("expiredDiv");
            //expiredDiv.className = "centered";

            //let text = document.createTextNode("ABGELAUFEN");
            //expiredDiv.appendChild(text);

            //this.imgElement.appendChild(expiredDiv);
            this.eventName.textContent += " (ABGELAUFEN)";
            this.expired = true;
            console.log("checkIsExpired | should be marked as expired: " + this.eventName.textContent);
        }
        else{
            console.log("checkIsExpired | event is not expired, do nothing");
        }
    };

    this.checkIsSoldOut = function() {
        if(this.currentTickets <= 0) {
            this.name = this.name.replace(" (AUSVERKAUFT)","");
            this.name += " (AUSVERKAUFT)";
            this.soldout = true;
        }
    };

    this.checkIsExpired();
    this.checkIsSoldOut();
}*/

// Funktion zum Auslesen eines per ID bestimmten Events aus der Datenbank
/*function getEventForPurchase(eventId, cb) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let eventJsonObject = this.responseText;
            if(typeof eventJsonObject === 'string'){
                eventJsonObject = JSON.parse(eventJsonObject);
                cb(eventJsonObject);
            }
        }
    };
    xmlhttp.open("POST", "/../TicketCorner/PHP/getEventForPurchase.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("ID="+ eventId);
}*/

// Funktion zum Umwandeln eines Events im HTML Code zur Javascript Eventklasse mit Abfrage, ob das Event noch verfügbar ist
function getEventById(eventId) {
    // Verhindern des automatischen Absendens durch HTML Button
    event.preventDefault();
    console.log("eventManager | getEventById called with id: " + eventId);

    let foundEvent = null;

    // Callback Aufruf der XMLHTTPRequest
    /*getEventForPurchase(eventId, function(events) {
        console.log("buyTicket | events.length: " + events.length);

        // Umwandlung des Ergebnisses von String in Javascript Objekt
        if(typeof events === 'string')
            events = JSON.parse(events);

        // Erstellen neuer Event Instanz aus Datenbankergebnis
        let currentEvent = events[0];*/


        console.log("buyTicket | loop | EventId: " + myEvent.id);

        // Doppelprüfung zur Sicherstellung
        if(myEvent.id === eventId) {

            console.log("buyTicket | event was found in holder");

            // Wenn das Event bereits stattgefunden hat oder ausverkauft ist kein Kauf möglich
            if(myEvent.expired) {
                console.log("buyTicket | event is expired, should show popup");
                window.alert("Die Veranstaltung hat bereits stattgefunden");
                return;
            }
            else if(myEvent.soldout) {
                console.log("buyTicket | event is soldout, should show popup");
                window.alert("Die Veranstaltung ist bereits ausverkauft");
                return;
            }

            foundEvent = myEvent;
        }

        // Wenn das Event korrekt gefunden wurde und nicht abgelaufen ist, kauf initiieren, sonst Fehler ausgeben
        if(foundEvent) {
            buyProcess(foundEvent.id, foundEvent.name, foundEvent.price, foundEvent.description);
            console.log("buyTicket | Ticket should be bought");
        }
        else
            window.alert("FEHLER: Die angegebene Veranstaltung konnte nicht gefunden werden!");
    /*});*/
}

// Funktion zum Erstellen einer Form, um die Bestellung eines Tickets aufzurufen
function buyProcess(eventID, eventName, eventPrice, eventDescription) {
    event.preventDefault();
    let form = document.createElement("form");
    document.body.appendChild(form);
    form.method = "POST";
    form.action = "https://intranet-secure.de/TicketCorner/PHP/buyTicket.php";
    inputCreate(form, eventID, "ID");
    inputCreate(form, eventName, "eventName");
    inputCreate(form, eventPrice, "eventPrice");
    inputCreate(form, eventDescription, "eventDescription");
    form.submit();
}

// Helferfunktion zum Anhängen von Daten an ein HTML Formular
function inputCreate(form, value ,name) {
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}

function parseURLParams(url) {
    let queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
if(window.location.href.includes("?")){
    let error = parseURLParams(window.location.href);
    if(error.Message[0] == "NoMoreTickets"){
        alert("No more Tickets");
    } else if(error.Message[0] == "OK"){
        alert("Ticket gekauft");
    }
}


// Funktion zum Umwandeln eines Events im HTML Code zur Javascript Eventklasse mit Abfrage, ob das Event noch verfügbar ist
function getEventById(eventId) {
    // Verhindern des automatischen Absendens durch HTML Button
    //event.preventDefault();
    console.log("eventManager | getEventById called with id: " + eventId);

    let foundEvent = null;

        console.log("buyTicket | loop | EventId: " + currentEvent.id);

        // Doppelprüfung zur Sicherstellung
        if(currentEvent.id === eventId) {

            console.log("buyTicket | event was found in holder");

            // Wenn das Event bereits stattgefunden hat oder ausverkauft ist kein Kauf möglich
            if(currentEvent.expired) {
                console.log("buyTicket | event is expired, should show popup");
                window.alert("Die Veranstaltung hat bereits stattgefunden");
                return;
            }
            else if(currentEvent.soldout) {
                console.log("buyTicket | event is soldout, should show popup");
                window.alert("Die Veranstaltung ist bereits ausverkauft");
                return;
            }

            foundEvent = currentEvent;
        }

        // Wenn das Event korrekt gefunden wurde und nicht abgelaufen ist, kauf initiieren, sonst Fehler ausgeben
        if(foundEvent) {
            buyProcess(foundEvent.id, foundEvent.name, foundEvent.price, foundEvent.description);
            console.log("buyTicket | Ticket should be bought");
        }
        else
            window.alert("FEHLER: Die angegebene Veranstaltung konnte nicht gefunden werden!");
}

// Funktion zum Erstellen einer Form, um die Bestellung eines Tickets aufzurufen
function buyProcess(eventID, eventName, eventPrice, eventDescription) {
    //event.preventDefault();
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
    } else if(error.Message[0] == "SOLD"){
        window.location = "https://intranet-secure.de/TicketCorner/paypal.html?VerN=" + error.Name[0] + "&VerP=" + error.Price[0];
    }
}
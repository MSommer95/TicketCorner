
function Event(id, img, name, date, price, description) {
    this.id = id;
    this.eventName = name;
    this.eventDate = date;
    this.eventPrice = price;
    this.eventDescription = description;
    this.expired = false;

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
    }
}

function getEventForPurchase(eventId, cb) {
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
}

function getEventById(eventId) {
    event.preventDefault();
    console.log("eventManager | getEventById called with id: " + eventId);

    let foundEvent = null;


    getEventForPurchase(eventId, function(events) {
        console.log("eventManager | eventHolder.length: " + events.length);

        if(typeof events === 'string')
            events = JSON.parse(events);

        for (let i = 0; i < events.length; i++) {
            let currentEvent = events[i];
            let event = new Event(currentEvent.ID, currentEvent.imageSrc, currentEvent.eventName, currentEvent.eventDate, currentEvent.eventPrice);

            event.checkIsExpired();

            console.log("eventManager | loop | EventId: " + event.id);

            if(event.id === eventId) {

                console.log("eventManager | event was found in holder");

                if(event.expired) {
                    console.log("eventManager | event is expired, should show popup");
                    window.alert("Die Veranstaltung hat bereits stattgefunden");
                    return;
                }

                foundEvent = currentEvent;
            }
        }

        if(foundEvent) {
            buyProcess(foundEvent.id, foundEvent.eventName, foundEvent.eventPrice, foundEvent.eventDescription);
            console.log("eventManager | Ticket should be bought");
        }
        else
            window.alert("FEHLER: Die angegebene Veranstaltung konnte nicht gefunden werden!");
    });
}

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

function inputCreate(form, value ,name) {
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}
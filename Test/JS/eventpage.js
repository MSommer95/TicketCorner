// Hilfsfunktion um den Cookie auszulesen
window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

// Hilfsfunktion um den Wert eines HTML Elements zu erhalten
function getFieldValue(field) {
    return document.getElementById(field).value;
}

// Funktion zum darstellen des Vorschaubilds
function previewFile(){
    // HTML Elemente auslesen und Filereader erstellen
    let preview = document.querySelector('img'); //selects the query named img
    let file    = document.querySelector('input[type=file]').files[0]; //sames as here
    let reader  = new FileReader();

    // Sobald reader geladen, Vorschaubild setzen
    reader.onloadend = function () {
        preview.src = reader.result;
    };

    // Falls kein Bild gefunden, leeren string setzen, ansonsten URL des Bildes setzen
    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}

// Funktion zur Darstellung des Ortes und Datums des Events bei Erstellung des Events
function appendDateAndLocation() {
    // Automatisches Absenden durch Buttonclick verhindern
    event.preventDefault();

    // HTML Elemente auslesen und vergleichsgerecht formatieren (Siehe "reformatDate()") - Neues Datum zum Vergleich erstellen (Zeitpunkt: Jetzt)
    let form = document.getElementById("create-form");
    let dateString = getFieldValue("form_date");
    let eventDate = reformatDate(dateString);
    let currentDate = new Date();

    // Vergleich, ob Event in der Vergangenheit liegt - Wenn ja: Erstellung nicht möglich
    if(eventDate < currentDate) {
        window.alert("Das Veranstaltungsdatum liegt in der Vergangenheit!");
        return;
    }

    // Darstellungsgerechte Formatierung des Events
    let displayDate = eventDate.toLocaleTimeString([], {year: "numeric", month: "numeric", day: "numeric", hour: '2-digit', minute:'2-digit', hour12: false}).concat(" Uhr");
    console.log(displayDate);

    // Auslesen des HTML Elements
    let location = getFieldValue("form_location");

    // Verarbeitete Daten an das Formular anhängen und Request an PHP Seite schicken
    if(tryChangeValue("form_date", displayDate)) {
        inputCreate(form, getCookie("ID"), "ID");
        inputCreate(form, displayDate, "eventDate");
        inputCreate(form, location, "eventLocation");
        form.submit();
    }
}

// Funktion zur Formatierung des eingetragenen Datums zur Verarbeitung als Javascript Date
function reformatDate(dateString) {
    // Einzelwerte aus dem String lesen
    // Jahr und Monat
    let ym = dateString.split("-");
    // Tag und Uhrzeit
    let dhm = ym[2].split("T");
    // Stunde und Minute
    let hm = dhm[1].split(":");

    // Einzelvariablen zur besseren Übersicht
    let year = parseInt(ym[0]);
    let month = parseInt(ym[1]) - 1; // Eingetragener Monat -1 -> Javascript Date zählt Monat von 0
    let day = parseInt(dhm[0]);
    let hour = parseInt(hm[0]);
    let minute = parseInt(hm[1]);

    // Neues Javascript Datum als Rückgabewert
    return new Date(year, month, day, hour, minute);
}

// Hilfsfunktion zum Anhängen von Daten an ein HTML Formular
function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}

// Hilfsfunktion zum Verändern von Werten eines HTML Elements
function tryChangeValue(name, value) {
    const element = document.getElementById(name);

    if(element !== null) {
        element.value = value;
        return true;
    }
    else {
        // ToDo: remove debugging, make user friendly errors without leaking code internal ID's
        window.alert(`Keine Elemente mit dem Namen '${name}' gefunden`);
        return false;
    }
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
    if(error.Message[0] == "NotPropLoggedIn"){
        alert("Not properly logged in");
    } else if(error.Message[0] == "EventDouble"){
        alert("Event already exists");
    }
}



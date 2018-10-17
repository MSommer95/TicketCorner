var eventArray;

function getFieldValue(field) {
    return document.getElementById(field).value;
}

function getName(){
    var name = getFieldValue("form_name");
    var preis = getFieldValue("form_preis");
    var tickets = getFieldValue("form_tickets");
    var beschreibung = getFieldValue("form_message");
    eventArray = {eventName: name, eventPreis: preis, eventTickets: tickets, eventBeschreibung: beschreibung};
    eventList.push(eventArray);
    console.log(eventArray);
    localStorage.setItem("liste", JSON.stringify(eventList));
}

function previewFile(){
    var preview = document.querySelector('img'); //selects the query named img
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}
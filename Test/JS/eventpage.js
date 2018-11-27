window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function getFieldValue(field) {
    return document.getElementById(field).value;
}

function previewFile(){
    let preview = document.querySelector('img'); //selects the query named img
    let file    = document.querySelector('input[type=file]').files[0]; //sames as here
    let reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}

function appendDateAndLocation() {
    event.preventDefault();

    let form = document.getElementById("create-form");
    let dateString = getFieldValue("form_date");
    let eventDate = reformatDate(dateString);
    let currentDate = new Date();

    if(eventDate < currentDate) {
        window.alert("Das Veranstaltungsdatum liegt in der Vergangenheit!");
        return;
    }

    let displayDate = eventDate.toLocaleTimeString([], {year: "numeric", month: "numeric", day: "numeric", hour: '2-digit', minute:'2-digit', hour12: false}).concat(" Uhr");
    console.log(displayDate);

    let location = getFieldValue("form_location");

    if(tryChangeValue("form_date", displayDate)) {
        inputCreate(form, getCookie("ID"), "ID");
        inputCreate(form, displayDate, "eventDate");
        inputCreate(form, location, "eventLocation");
        form.submit();
    }
}

function reformatDate(dateString) {
    // Year and month
    let ym = dateString.split("-");
    // Day and time
    let dhm = ym[2].split("T");
    // Hour and minute
    let hm = dhm[1].split(":");

    //DateVariables stored for better overview
    let year = parseInt(ym[0]);
    let month = parseInt(ym[1]) - 1;
    let day = parseInt(dhm[0]);
    let hour = parseInt(hm[0]);
    let minute = parseInt(hm[1]);

    return new Date(year, month, day, hour, minute);
}

function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}

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

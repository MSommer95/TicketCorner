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

function appendDate() {
    let form = document.getElementById("create-form");

    let dateString = getFieldValue("form_date");

    let values = dateString.split("-");
    // expected year, month, day;
    window.alert(JSON.stringify(values));
    let eventDate = new Date(parseInt(values[0]), parseInt(values[1]) - 1, parseInt(values[2]));

    if(tryChangeValue("form_date", eventDate.toLocaleDateString())) {
        inputCreate(form, getCookie("ID"), "ID");
        inputCreate(form, eventDate.toLocaleDateString(), "eventDate");
        form.submit();
    }
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

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

//Default Einstellung: pdata(Persönliche Daten) sichtbar, pwchange (Passwort change) nicht sichtbar
document.getElementById("pwchange").style.display = "none";
document.getElementById("pdata").style.display = "block";
//Funktion zum "Aufdecken" des pdata Forms / Verdeckt das pwchange Form
function enablePData(){
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("pdata").style.display = "block";
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(/ active/g, "");
    document.getElementById("btn-pdata").className += " active";
}
//Funktion zum "Aufdecken" des pwchange Forms / Verdeckt das pdata Form
function enablePW(){
    document.getElementById("pdata").style.display = "none";
    document.getElementById("pwchange").style.display = "block";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-pwchange").className += " active";
}
//Funktion zum Kontrollieren, ob eine Änderung bei einem der Werte aufgetreten ist
function checkForChange(){
    let forenameField = document.getElementById("change-forename").value;
    let surnameField = document.getElementById("change-surname").value;
    let emailField = document.getElementById("change-email").value;

    return (forenameField != getCookie("forename")|| surnameField != getCookie("surname") || emailField != getCookie("email" ));

}
//Legt ein User Objekt an, bei dem die Funktion fillFields mitgegeben wird
function User(forename, surname, email){
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    //Funktion zum Befüllen der Form Felder
    this.fillFields = function(){
        document.getElementById("change-forename").setAttribute("value", this.forename);
        document.getElementById("change-surname").setAttribute("value", this.surname);
        document.getElementById("change-email").setAttribute("value", this.email);
    }
}
//erstellt ein User Objekt und wendet die Funktion fillFields() auf dieses Objekt an
function initUser(){
    let user = new User(getCookie("forename"), getCookie("surname"), getCookie("email"));
    user.fillFields();
    getLoggedIn(function (deviceCount) {
        updateLoggedInCount(deviceCount);
    }, user);
}
initUser();
window.onbeforeunload = function() {
    if(checkForChange() == true){
        return "Do you really want to leave our brilliant application?";
    }
};

function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}
//Hängt dem Form wichtige Metadaten an (Forename, Surname, Email und ID
function changeData(formName) {
    let form = document.getElementById(formName);
    let formDataArray = ["forename", "surname", "email", "ID"];
    for (let i = 0; i <= formDataArray.length - 1; i++) {
        inputCreate(form, getCookie(formDataArray[i]), formDataArray[i]);
    }

}

function updateLoggedInCount(deviceCount) {
    document.getElementById("loggedInCount").textContent += deviceCount;
}

function getLoggedIn(cb, user) {
    let deviceCount;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            deviceCount = this.responseText;
            if(typeof deviceCount === 'string'){
                deviceCount = JSON.parse(deviceCount);
                cb(deviceCount);
                console.log(deviceCount);
            }
        }
    };
    xmlhttp.open("POST", "PHP/getLoggedIn.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("email="+ user.email);

}
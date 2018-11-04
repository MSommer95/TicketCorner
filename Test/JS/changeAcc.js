window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};
document.getElementById("email").setAttribute("value",getCookie("email"));
document.getElementById("forename").setAttribute("value",getCookie("forename"));
document.getElementById("surname").setAttribute("value",getCookie("surname"));

document.getElementById("pwchange").style.display = "none";
document.getElementById("pdata").style.display = "block";

function enablePData(){
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("pdata").style.display = "block";
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(" active", "");
    document.getElementById("btn-pdata").className += " active";
}

function enablePW(){
    document.getElementById("pdata").style.display = "none";
    document.getElementById("pwchange").style.display = "block";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(" active", "");
    document.getElementById("btn-pwchange").className += " active";
}
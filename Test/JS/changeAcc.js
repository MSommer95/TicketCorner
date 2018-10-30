window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};
document.getElementById("email").setAttribute("value",getCookie("Email"));
document.getElementById("vorname").setAttribute("value",getCookie("Vorname"));
document.getElementById("nachname").setAttribute("value",getCookie("Nachname"));

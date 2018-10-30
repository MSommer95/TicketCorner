document.getElementById("LoggedOutAcc").style.display = "block";
document.getElementById("LoggedInAcc").style.display="none";
document.getElementById("LoggedInCreate").style.display="none";

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function checkForLogin(){
    if (getCookie("Email") == null){
        document.getElementById("LoggedOutAcc").style.display = "block";
        document.getElementById("LoggedInAcc").style.display="none";
        document.getElementById("LoggedInCreate").style.display="none";
    }
    else {
        document.getElementById("LoggedOutAcc").style.display = "none";
        document.getElementById("LoggedInAcc").style.display="block";
        document.getElementById("LoggedInCreate").style.display="block";
    }
}

function logout(){
    document.cookie = "Email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Vorname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "Nachname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    checkForLogin();
}


checkForLogin();

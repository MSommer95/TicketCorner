document.getElementById("loggedOutAcc").style.display = "block";
document.getElementById("loggedInAcc").style.display= "none";
document.getElementById("loggedInCreate").style.display= "none";

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function checkForLogin(){
    if (getCookie("email") == null){
        document.getElementById("loggedOutAcc").style.display = "block";
        document.getElementById("loggedInAcc").style.display= "none";
        document.getElementById("loggedInCreate").style.display= "none";
    }
    else {
        document.getElementById("loggedOutAcc").style.display = "none";
        document.getElementById("loggedInAcc").style.display= "block";
        document.getElementById("loggedInCreate").style.display= "block";
    }
}

function logout(){
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "forename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "surname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkForLogin();
}


checkForLogin();


computeLogout();

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function checkForLogin(){
    if (getCookie("email") == null){
        computeLogout();
    }
    else {
        computeLogin();
    }
}

function logout(){
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "forename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "surname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkForLogin();
}

function computeLogout(){
    let lout = document.getElementsByClassName(" loggedOutAcc");
    let lin = document.getElementsByClassName(" loggedInAcc");
    for(i=0; i<lout.length;i++){
        lout.item(i).style.display = "block";
    }
    for(i=0; i<lin.length;i++){
        lin.item(i).style.display = "none";
    }
}

function computeLogin(){
    let lout = document.getElementsByClassName(" loggedOutAcc");
    let lin = document.getElementsByClassName(" loggedInAcc");
    for(i=0; i<lout.length;i++){
        lout.item(i).style.display = "none";
    }
    for(i=0; i<lin.length;i++){
        lin.item(i).style.display = "block";
    }
}

checkForLogin();
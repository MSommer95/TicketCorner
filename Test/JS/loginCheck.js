
computeLogout();

window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};

function inputCreate(form, value ,name){
    let tag = document.createElement("INPUT");
    tag.name = name;
    tag.value = value;
    tag.type = 'hidden';
    form.appendChild(tag);
}

function checkForLogin(){
    if (getCookie("email") == null){
        computeLogout();
    }
    else {
        computeLogin();
    }
}

function logout(){
    sendLogOut();
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "forename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "surname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "creatorStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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
    let lcreator = document.getElementsByClassName(" creator");
    for(i=0; i<lout.length;i++){
        lout.item(i).style.display = "none";
    }
    for(i=0; i<lin.length;i++){
        lin.item(i).style.display = "block";
    }
    if(getCookie("creatorStatus") == 1){
        for(i=0; i<lcreator.length; i++){
            lcreator.item(i).style.display = "block";
        }
    }
    else {
        for(i=0; i<lcreator.length; i++){
            lcreator.item(i).style.display = "none";
        }
    }
}

function sendLogOut(){
    let logoutForm = document.createElement("form");
    logoutForm.action = "./PHP/logout.php";
    logoutForm.method = "POST";
    inputCreate(logoutForm, getCookie("ID"), "ID");
    inputCreate(logoutForm, getCookie("forename"), "forename");
    inputCreate(logoutForm, getCookie("surname"), "surname");
    inputCreate(logoutForm, getCookie("email"), "email");
    document.body.appendChild(logoutForm);
    logoutForm.submit();
    }

checkForLogin();
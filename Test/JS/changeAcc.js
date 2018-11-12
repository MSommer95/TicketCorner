window.getCookie = function(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};


document.getElementById("pwchange").style.display = "none";
document.getElementById("pdata").style.display = "block";

function enablePData(){
    document.getElementById("pwchange").style.display = "none";
    document.getElementById("pdata").style.display = "block";
    document.getElementById("btn-pwchange").className = document.getElementById("btn-pwchange").className.replace(/ active/g, "");
    document.getElementById("btn-pdata").className += " active";
}

function enablePW(){
    document.getElementById("pdata").style.display = "none";
    document.getElementById("pwchange").style.display = "block";
    document.getElementById("btn-pdata").className = document.getElementById("btn-pdata").className.replace(/ active/g, "");
    document.getElementById("btn-pwchange").className += " active";
}

function checkForChange(){
    let forenameField = document.getElementById("change-forename").value;
    let surnameField = document.getElementById("change-surname").value;
    let emailField = document.getElementById("change-email").value;

    return (forenameField != getCookie("forename")|| surnameField != getCookie("surname") || emailField != getCookie("email" ));

}


function User(forename, surname, email){
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    this.fillFields = function(){
        document.getElementById("change-forename").setAttribute("value", this.forename);
        document.getElementById("change-surname").setAttribute("value", this.surname);
        document.getElementById("change-email").setAttribute("value", this.email);
    }
}

let user = new User(getCookie("forename"), getCookie("surname"), getCookie("email"));
user.fillFields();


window.onbeforeunload = function() {
    if(checkForChange() == true){
        return "Do you really want to leave our brilliant application?";
    }
};

function changePW(){
    let inputForename = $("<input>")
        .attr("type", "hidden")
        .attr("name", "forename").val(getCookie("forename"));
    $('#pwchange').append(inputForename);
    let inputSurname = $("<input>")
        .attr("type", "hidden")
        .attr("name", "surname").val(getCookie("surname"));
    $('#pwchange').append(inputSurname);
    let inputEmail = $("<input>")
        .attr("type", "hidden")
        .attr("name", "email").val(getCookie("email"));
    $('#pwchange').append(inputEmail);
    let inputID = $("<input>")
        .attr("type", "hidden")
        .attr("name", "ID").val(getCookie("ID"));
    $('#pwchange').append(inputID);
}

function changeAccData(){
    let inputForename = $("<input>")
        .attr("type", "hidden")
        .attr("name", "forename").val(getCookie("forename"));
    $('#pdata').append(inputForename);
    let inputSurname = $("<input>")
        .attr("type", "hidden")
        .attr("name", "surname").val(getCookie("surname"));
    $('#pdata').append(inputSurname);
    let inputEmail = $("<input>")
        .attr("type", "hidden")
        .attr("name", "email").val(getCookie("email"));
    $('#pdata').append(inputEmail);
    let inputID = $("<input>")
        .attr("type", "hidden")
        .attr("name", "ID").val(getCookie("ID"));
    $('#pdata').append(inputID);
}


function getEvents() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("pTest").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET", "PHP/getEvents.php", true);
    xmlhttp.send();


}




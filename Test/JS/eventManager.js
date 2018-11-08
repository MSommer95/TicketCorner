
let arrayEventName = [];
let arrayImagePath = [];

function loopIt(arr){
    for(i=0;i<arr.length;i++){
        createPost(arrayImagePath[i],arrayEventName[i]);
        console.log(arrayEventName[i]);
        console.log(arrayImagePath[i]);
    }
}


function getEvents() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("pTest").innerHTML = this.responseText;
            let split = this.responseText;
            split = clearString(split);
            split = split.split(",");
            breakArray(split);
            console.log(split);
            console.log(arrayEventName);
            console.log(arrayImagePath);
            loopIt(arrayImagePath);
        }
    };
    xmlhttp.open("GET", "PHP/getEvents.php", true);
    xmlhttp.send();
}

function clearString(str){
    console.log(str);
    str = str.replace(/{|}|"|imageSrc|:|eventName/g,"");
    console.log(str);
    str = str.slice(1,-2);
    console.log(str);
    return str;
}

function breakArray(arr){
    for(i=0; i<arr.length;i += 2){
        arrayEventName.push(arr[i]);

        arrayImagePath.push(arr[i+1]);


    }


}

function createPost(img, name){
    let eventName = document.createElement("h1");
    eventName.textContent = name;
    let imgElement = document.createElement("img");
    imgElement.src = "PHP/" + img;
    imgElement.height = 400;
    imgElement.width = 800;
    document.getElementById("maintext").appendChild(eventName);
    document.getElementById("maintext").appendChild(imgElement);
}

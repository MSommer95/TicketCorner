// When the user scrolls the page, execute myFunction
window.onscroll = function() {stickyFunction()};

// Get the navbar
let navbar = document.getElementById("navbarIndex");

// Get the offset position of the navbar
let sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}
//TestArea

function indexInit() {
    let eventHolderIndex =  [];
    let eventEndorserIndex = [];

    function bubbleSort(arr){
        let arrTest = arr;
        let len = arrTest.length;
        for (let i = len-1; i>=0; i--){
            for(let j = 1; j<=i; j++){
                if(arrTest[j-1].endorsement>arrTest[j].endorsement){
                    let temp = arrTest[j-1];
                    arrTest[j-1] = arrTest[j];
                    arrTest[j] = temp;
                }
            }
        }
        return arrTest;
    }

    function getEvents(cb) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let eventJsonObject = this.responseText;
                if(typeof eventJsonObject === 'string'){
                    eventJsonObject = JSON.parse(eventJsonObject);
                    cb(eventJsonObject);
                }
            }
        };
        xmlhttp.open("GET", "https://intranet-secure.de/TicketCorner/PHP/getEvents.php", true);
        xmlhttp.send();

    }
    function Event(id, img, name, date, price, tickets, maxTickets) {
        this.id = id;
        this.endorsement = (maxTickets - tickets) / maxTickets;
        this.img = img;
        this.name = name;
        this.date = date;
        this.price = price;
        this.expired = false;



        this.checkIsExpired = function() {
            console.log("checkIsExpired | got called");
            if(!this.date) {
                console.log("checkIsExpired | no date defined, returning");
                return;
            }

            let currentDate = new Date();

            currentDate.setHours(0, 0, 0, 0);


            let dateTransformed = this.date.split(".").reverse().join(".");
            let eventDate = new Date(dateTransformed);

            console.log("checkIsExpired | eventDate is: " + eventDate);

            if(eventDate < currentDate) {

                console.log("checkIsExpired | event is expired, should mark");

                //let expiredDiv = document.createElement("expiredDiv");
                //expiredDiv.className = "centered";

                //let text = document.createTextNode("ABGELAUFEN");
                //expiredDiv.appendChild(text);

                //this.imgElement.appendChild(expiredDiv);
                this.name = this.name.replace(" (ABGELAUFEN)","");
                this.name += " (ABGELAUFEN)";
                this.expired = true;
                console.log("checkIsExpired | should be marked as expired: " + this.name);
            }
            else{

                console.log("checkIsExpired | event is not expired, do nothing");
            }
        }
    }

    function initEvents(eventJsonObject){
        for(let i=0; i<=eventJsonObject.length-1; i++){
            let event = new Event(eventJsonObject[i].ID, eventJsonObject[i].imageSrc, eventJsonObject[i].eventName, eventJsonObject[i].eventDate, eventJsonObject[i].eventPrice, eventJsonObject[i].eventTickets, eventJsonObject[i].maxEventTickets);
            eventHolderIndex.push(event);
            console.log(event);

        }

        for(let i= 0; i<=eventHolderIndex.length-1; i++){
            eventHolderIndex[i].checkIsExpired();
            if(!eventHolderIndex[i].expired){
                eventEndorserIndex.push(eventHolderIndex[i]);
            }
        }

        eventEndorserIndex = bubbleSort(eventEndorserIndex).reverse();
        return eventHolderIndex;
    }

    function updateSlideshow() {
        let firstSliderPath = "/TicketCorner"+ eventEndorserIndex[0].img.replace("..","");
        let secondSliderPath = "/TicketCorner"+eventEndorserIndex[1].img.replace("..","");
        let thirdliderPath = "/TicketCorner"+eventEndorserIndex[2].img.replace("..","");



        document.getElementById("firstSliderImg").src = firstSliderPath;
        document.getElementById("firstSlideshowLink").href = firstSliderPath.replace(/jpg|img/g,"html");
        document.getElementById("secondSliderImg").src = secondSliderPath;
        document.getElementById("secondSlideshowLink").href = secondSliderPath.replace(/jpg|img/g,"html");
        document.getElementById("thirdSliderImg").src = thirdliderPath;
        document.getElementById("thirdSlideshowLink").href = thirdliderPath.replace(/jpg|img/g,"html");

    }

    getEvents(function (events) {
        initEvents(events);
        updateSlideshow();
    });

//TestArea
}
indexInit();

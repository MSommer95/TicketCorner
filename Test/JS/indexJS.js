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

function updateSlideshow() {

    document.getElementById("firstSliderImg").src = "/TicketCorner"+ eventEndorser[0].img.replace("..","");
    document.getElementById("secondSliderImg").src = "/TicketCorner"+eventEndorser[1].img.replace("..","");
    document.getElementById("thirdSliderImg").src = "/TicketCorner"+eventEndorser[2].img.replace("..","");

}
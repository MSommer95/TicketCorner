// Wenn Nutzer scrollt, stickFunction ausführen
window.onscroll = function() {stickyFunction()};

// Navbar zwischenspeichern
let navbar = document.getElementById("navbarIndex");

// Abstand von Navbar zwischenspeichern
let sticky = navbar.offsetTop;

// "sticky" Klasse zur Navbar hinzufügen, wenn man an ihre Position scrollt
function stickyFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

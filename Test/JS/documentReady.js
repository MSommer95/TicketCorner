$(function() {

    getEvents(function(events) {
        initEvents(events);
        loopIt(1);
        updateSlideshow();
    });
});
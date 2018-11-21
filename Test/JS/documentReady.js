$(function() {
    getEvents(function(events) {
        loopIt(events, 1);
    });
});
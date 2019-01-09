$(function() {
    getRatings(function (ratings) {
        eventRatingsAll = ratings;
    });

    getEvents(function(events) {
        initEvents(events);
        loopIt('new');
    });
});
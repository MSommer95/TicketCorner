function parseURLParams(url) {
    let queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

if(window.location.href.includes("?")){
    let params = parseURLParams(window.location.href);
    let eventName = params.VerN[0];
    let eventPrice = params.VerP[0];

    document.getElementById("eventName").textContent += eventName;
    document.getElementById("eventPrice").textContent += eventPrice + " €";
}
// _static/open_new_tab.js
document.addEventListener("DOMContentLoaded", function() {
    var links = document.links;
    for (var i = 0; i < links.length; i++) {
        // If the link is not on the same domain as the current page
        if (links[i].hostname != window.location.hostname) {
            links[i].target = '_blank';
            links[i].rel = 'noopener noreferrer';
        }
    }
});

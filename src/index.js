/**
 * @author kounelios13
 */

hljs.initHighlightingOnLoad();
$(document).ready(function () {
    $("code").each(function (_,block) {
        hljs.highlightBlock(block);
    })
    $("#alert").click(function () {
        mbox.alert("Hello .I am an alert");
    });
});
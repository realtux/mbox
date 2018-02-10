/**
 * @author kounelios13
 */

hljs.initHighlightingOnLoad();
$(document).ready(function () {
    $(".button-collapse").sideNav();
    $("code:not(p code)").each(function (_,block) {
        hljs.highlightBlock(block);
    })
    $("#alert").click(function () {
        mbox.alert("Hello .I am an alert");
    });
    $(".nav-wrapper li").click(function () {
        $(".nav-wrapper li").removeClass("active");
        $(this).addClass("active");
    });
});
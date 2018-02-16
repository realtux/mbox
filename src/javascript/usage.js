/**
 * @author kounelios13
 */
(function ($) {

    /**
     * Show a materialize toast message
     * @param {string} message Message of toast
     * @param {number} [duration] 
     */
    function toast(message, duration) {
        Materialize.toast(message, duration || 4000);
    }

    $(document).ready(function () {
        hljs.initHighlightingOnLoad();
        $(".button-collapse").sideNav();
        $("#alert").click(function () {
            mbox.alert("Hello world");
        });
        $("#confirm").click(function () {
            mbox.confirm("Drugs are bad, are you sure you want to use them?", function (yes) {
                if (yes) {
                   toast("You took the drugs :(");
                } else {
                    toast("You didn't take the drugs :) You are safe");
                }
            });
        });
        $("#prompt").click(function () {
            mbox.prompt("Did you star Mbox yet? (yes/no)", function (answer) {
                if (answer == "yes") {
                    toast("Rock on...");
                } else {
                    toast("Shame");
                }
            });
        });
        $("#custom").click(function () {
            mbox.custom({
                message: 'What is your favorite type of pie?',
                options: {}, // see Options below for options and defaults
                buttons: [{
                        label: 'Pumpkin',
                        color: 'orange darken-2',
                        callback: function () {
                            mbox.alert('Pumpkin is your favorite')
                        }
                    },
                    {
                        label: 'Apple',
                        color: 'red darken-2',
                        callback: function () {
                            mbox.alert('Apple is your favorite')
                        }
                    }
                ]
            });
        });
    });
})(jQuery);
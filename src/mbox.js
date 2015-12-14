/***
The MIT License (MIT)

Copyright (c) 2015 Brian Seymour

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ***/
;(function($) {
    mbox = {

        alert: function(message, cb) {
            this.open('alert', message);

            $('.mbox-wrapper .mbox-ok-button').click(function() {
                cb && cb();
                mbox.close();
            });
        },

        confirm: function(message, cb) {
            this.open('confirm', message);

            $('.mbox-wrapper .mbox-ok-button').click(function() {
                cb && cb(true);
                mbox.close();
            });

            $('.mbox-wrapper .mbox-cancel-button').click(function() {
                cb && cb(false);
                mbox.close();
            });
        },

        open: function(type, message) {
            var buttons;

            switch (type) {
                case 'alert':
                    buttons = this.gen_button('light-blue', 'Ok', 'mbox-ok-button');
                    break;

                case 'confirm':
                    buttons = this.gen_button('light-blue', 'Ok', 'mbox-ok-button');
                    buttons += this.gen_button('grey', 'Cancel', 'mbox-cancel-button');
                    break;
            }

            var template = '' +
                '<div class="mbox-wrapper">' +
                    '<div class="mbox z-depth-1">' +
                        '<h5>$$$_message_$$$</h5>' +
                        '<hr />' +
                        '<div class="right-align">' +
                            '$$$_buttons_$$$' +
                        '</div>' +
                    '</div>' +
                '</div>';

            if (message) template = template.replace(/\$\$\$_message_\$\$\$/gi, message);
            if (buttons) template = template.replace(/\$\$\$_buttons_\$\$\$/gi, buttons);

            $('body')
                .append(template)
                .addClass('mbox-open');
            $('.mbox-wrapper')
                .show();
        },

        close: function() {
            $('.mbox')
                .hide(0, function() {
                    $(this).closest('.mbox-wrapper').remove();
                });
            $('body')
                .removeClass('mbox-open');
        },

        gen_button: function(color, text, type) {
            return '&nbsp;<button '+
                'type="button" '+
                'class="'+type+' waves-effect waves-light btn '+color+' darken-2">'+text+'</button>';
        }

    };
})(jQuery);
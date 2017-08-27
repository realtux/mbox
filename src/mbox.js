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
;
(function($) {
    var locales = {
        en: {
            CANCEL: 'Cancel',
            OK: 'OK'
        },
        el: {
            CANCEL: 'Ακύρωση',
            OK: 'Εντάξει'
        },
        it: {
            CANCEL: "Annulla",
            OK: "OK"
        },
        de: {
            CANCEL: "Abbrechen",
            OK: "OK"
        },
        pt: {
            OK: 'Está bem',
            CANCEL: 'cancelar'
        }
    };

    mbox = {

        locale: 'en',

        global: {
            options: {
                open_speed: 0,
                close_speed: 0
            }
        },

        options: {},

        template: '' +
            '<div class="mbox-wrapper">' +
                '<div class="mbox z-depth-1">' +
                    '<h5>$$$_message_$$$</h5>' +
                    '$$$_input_$$$' +
                    '<div class="right-align">' +
                        '$$$_buttons_$$$' +
                    '</div>' +
                '</div>' +
            '</div>',

        set_locale: function(locale) {
            this.locale = locale;
        },
        setLocale: this.set_locale,

        add_locale: function(locale, translations) {
            locales[locale.toLowerCase()] = translations;
        },
        addLocale: this.add_locale,

        alert: function() {
            this.reset_options();

            var data = this.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;

            this.open('alert', message);

            $('.mbox-wrapper .mbox-ok-button').click(function() {
                mbox.close();
                cb && cb();
            });
        },

        confirm: function() {
            this.reset_options();

            var data = this.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;

            this.open('confirm', message);

            $('.mbox-wrapper .mbox-ok-button').click(function() {
                mbox.close();
                cb && cb(true);
            });

            $('.mbox-wrapper .mbox-cancel-button').click(function() {
                mbox.close();
                cb && cb(false);
            });
        },

        prompt: function() {
            this.reset_options();

            var data = this.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;

            this.open('prompt', message);

            $('.mbox-wrapper .mbox-ok-button').click(function() {
                var entered_text = $('.mbox-wrapper input').val();

                mbox.close();
                cb && cb(entered_text);
            });

            $('.mbox-wrapper .mbox-cancel-button').click(function() {
                mbox.close();
                cb && cb(false);
            });
        },

        custom: function(configuration) {
            this.reset_options();

            if (typeof configuration !== 'object') {
                throw 'Custom box requires argument 1 to be an object';
            }

            typeof configuration.options === 'object' && this.process_options(configuration.options);

            var template = this.template;
            template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');

            if (!configuration.buttons || configuration.buttons.length === 0) {
                throw 'You must provide at least 1 button';
            }

            var buttons = '';

            configuration.buttons.forEach(function(button, i) {
                var serialized_button = 'mbox-custom-button-' + i;

                buttons += mbox
                    .gen_button(
                        button.color || 'grey lighten-4',
                        button.label || '',
                        serialized_button
                    );
            });

            template = template.replace(/\$\$\$_message_\$\$\$/gi, configuration.message || '');
            template = template.replace(/\$\$\$_buttons_\$\$\$/gi, buttons);

            // prevent scrolling on the body
            $('body')
                .append(template)
                .addClass('mbox-open');

            configuration.buttons.forEach(function(button, i) {
                var serialized_button = 'mbox-custom-button-' + i;

                $('.' + serialized_button).click(function() {
                    if (button.callback) {
                        button.callback();
                    } else {
                        mbox.close();
                    }
                });

            });

            // show the box
            $('.mbox-wrapper').fadeIn(this.options.open_speed);
        },

        open: function(type, message) {
            var template = this.template;
            var input = '<input type="text" />';
            var buttons;

            switch (type) {
                case 'alert':
                    buttons = this.gen_button('light-blue darken-2', locales[this.locale].OK, 'mbox-ok-button');
                    template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');
                    break;

                case 'confirm':
                    buttons = this.gen_button('light-blue darken-2', locales[this.locale].OK, 'mbox-ok-button');
                    buttons += this.gen_button('grey darken-2', locales[this.locale].CANCEL, 'mbox-cancel-button');
                    template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');
                    break;

                case 'prompt':
                    buttons = this.gen_button('light-blue darken-2', locales[this.locale].OK, 'mbox-ok-button');
                    buttons += this.gen_button('grey darken-2', locales[this.locale].CANCEL, 'mbox-cancel-button');
                    template = template.replace(/\$\$\$_input_\$\$\$/gi, input);
                    break;
            }

            if (message) template = template.replace(/\$\$\$_message_\$\$\$/gi, message);
            if (buttons) template = template.replace(/\$\$\$_buttons_\$\$\$/gi, buttons);

            // prevent scrolling on the body
            $('body')
                .append(template)
                .addClass('mbox-open');

            // show the box
            $('.mbox-wrapper').fadeIn(this.options.open_speed);
        },

        close: function() {
            // hide the box
            $('.mbox')
                .fadeOut(this.options.close_speed, function() {
                    $(this).closest('.mbox-wrapper').remove();
                });

            // allow scrolling on body again
            $('body').removeClass('mbox-open');

            // unbind all the mbox buttons
            $('.mbox-button').unbind('click');
        },

        parse_args: function(args) {
            var args = [].slice.call(args);

            var ret = {
                message: null,
                cb: null
            }

            args.forEach(function(arg) {
                if (typeof arg === 'string') ret.message = arg;
                if (typeof arg === 'function') ret.cb = arg;
                if (typeof arg === 'object') this.process_options(arg);
            }, this);

            return ret;
        },

        process_options: function(options) {
            Object.keys(options).forEach(function(key) {
                this.options[key] = options[key];
            }, this);
        },

        reset_options: function() {
            this.process_options(this.global.options);
        },

        gen_button: function(color, text, type) {
            return '&nbsp;<button ' +
                'type="button" ' +
                'class="mbox-button ' + type + ' ' +
                'waves-effect waves-light btn ' + color + '">' + text +
                '</button>';
        }

    };
})(jQuery);

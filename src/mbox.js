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


var mbox = (function ($) {
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
    var core = {
        

        global: {
            options: {
                open_speed: 0,
                close_speed: 0,
                locale:'en'
            }
        },

        options: {

        },
        set_close_speed: function (speed) {
            if (isNaN(speed)) {
                throw new Error("Speed value must be a number but a " + typeof (speed) + " was given");
            }
            core.global.options.close_speed = speed;
        },
        set_open_speed: function (speed) {
            if (isNaN(speed)) {
                throw new Error("Speed value must be a number but a " + typeof (speed) + " was given");
            }
            core.global.options.open_speed = speed;
        },
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
        set_locale: function (locale) {
            core.global.options.locale = locale;
        },
        setLocale: this.set_locale,

        add_locale: function (locale, translations) {
            locales[locale.toLowerCase()] = translations;
        },
        addLocale: this.add_locale,
        reset_options: function () {
            core.process_options(core.global.options);
        },
        alert: function () {
            core.reset_options();

            var data = core.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;

            core.open('alert', message);

            $('.mbox-wrapper .mbox-ok-button').click(function () {
                core.close();
                cb && cb();
            });
        },

        confirm: function () {
            core.reset_options();

            var data = core.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;
            if (!cb) {
                throw new Error('Confirm requires a callback');
            }
            core.open('confirm', message);

            $('.mbox-wrapper .mbox-ok-button').click(function () {
                core.close();
                cb(true);
            });

            $('.mbox-wrapper .mbox-cancel-button').click(function () {
                core.close();
                cb(false);
            });
        },

        prompt: function () {
            core.reset_options();

            var data = core.parse_args(arguments);

            var message = data.message;
            var cb = data.cb;
            if (!cb) {
                throw new Error('Prompt requires a callback');
            }
            core.open('prompt', message);

            $('.mbox-wrapper .mbox-ok-button').click(function () {
                var entered_text = $('.mbox-wrapper input').val();

                core.close();
                cb && cb(entered_text);
            });

            $('.mbox-wrapper .mbox-cancel-button').click(function () {
                core.close();
                cb && cb(false);
            });
        },

        custom: function (configuration) {
            core.reset_options();

            if (typeof configuration !== 'object') {
                throw 'Custom box requires argument 1 to be an object';
            }

            typeof configuration.options === 'object' && core.process_options(configuration.options);

            var template = core.template;
            template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');

            if (!configuration.buttons || configuration.buttons.length === 0) {
                throw 'You must provide at least 1 button';
            }

            var buttons = '';

            configuration.buttons.forEach(function (button, i) {
                var serialized_button = 'mbox-custom-button-' + i;

                buttons += core
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

            configuration.buttons.forEach(function (button, i) {
                var serialized_button = 'mbox-custom-button-' + i;

                $('.' + serialized_button).click(function () {
                    if (button.callback) {
                        button.callback();
                    } else {
                        core.close();
                    }
                });

            });
            var open_speed = core.options.open_speed;
            // show the box
            $('.mbox-wrapper').fadeIn(open_speed);
        },

        open: function (type, message) {
            var template = core.template;
            var input = '<input type="text" />';
            var buttons;
            var locale_name = null;
            if (core.options.locale) {
                //User requested a specific locale
                locale_name = core.options.locale;
            } else {
                locale_name = core.global.options.locale;
            }
            var locale = locales[locale_name];
            switch (type) {
                case 'alert':
                    buttons = core.gen_button('light-blue darken-2', locale.OK, 'mbox-ok-button');
                    template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');
                    break;

                case 'confirm':
                    buttons = core.gen_button('light-blue darken-2', locale.OK, 'mbox-ok-button');
                    buttons += core.gen_button('grey darken-2', locale.CANCEL, 'mbox-cancel-button');
                    template = template.replace(/\$\$\$_input_\$\$\$/gi, '<hr />');
                    break;

                case 'prompt':
                    buttons = core.gen_button('light-blue darken-2', locale.OK, 'mbox-ok-button');
                    buttons += core.gen_button('grey darken-2', locale.CANCEL, 'mbox-cancel-button');
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

            // focus the button
            $('.mbox-wrapper .mbox-ok-button').focus();
        },

        close: function () {
            // hide the box
            var close_speed = core.options.close_speed;
            $('.mbox')
                .fadeOut(close_speed, function () {
                    $(this).closest('.mbox-wrapper').remove();
                });

            // allow scrolling on body again
            $('body').removeClass('mbox-open');

            // unbind all the mbox buttons
            $('.mbox-button').unbind('click');
        },

        parse_args: function (args) {
            var args = [].slice.call(args);

            var ret = {
                message: null,
                cb: null
            }

            args.forEach(function (arg) {
                if (typeof arg === 'string') ret.message = arg;
                if (typeof arg === 'function') ret.cb = arg;
                if (typeof arg === 'object') core.process_options(arg);
            }, this);

            return ret;
        },

        process_options: function (options) {
            Object.keys(options).forEach(function (key) {
                core.options[key] = options[key];
            }, this);
        },


        gen_button: function (color, text, type) {
            return '&nbsp;<button ' +
                'type="button" ' +
                'class="mbox-button ' + type + ' ' +
                'waves-effect waves-light btn ' + color + '">' + text +
                '</button>';
        }
    };
    //Make sure that we expose only the public api(not sure about close() though)
    return {
        alert: core.alert,
        confirm: core.confirm,
        prompt: core.prompt,
        custom: core.custom,
        add_locale: core.add_locale,
        set_locale: core.set_locale,
        close: core.close,
        set_open_speed: core.set_open_speed,
        set_close_speed:core.set_close_speed
    }
})(jQuery);
## Mbox - Materialize Box Maker

Mbox is a quick, simple, lightweight solution to creating Alert, Confirmation, Prompt, and Custom dialogs. Inspired in many ways by [bootbox.js for Bootstrap](https://github.com/makeusabrew/bootbox), Mbox is designed to work in the same way, but with [MaterializeCSS](https://github.com/dogfalo/materialize) as its frontend framework.

Mbox is not a DOM terrorist. Whatever windows and wrappers it creates, it removes them once they are done being used.

#### CDN
```html
<link href="//cdn.bri.io/mbox/dist/mbox-0.0.2.min.css" rel="stylesheet">
<script src="//cdn.bri.io/mbox/dist/mbox-0.0.2.min.js"></script>
```

#### Dependencies
- [MaterializeCSS](https://github.com/dogfalo/materialize)
- jQuery 1.7.2+

### Basic Usage

__Alert__
```js
/**
 * signature: mbox.alert(message[, options[, callback]])
 * message: the message to show the users
 * options[optional]: an object of options (see mbox.custom for options and defaults)
 * callback[optional]: a function to execute after the user clicks 'Ok'
 */

// minimal usage
mbox.alert('Oh noes! You cannot do that right now!')
```

__Confirm__
```js
/**
 * signature: mbox.confirm(message[, options[, callback]])
 * message: the message to show the users
 * options[optional]: an object of options (see mbox.custom for options and defaults)
 * callback[optional]: a function to execute after the user clicks 'Ok'
 */

// minimal usage
mbox.confirm('Drugs are bad, are you sure you want to use them?', function(yes) {
    if (yes) {
        console.log('You took the drugs :(')
    }
})
```

__Prompt__
```js
/**
 * signature: mbox.prompt(message[, options[, callback]])
 * message: the message to show the users
 * options[optional]: an object of options (see mbox.custom for options and defaults)
 * callback[optional]: a function to execute after the user clicks 'Ok'
 */

// minimal usage
mbox.prompt('Did you star Mbox yet? (yes/no)', function(answer) {
    if (answer === 'yes') {
        console.log('Rock on...')
    } else {
        console.log('Shame')
    }
})
```

__Custom__
```js
/**
 * signature: mbox.custom(configuration)
 * configuration: all options to configure a custom mbox modal
 */
mbox.custom({
    message: 'What is your favorite type of pie?',
    options: {},
    buttons: [
        {
            label: 'Pumpkin',
            color: 'orange darken-2',
            callback: function() {
                mbox.alert('Pumpkin is your favorite')
            }
        },
        {
            label: 'Apple',
            color: 'red darken-2',
            callback: function() {
                mbox.alert('Apple is your favorite')
            }
        }
    ]
})
```

__Options__
Options can be set anywhere `options` appears in the method signature or globally like so:
```js
// all options with defaults
mbox.global.options.open_speed = 0; // how fast the modal opens in milliseconds
mbox.global.options.close_speed = 0; // how fast the modal closes in milliseconds
```

__Locales__

By default mbox comes with the the following locales:
* English (en)
* Greek (el)
* Italian (it)
* German (de)
* Portuguese (pt)

To add a new locale you need to provide the name of the locale and the translations for the OK and CANCEL button like this
```js
mbox.addLocale('pt', {
    OK: 'Está bem',
    CANCEL: 'cancelar'
})
```

To set a locale from the available locales just call mbox.setLocale with the name of the locale as argument like this
```js
mbox.setLocale('pt');
```

__Change Log__
- 2017-08-27: 0.0.3: Configurable modal open/close speed (@ebrian)
- 2017-08-26: 0.0.2: Locale support (@kounelios13)
- 2015-12-13: 0.0.1: Initial (@ebrian)

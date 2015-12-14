## Mbox - Materialize Box Maker

Mbox is a quick, simple, lightweight solution to creating Alert, Confirmation, Prompt, and Custom dialogs. Inspired in many ways by [bootbox.js for Bootstrap](https://github.com/makeusabrew/bootbox), Mbox is designed to work in the same way, but with [MaterializeCSS](https://github.com/dogfalo/materialize) as its frontend framework.

Mbox is not a DOM terrorist. Whatever windows and wrappers it creates, it removes them once they are done being used. Mbox isolates itself in a self-executing function, with `jQuery` as its parameter, so even if you don't use `$`, it will still work fine.

#### Dependencies
- [MaterializeCSS](https://github.com/dogfalo/materialize)
- jQuery 1.7.2+

#### Basic Usage

__Alert__
```js
mbox.alert('Oh noes! You cannot do that right now!')
```

__Confirm__
```js
mbox.confirm('Drugs are bad, are you sure you want to use them?', function(yes) {
    if (yes) {
        console.log('You took the drugs :(')
    }
})
```

__Prompt__
```js
mbox.prompt('Did you star Mbox yet? (yes/no)', function(answer) {
    if (answer === 'yes') {
        console.log('Rock on...')
    } else {
        console.log('Shame');
    }
})
```

__Custom__
```js
// todo
```

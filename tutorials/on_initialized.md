# The onInitialized Element option
In {@tutorial simplest} a case was shown where a certain action needs to be done only once - when the Element is initialized.

The implementation of that logic we repeat here:
```javascript
    logic: [{
      triggers: '.:initialized',
      references: '.',
      handler: function (myself, initialized) {
        if (!initialized) {
          //do nothing if I'm still not initialized
          return;
        }
        toggleActual(myself);
      }
    }]
```

However, this functionality can be achieved more elegantly using the `onInitialized` option.

Here is the App descriptor from {@tutorial simplest} written using the `onInitialized` option:
```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'blinker',
    options: {
      onInitialized: toggleActual
    }
  }]
}
```

## Wrapping it all up
If you have a function `myinit` that takes an Element instance and performs
some actions on it once the instance is initialized, it is easier to write a descriptor like
```javascript
{
  name: 'whatever',
  type: 'whatever',
  options: {
    onInitialized: myinit
  }
}
```

than like
```javascript
{
  name: 'whatever',
  type: 'whatever',
  logic: [{
    triggers: '.:initialized',
    references: '.',
    handler: function (myself, initialized) {
      if (!initialized) {
        return;
      }
      myinit(myself);
    }
  }]
}
```

# Making a custom WebElement

This is a more low-level approach to WebApp development.
It boils down to creating a new type of an Element through inheritance from BasicElement or one of its descendants (most likely, the WebElement).

It should be used primarily in cases when the desired functionality cannot be achieved through descriptors.

However, for educational purposes, we will here create a new Element class that will exhibit the Blinker functionality.

If you study the {@tutorial blinker_modifier}, you will see that finally the Modifier code became extremely simple.
The modifications on the descriptor that the BlinkerModifier finally does require just pushing an element descriptor into the descriptor's `elements` array.

Here we will now produce a new class, BlinkingWebElement, that will exhibit the same behavior -
periodically hide/show the DOM element it is attached to.

Note that the Modifier approach allows for more configurability, because with the Modifier approach the App developer can even specify the Element type that will be created.
Therefore, the Modifier approach could allow for blinking Forms, Data Tables, etc.
So, we note again that the BlinkingElement is built here for educational purposes only, and is _not_ the optimal approach to achieving the blinking behavior on a DOM element.

## Step 1. Inherit from WebElement
```javascript
  var lib = execlib.lib, //the basic ALLEX library
    applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
    WebElement = applib.getElementType('WebElement'); //the WebElement

  function BlinkerElement (id, options) {
    WebElement.call(this, id, options);
  }
  lib.inherit (BlinkerElement, WebElement);
```

## Step 2. Register the new Element type
The new Element type will be registered under the name `BlinkerWebElement`.
```javascript
  var lib = execlib.lib, //the basic ALLEX library
    applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
    WebElement = applib.getElementType('WebElement'); //the WebElement

  function BlinkerElement (id, options) {
    WebElement.call(this, id, options);
  }
  lib.inherit (BlinkerElement, WebElement);
  applib.registerElementType('BlinkerWebElement', BlinkerElement);
```

## Step 3. Implement the blinking behavior
As seen in {@tutorial on_initialized} and {@tutorial blinker_modifier},
the optimal point to introduce the blinking behavior is when the Element is initialized.
When going low-level, this point is implemented in the `WebElement`'s `initialize` method that consists of two steps:
```javascript
  WebElement.prototype.initialize = function () {
    this.createjQueryElement();
    BasicElement.prototype.initialize.call(this);
  };
```
1. Create the jQuery element.
2. Let the base class `BasicElement` perform its initialization sequence.

Our point of interest is after these two steps -
when the whole `WebElement`'s `initialize` method is over.

Therefore, we'll override the `initialize` method in order to
1. Let the base class `WebElement` perform its `initialize` sequence.
2. Start the blinking loop.

```javascript
var lib = execlib.lib, //the basic ALLEX library
  applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
  WebElement = applib.getElementType('WebElement'); //the WebElement

function toggleActual(element) {
  element.set('actual', !element.get('actual'));
  lib.runNext(toggleActual.bind(null, element), lib.intervals.Second);
}

function BlinkerElement (id, options) {
  WebElement.call(this, id, options);
}
lib.inherit (BlinkerElement, WebElement);
BlinkerElement.prototype.initialize = function () {
  WebElement.prototype.initialize.call(this);
  toggleActual(this);
};
applib.registerElementType('BlinkerWebElement', BlinkerElement);
```

## Step 4. Use the `BlinkingWebElement` in the App descriptor
```javascript
{
  elements: [{
    type: 'BlinkerWebElement',
    name: 'Blinker',
    options: {
      actual: true,
      default_markup: '<div>Blink!</div>'
    }
  }]
}
```

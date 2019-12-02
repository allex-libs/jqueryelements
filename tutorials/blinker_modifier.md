# Blinker Modifier
In {@tutorial simplest} and {@tutorial link_two_elements} a blinking span was being used,
so a lot of code was reused between these two tutorials.

In this tutorial we will show how to make reusable code that produces a blinking DOM element.
Of course, due to the nature of {@tutorial attaching}, the very type of the DOM element will
be irrelevant.

## A brief introduction to Modifiers
A Modifier is a class that can be instantiated so that the instance will modify
the given descriptor.

Writing modifiers asks for a thorough understanding of the descriptor layout.

For more info, see {@link allex://allex_applib.BasicModifier}

## Write a custom modifier
First of all, for the sake of clarity, let's note that we shall write the whole code
inside an {@link http://benalman.com/news/2010/11/immediately-invoked-function-expression/|Immediately Invoked Function Expression}:

```javascript
(function (execlib) {
  'use strict';
  //code goes here
})(ALLEX));
```

in order to isolate our code from the global namespace.
We shall be using the variable name `execlib` instead of `ALLEX`.

Typically, writing a custom Modifier comprises the following steps:

### Inherit from BasicModifier
```javascript
{
  var lib = execlib.lib, //the basic ALLEX library
    applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
    BasicModifier = applib.BasicModifier; //the BasicModifier

  function BlinkerModifier (options) {
    BasicModifier.call(this, options);
  }
  lib.inherit(BlinkerModifier, BasicModifier); //BlinkerModifier now inherits from BasicModifier
```

### Implement the DEFAULT_CONFIG
```javascript
  BlinkerModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };
```

### Implement the doProcess
```javascript
  BlinkerModifier.prototype.doProcess = function (name, options, links, logic, resources) {
    options.elements.push({
      type: this.getConfigVal('type') || 'WebElement',
      name: this.getConfigVal('name') || 'blinker',
      options: this.getConfigVal('options') || null,
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
    });
  };
```
This implementation refers to the function
```javascript
  function toggleActual(element) {
    element.set('actual', !element.get('actual'));
    lib.runNext(toggleActual.bind(null, element), lib.intervals.Second);
  }
```

### Register the modifier
We shall use the `Blinker` name for the registration
```javascript
  applib.registerModifier('Blinker', BlinkerModifier);
```

## The final Modifier code
Putting it all together brings us to
```javascript
(function (execlib) {
  'use strict';

  var lib = execlib.lib, //the basic ALLEX library
    applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
    BasicModifier = applib.BasicModifier; //the BasicModifier

  function toggleActual(element) {
    element.set('actual', !element.get('actual'));
    lib.runNext(toggleActual.bind(null, element), lib.intervals.Second);
  }

  function BlinkerModifier (options) {
    BasicModifier.call(this, options);
  }
  lib.inherit(BlinkerModifier, BasicModifier); //BlinkerModifier now inherits from BasicModifier
  BlinkerModifier.prototype.doProcess = function (name, options, links, logic, resources) {
    options.elements.push({
      type: this.getConfigVal('type') || 'WebElement',
      name: this.getConfigVal('name') || 'blinker',
      options: this.getConfigVal('options') || null,
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
    });
  };
  BlinkerModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('Blinker', BlinkerModifier);
})(ALLEX);
```

## Using the modifier in an App descriptor
Now we can use the `Blinker` Modifier we built in an App descriptor.

### A single blinker App
The {@tutorial simplest} can now be written this way:

HTML markup:
``` html
<html>
  <body>
    <span id="blinker">The Span</span>
  </body>
</html>
```

App descriptor:
```javascript
{
  modifiers: ['Blinker']
}
```
In this case, we provide no configuration for the `Blinker` Modifier instance.

### A single blinker App - using the markup in the Modifier configuration
A Web app with the same behavior as the previous one can be built using the `default_markup`
option for the `blinker` Element we want to create.

Therefore, we write no span in the markup:
``` html
<html>
  <body>
  </body>
</html>
```

But we have to provide the configuration for the `Blinker` modifier instance
in the App descriptor:
```javascript
{
  modifiers: [{
    name: 'Blinker',
    options: {
      options: {
        default_markup: '<div id="blinker">Blinker</div>'
      }
    }
  }]
}
```
In this case, the Modifier's line of code
```javascript
      options: this.getConfigVal('options') || null,
```
will prove useful, because `this.getConfigVal('options')` will evaluate to

```javascript
{
  default_markup: '<div id="blinker">Blinker</div>'
}
```

### Two linked Elements
Having all said in mind, here's an App that links two Elements just like {@tutorial link_two_elements} does:

HTML markup:
``` html
<html>
  <body>
  </body>
</html>
```

App descriptor:
```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'follower',
    options: {
      default_markup: '<div>The Other Span</div>'
    }
  }],
  modifiers: [{
    name: 'Blinker',
    options: {
      options: {
        default_markup: '<div>The Blinker Span</div>'
      }
    }
  }],
  links: [{
    source: 'element.blinker:actual',
    target: 'element.follower:actual',
    filter: function (blinker_actual) {
      return !blinker_actual;
    }
  }]
}
```
Important thing to note here is that the __link__ is written just the same
as in {@tutorial link_two_elements}.
In other words, the link assumes the existence of the `element.blinker`.

The assumption is valid, because the `Blinker` Modifier will be activated before the link is created.

But, how come the `Blinker` Modifier produces the Element named exactly `blinker`?
The answer lies in this line of Modifier code:
```javascript
      name: this.getConfigVal('name') || 'blinker',
```

Therefore, if we wanted the `blinker` Element to be named `myblinker` instead,
the App descriptor would be:
```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'follower',
    options: {
      default_markup: '<div>The Other Span</div>'
    }
  }],
  modifiers: [{
    name: 'Blinker',
    options: {
      name: 'myblinker',
      options: {
        default_markup: '<div>The Blinker Span</div>'
      }
    }
  }],
  links: [{
    source: 'element.myblinker:actual',
    target: 'element.follower:actual',
    filter: function (blinker_actual) {
      return !blinker_actual;
    }
  }]
}
```

## Modifier code with the onInitialized option
Using the knowledge from {@tutorial on_initialized}, we rewrite the Modifier code as
```javascript
(function (execlib) {
  'use strict';

  var lib = execlib.lib, //the basic ALLEX library
    applib = execlib.execSuite.libRegistry.get('allex_applib'), //the allex_applib
    BasicModifier = applib.BasicModifier; //the BasicModifier

  function toggleActual(element) {
    element.set('actual', !element.get('actual'));
    lib.runNext(toggleActual.bind(null, element), lib.intervals.Second);
  }

  function BlinkerModifier (options) {
    BasicModifier.call(this, options);
  }
  lib.inherit(BlinkerModifier, BasicModifier); //BlinkerModifier now inherits from BasicModifier
  BlinkerModifier.prototype.doProcess = function (name, options, links, logic, resources) {
    options.elements.push({
      type: this.getConfigVal('type') || 'WebElement',
      name: this.getConfigVal('name') || 'blinker',
      options: lib.extend({onInitialized: toggleActual}, this.getConfigVal('options'))
    });
  };
  BlinkerModifier.prototype.DEFAULT_CONFIG = function () {
    return {};
  };

  applib.registerModifier('Blinker', BlinkerModifier);
})(ALLEX);
```

What have we done here?
1. We want the `options` for the Element we're about to create to have the `onInitialized` set to `toggleActual`
2. We want to allow the descriptor developer to override our `onInitialized: toggleActual` (theoretically, that doesn't seem like a good idea, but we _can_ allow for such a case)

This functionality is achieved through the line of code
```javascript
      options: lib.extend({onInitialized: toggleActual}, this.getConfigVal('options'))
```

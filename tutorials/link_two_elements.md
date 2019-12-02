# Linking Two Elements
In this tutorial, we will attach our App to two Elements, and make a __link__ that will make one Element hide when the other is shown.

This tutorial builds on {@tutorial simplest}, that showed how to make a `<span>` show/hide once a second.

Now we will introduce another `<span>` with ID `follower` that will show when `blinker` is hidden and vice versa.

## html markup
The html markup contains two spans, with IDs `blinker` and `follower`.
``` html
<html>
  <body>
    <span id="blinker">The Blinker Span</span>
    <span id="follower">The Other Span</span>
  </body>
</html>
```

## Initial App descriptor
First the App descriptor from {@tutorial simplest}, with the Element `follower` added:
```javascript
function toggleActual(element) {
  element.set('actual', !element.get('actual'));
  ALLEX.lib.runNext(toggleActual.bind(null, element), ALLEX.lib.intervals.Second);
}
{
  elements: [{
    type: 'WebElement',
    name: 'blinker',
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
  },{
    type: 'WebElement',
    name: 'follower'
  }]
}
```
Now a descriptor with the same functionality, but with knowledge about {@tutorial on_initialized}:
```javascript
function toggleActual(element) {
  element.set('actual', !element.get('actual'));
  ALLEX.lib.runNext(toggleActual.bind(null, element), ALLEX.lib.intervals.Second);
}
{
  elements: [{
    type: 'WebElement',
    name: 'blinker',
    options: {
      onInitialized: toggleActual
    }
  },{
    type: 'WebElement',
    name: 'follower'
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
## App descriptor with the link
Now we write a simple link, that needs to logically connect the two elements.

The source of the link will be the `actual` property of the `blinker`.

The target of the link will be the `actual` property of the `follower`.

Because `actual` of the `blinker` should be propagated to `actual` of the `follower` in its negated form,
we introduce the `filter` that will return the negation.

Of cource, because this link needs access to both `blinker` and `follower`,
the link has to be placed in the construct that contains both `blinker` and `follower`
- in our case it is the App itself.

```javascript
function toggleActual(element) {
  element.set('actual', !element.get('actual'));
  ALLEX.lib.runNext(toggleActual.bind(null, element), ALLEX.lib.intervals.Second);
}
{
  elements: [{
      type: 'WebElement',
      name: 'blinker',
      options: {
        onInitialized: toggleActual
      }
    }]
  },{
    type: 'WebElement',
    name: 'follower'
  }],
  links: [{
    source: 'elements.blinker:actual',
    target: 'elements.follower:actual',
    filter: function (blinker_actual) {
      return !blinker_actual;
    }
  }]
}
```


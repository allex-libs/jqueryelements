# A Simplest Web App

In this tutorial, we will
1. Write the html markup with one `<span>`
2. Write an App descriptor to attach to the `<span>` in the markup
3. Improve the App descriptor to make the `<span>` appear/disappear
(show/hide) once in a second

## Write the html markup
``` html
<html>
  <body>
    <span id="blinker">The Span</span>
  </body>
</html>
```

As you can see, nothing special here, except for the `id="blinker"` of the `span`.

This `id` will be used by the App to find the WebElement it should attach to.

## Write an App descriptor
```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'blinker'
  }]
}
```

This should be the simplest App descriptor that does something.

In this case, it attaches itself to a DOM element that has an `id="blinker"` (because of the `name: 'blinker'`). More on different ways to attach to a DOM element can be found in {@tutorial attaching}.

It should be noted that after attaching, the element will be invisible. More on Element visibility can be found in {@tutorial actual}.

## Hiding/Showing the Element
In order to do something with an Element we attached to, we have to write a bit of __logic__.

The logic allows the App developer to grab a reference to one or more App constructs (these may be Elements, DataSources, DataCommands), and do something to it.

In our trivial case, we just need a reference to the `blinker` Element, so that we can hide/show it.
Therefore, this logic can be written as a part of the `blinker`'s Element descriptor:

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
  }]
}
```

Some details here might need an explanation:

| Detail | Explanation | Further reading |
| :----- | :---------- | :-------------- |
| `.:initialized` | when my (.) property (:) named `initialized` is available | {@tutorial descriptor_strings} |
| `ALLEX.lib.runNext` | Prefer this function to `setTimeout` | |
| `ALLEX.lib.intervals.Second` | This evaluates to 1000 (msec, of course). Besides `Second`, there are also `Minute`, `Hour` and `Day` available | |
| `actual` | The visibility of the Element  | {@tutorial actual} |

## Further reading
{@tutorial on_initialized} will show you how to perform initialization procedures in a 
more elegant fashion.

{@tutorial link_two_elements} will show you how to introduce interaction among Elements.

{@tutorial blinker_modifier} will show you how to make a Modifier for a blinking DOM element, and thereby produce reusable code.

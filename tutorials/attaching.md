# Attaching an App to DOM elements

For the purpose of this tutorial, let's assume we want to attach an App to a DOM element named `myfavoriteelement`.
Moreover, without losing the generality of the tutorial, let's assume that the DOM element we'll be attaching to is a `<div>`.

There are three different ways to attach an App to a DOM element.

For each of the three, the markup and the App descriptor will be shown.

## Attaching to the DOM element ID
```html
<html>
  <body>
  ...
    <div id="myfavoriteelement">I'm the one!</div>
  ...
  <div 
</html>
```

```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'myfavoriteelement'
  }]
}
```

## Attaching to the DOM element class
```html
<html>
  <body>
  ...
    <div class="myfavoriteelement">I'm the one!</div>
  ...
  <div 
</html>
```

```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'myfavoriteelement',
    options: {
      self_selector: '.'
    }
  }]
}
```

## Attaching to the DOM element attribute
```html
<html>
  <body>
  ...
    <div myspecialattribute="myfavoriteelement">I'm the one!</div>
  ...
  <div 
</html>
```

```javascript
{
  elements: [{
    type: 'WebElement',
    name: 'myfavoriteelement',
    options: {
      self_selector: 'attrib:myspecialattribute'
    }
  }]
}
```

## Wrapping it all up
App can attach to a DOM element by using its ID, its class or its attribute. The very type of the DOM element is completely irrelevant.

If the DOM element specified in the App descriptor is not found, an exception is thrown and the App will not be loaded.

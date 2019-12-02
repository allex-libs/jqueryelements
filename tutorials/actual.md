# The `actual` property
This is the only property handled by the {@link allex://allex_applib.BasicElement}.
It was built into the basic {@link allex://allex_applib} library with an intention
that all classes inheriting from BasicElement will have its own ways of handling it.

In the {@link allex://allex_jqueryelementslib} the `actual` property is handled as the
visibility of the WebElement that inherits from BasicElement.

Therefore, 
```javascript
element.set('actual', true);
```
shows the `element`,
and
```javascript
element.set('actual', false);
```
hides the `element`.

## Initial actual value
By default, the value of `actual` is `false`.
In other words, by default any new WebElement will be hidden.

> There is a possible side effect regarding this default behavior.
If a DOM element is written in the markup as initially shown,
it will be hidden once the WebElement that attaches to it is constructed.
This may lead to _glitches_ - elements blinking during App boot.

If you want to force the WebElement to be shown after creation, use 
`actual: true` in its descriptor options:

```javascript
{
  type: 'WebElement', //or any other registered type
  name: 'MyElement',
  options: {
    actual: true
  }
}
```

## actual propagation
During the change of the value for `actual` (`actual`'s _transition_), it is important
to note that
> If the transition is from `false` to `true` (the element is about to be shown),
> this transition propagates upwards through the hierachy tree.

In other words,
> If the element is being shown, and it _has_ a parent, then the parent will be shown as well.

No other propagation takes place in any other `actual`'s transition.

In other words, for example, 
1. if the child is being hidden, its parent will not be hidden automatically.
2. if the parent is being shown, its children will not be shown automatically.
3. if the parent is being hidden, its children will not be hidden automatically.
4. if the child is initially shown (it has `{options: {actual: true} }`, the parent will not be shown automatically
- because there is no `actual`'s transition in this case.

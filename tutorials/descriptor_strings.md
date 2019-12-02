# Descriptor Strings

Descriptor strings are used in __logic__ and __links__ to describe:

| Where | What |
| :---- | :--- |
| logic | triggers, references |
| links | source, target |

A descriptor string may have one of the following forms:
1. \<entitypath\>
2. \<entitypath\>\<targetdescriptor\>\<targetname\>

## entitypath
This is a string that describes how to fetch an entity.
It is written differently depending of the __context__ of the entitypath.

The context of the entitypath may be the Element context or the App context.

### Element context
The Element context means that the entity path is written in an Element descriptor.
An Element can contain only one type of constructs - the elements.

In the element context, entitypath is a dot-separated path
from the Element described by the descriptor
to the element described by the entitypath.

For example

`MainPanel.HeaderPanel.UserInfo.Name`

### App context
The App context means that the entitypath is written in an App descriptor.
An App can contain different constructs:

- elements
- datasources
- commands
- datacommands

But the entitypath can refer to just two constructs:

- elements
- datasources

Therefore, the App context needs a construct type at the beginning of the entitypath.
Construct type may be

- `element`
- `datasource`

For example,
- `element.DailyReportPage.ReportPane.ReportTable`
- `datasource.Admins`

It is important to note that a datacommand can also be pointed to by an entitypath,
because datacommand acts as a data source when being fetched by an entitypath.


## targetdescriptor
Once the entity is described (and fetched) by an entitypath, its target may be further "digged into".

An entity may have the following targets:

- property
- event
- command

But, again, an App differs from an Element.

### Element targets
An Element may have the following targets:
- property
- event

### App targets
An App may have the following targets:
- property
- event
- command

These are the targetdescriptors for the corresponding targets:

| Target | targetdescriptor |
| :----- | :--------------- |
| property | `:` |
| event | `!` |
| command | `>` |

It is important to note that (in an App context) a datacommand can also be pointed to by the `>` targetdescriptor,
because datacommand acts as a command when being pointed to by `>`.

## targetname
This is a string that is the name of the particular target described by targetdescriptor.

## Examples

| descriptor string | Explanation |
| :---------------- | :---------- |
| `element.Header.CurrentTime:actual` | The `actual` property (`:`) of the `element` at `Header.CurrentTime` (App context) |
| `LowerPane.Form!submit` | The `submit` event (`!`) of the element found at `LowerPane.Form` (Element context) |
| `.>placeOrder` | The `placeOrder` command (`>`) of the App (App context only) |

## More elaborate examples
Let us take a look at hypothetical descriptors where the examples shown above may work:

### `element.Header.CurrentTime:actual` 
Because of the `element.` at the beginning of the descriptor string, we're in the App context.
The App descriptor may look like this:
```javascript
{
  elements: [{
    type: 'WebElement', //or whatever type
    name: 'Header', //obligatory
    options: {
      elements: [{
        type: 'WebElement', //or whatever type
        name: 'CurrentTime' //obligatory
      }]
  }],
  links: [{
    source: 'element.HeaderPanel:actual',
    target: 'element.HeaderPanel.CurrentTime:actual'
    //there is no filter function, so the value of HeaderPanel's actual
    //will be immediately set to CurrentTime's actual
  }]
}
```

### `LowerPane.Form!submit`
Because there is none of the `element.` or `datasource.` at the beginning
of the descriptor string, we're in the Element context for sure.
The Element descriptor may look like this:
```javascript
{
  type: 'MyCustomForm', //this type should have an event named submitted, see handler below
  name: 'TotalForm', //or whatever name
  options: {
    elements: [{
      type: 'WebElement', //or whatever type
      name: 'LowerPane', //obligatory
      options: [{
        elements: [{
          type: 'AngularFormLogic', //or whatever type that has an event named submit
          name: 'Form' //obligatory
        }]
      }]
    }]
  },
  logic: [{
    triggers: 'LowerPane.Form!submit',
    references: '.',
    handler: function (myself, evntdata) {
      //there is not much you can do with this
      //event here, in the Element context
      //because an Element has no access to commands.
      //But, this could be a nice place to bubble up the event
      myself.submitted.fire(evntdata);
    }
  }]
}
```
In the hypothetical case of the above descriptor describing an Element of `type` that has a `submitted` event,
the above descriptor could have been written in a more elegant manner:
```javascript
{
  type: 'MyCustomForm', //this type should have an event named submitted
  name: 'TotalForm', //or whatever name
  options: {
    elements: [{
      type: 'WebElement', //or whatever type
      name: 'LowerPane', //obligatory
      options: [{
        elements: [{
          type: 'AngularFormLogic', //or whatever type that has an event named submit
          name: 'Form' //obligatory
        }]
      }]
    }]
  },
  links: [{
    source: 'LowerPane.Form!submit',
    target: '.!submitted'
    //now everything that is risen by the Form's submit event
    //will be bubbled up to the be raised by the
    //root Element's submitted event
  }]
}
```

### `.>placeOrder`
First of all, let's note that this descriptor string can only appear in App context.

Second, let's take the last Element descriptor from the previous example,
and embed it into our App descriptor.

Third, let's handle the `TotalForm`'s `submitted` event and call the 
`placeOrder` command with the raised event data


```javascript
{
  environments: [{
    type: 'allexremote',
    name: 'cloud',
    options: {
      entrypoint: 'https://api.mycloud.org',
      commands: [{
        name: 'placeOrder', //the name I will use in command linking
        options: {
          sink: '.', //the method is defined on my very User Sink
          name: 'placeOneOrder' //the name of the actual method on the User Sink
        }
      }]
    }
  }],
  commands: [{
    name: 'placeOrder',
    environment: 'cloud'
    //the placeOrder command of the cloud environment
    //will be accessible in the App as placeOrder
  }],
  elements: [{
    type: 'MyCustomForm', //this type should have an event named submitted
    name: 'TotalForm', //or whatever name
    options: {
      elements: [{
        type: 'WebElement', //or whatever type
        name: 'LowerPane', //obligatory
        options: [{
          elements: [{
            type: 'AngularFormLogic', //or whatever type that has an event named submit
            name: 'Form' //obligatory
          }]
        }]
      }]
    },
    links: [{
      source: 'LowerPane.Form!submit',
      target: '.!submitted'
      //now everything that is risen by the Form's submit event
      //will be bubbled up to the be raised by the
      //root Element's submitted event
    }]
  }],
  logic: [{
    triggers: 'element.MyCustomForm!submitted',
    references: '.>placeOrder',
    handler: function (placeOrderCommand, evntdata) {
      //calling a command is always done with a single Array parameter
      //this Array parameter holds the arguments to the command
      //in their respective order
      placeOrderCommand([evntdata]);
      //obviously, placeOrder takes a single parameter
    }
  }]
}
```

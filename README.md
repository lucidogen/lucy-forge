# Lucy forge  

Currently only works with iojs.

The failing travis-ci build is related to node.js environment. [![Build Status](https://travis-ci.org/lucidogen/lucy-forge.svg)](https://travis-ci.org/lucidogen/lucy-forge)

## Entity and component definition tool

lucy.forge is a minimal 'game' or 'feature composition' engine. It's goal is to
foster clean and reusable Javascript code through the extensive use of mixins
and conventions.

### Usage example:

```js
  const forge = require ( 'lucy-forge' )

  // Define a component
  // for auto-loading, the path for this component should be 'Name.js'
  const Name = forge.Component
  ( 'Name'
  , { init ()  // This method is 'NOT' added to the entity when used but
               // it is called on entity creation. `this` is the entity
               // being created.
      { this._name = 'No name'
      }
    , name ( name )
      { this._name = name
        return this
      }
    }
  )

  // Use the component
  let player1 = forge.Entity
  ( 'Name'
  , 'Score'
  , { name: 'John Difool'
    , score: 100
    }
  )
```

## Installation

```shell
  npm install lucidogen/lucy-forge --save
```

## Tests

```shell
   make
```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release

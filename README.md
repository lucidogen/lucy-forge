# Lucy forge  [![Build Status](https://travis-ci.org/lucidogen/lucy-forge.svg)](https://travis-ci.org/lucidogen/lucy-forge)

Part of [lucidity](http://lucidity.io) project.

Beta software. Until 1.0, API subject to change.

## Entity and component definition tool

lucy.forge is a minimal 'game' or 'feature composition' engine. It's goal is to
foster clean and reusable Javascript code through the extensive use of mixins
and conventions.

## Installation

Currently only works with [**io.js**](https://iojs.org).

  ```shell
  npm install lucy-forge --save
  ```

### Usage example:

  ```Javascript
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


## Tests

  ```Shell
   make
  ```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality.

## Release History

* 0.3.0 (2015-09-04) API change for forge.Component with class methods.
* 0.2.0 (2015-09-03) Adding possibility to replace binding.
* 0.1.0 (2015-09-02) Initial release.

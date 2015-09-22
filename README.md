# Lucy forge  [![Build Status](https://travis-ci.org/lucidogen/lucy-forge.svg)](https://travis-ci.org/lucidogen/lucy-forge)

Part of [lucidity](http://lucidity.io) project.

Beta software. Until 1.0, API subject to change.

## Entity and component definition tool

lucy.forge is a minimal 'game' or 'feature composition' engine. It's goal is to
foster clean and reusable Javascript code through the extensive use of mixins
and conventions.

## Installation

  ```sh
  npm install lucy-forge --save
  ```

### Usage example:

  ```js
  const forge = require ( 'lucy-forge' )

  // Define a component
  // for auto-loading, the path for this component should be 'Person.js'
  const Person = forge.Component
  ( 'Person'
    // Class methods
  , { // Setup an entity. 'e' is the entity being initialized.
      setup ( e )
      { e._person = {}
        Person.people.push ( e )

        e.bind
        ( 'destroy'
        , function ()
          { Person.peopleCount --
          }
        )
      }

      // This is called once on Component creation. It is used to initialize
      // the component (not an entity). 'this' is the component aka 'class'.
      // Here, this === Person.
    , init ()
      { this.peopleCount = 0
      }

    , count ()
      { return this.peopleCount
      }
    }

    // Methods
  , { person ( name, age )
      { let self = this._person
        self.name = name
        self.age  = age
      }
    }
  )

  // Use the component
  let Person = forge.findComponent ( 'Person' )

  console.log
  ( Person.count () ) // ==> 0

  let player1 = forge.Entity
  ( 'Person'
  , 'Score'
    // #set shortcut
    // same as calling player1.person ( 'John Difool', 34 )
    //                 player1.score  ( 100 )
  , { person: [ 'John Difool', 34 ]  
    , score: 100
    }
  )

  console.log
  ( Person.count () ) // ==> 1
  ```


## Tests

  ```sh
  npm test 
  ```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality.

## Release History

  * 0.5.1 (2015-09-22) Fixed npm readme page.
  * 0.5.0 (2015-09-22) Better #set method, forge.merge.
  * 0.4.0 (2015-09-09) Renaming init to 'setup'. Init is now called on class.
  * 0.3.0 (2015-09-04) API change for forge.Component with class methods.
  * 0.2.0 (2015-09-03) Adding possibility to replace binding.
  * 0.1.0 (2015-09-02) Initial release.

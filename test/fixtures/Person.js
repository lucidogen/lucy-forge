'use strict'
const forge = require ( '../../index' )

module.exports = forge.Component
( 'Person'
  // Class methods
, { setup ( e )
    { // 'this' is the Person class
      let self = this
      // If a component depends on other components, we simply 'add' them in the
      // init method. Adding a component more then once is ok.
      e.addComponent ( 'Name' )
      e._age = 0

      e.bind
      ( 'destroy'
      , function ()
        { self.personCount--
        }
      )

      self.personCount++
    }
  , count ()
    { return this.personCount
    }
  , init ()
    { this.personCount = 0
    }
  }

  // Methods added to entities
, { age ( age )
    { this._age = age
      return this
    }
  , setPerson ( name, age ) // To test multiple arguments
    { this.name ( name )
      this.age  ( age  )
    }
  , contactCard ()
    { return `name: ${this._name}, age: ${this._age}`
    }
  }

)


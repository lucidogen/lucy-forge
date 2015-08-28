const forge = require ( '../../index' )

module.exports = forge.Component
( 'Person'
, { init ()
    { // If a component depends on other components, we simply 'add' them in the
      // init method. Adding a component more then once is ok.
      this.addComponent ( 'Name' )
      this._age = 0
    }
  , age ( age )
    { this._age = age
      return this
    }
  , contactCard ()
    { return `name: ${this._name}, age: ${this._age}`
    }
  }
)


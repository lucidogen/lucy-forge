const forge = require ( '../../index' )

module.exports = forge.Component
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

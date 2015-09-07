const forge = require ( '../../index' )

module.exports = forge.Component
( 'Name'
  // Class methods
, { setup ( e )
    { e._name = 'No name'
    }
  }
  // Methods
, { name ( name )
    { this._name = name
      return this
    }
  }
)

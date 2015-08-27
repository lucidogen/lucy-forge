'use strict'
const forge = require ( '../index' )
const findComponent = forge.findComponent

// PRIVATE

const _copyCompMethods = function ( source )
{ for ( let key in source )
  { if ( key != '_forge' && key != 'init' && key != 'type' )
    { if ( source.hasOwnProperty ( key ) )
      { this [ key ] = source [ key ]
      }
    }
  }
}

// PUBLIC
module.exports = forge.Component
( 'Core'
, { _init () // Special case for Core.init to avoid calling it twice
             // once before and once inside #addComponent.
    { this._core = { components: [] }
    }

  , addComponent ( compName )
    { let comp  = findComponent ( compName )
      let components = this._core.components
      let readd = components.indexOf ( comp._forge.name ) !== -1

      _copyCompMethods.call ( this , comp )

      // Do not call init or components.push more then once
      if ( !readd )
      { if ( comp.init )
        { comp.init.call ( this )
        }

        comp.entities.push ( this )
        components.push ( comp._forge.name )
      }
    }

  , has ( compName )
    { return this._core.components.indexOf ( compName ) !== -1
    }
   
  , _copyCompMethods
  }
)

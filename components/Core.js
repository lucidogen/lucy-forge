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
    { this._core = { compNames: [] }
    }

  , addComponent ( compName )
    { let comp  = findComponent ( compName )
      let compNames = this._core.compNames
      let readd = compNames.indexOf ( comp._forge.name ) !== -1

      _copyCompMethods.call ( this , comp )

      // Do not call init or components.push more then once
      if ( !readd )
      { if ( comp.init )
        { comp.init.call ( this )
        }

        comp.entities.push ( this )
        compNames.push ( comp._forge.name )
      }
    }

  , has ( compName )
    { return this._core.compNames.indexOf ( compName ) !== -1
    }
   
  , destroy ()
    { let compNames = this._core.compNames
      let knowncomps = forge.components ()

      for ( let i = 0, len = compNames.length; i < len; i++ )
      { let comp = knowncomps [ compNames [ i ] ]
        let entities = comp.entities
        let idx = entities.indexOf ( this )
        if ( idx !== -1 )
        { entities.splice ( idx, 1 )
        }
      }

      this._core.compNames = []
    }

  , _copyCompMethods
  }
)
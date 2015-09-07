'use strict'
const forge = require ( '../index' )
const findComponent = forge.findComponent

// PRIVATE

const shift = Array.prototype.shift
const _merge = forge._merge

// PUBLIC
module.exports = forge.Component
( 'Core'
  // Class methods
, { makeEntity ( args )
    { let self =
      { type: 'forge.Entity'
      , _core:
        { compNames: []
        , callbacksByEvent: {} // maps event => callback array
        }
      }
      return self
    }
  }
  // Methods
, { addComponent ( compName )
    { let comp  = findComponent ( compName )
      let compNames = this._core.compNames
      // re-add
      let readd = compNames.indexOf ( comp._forge.name ) !== -1

      _merge ( this, comp.methods )

      // Do not call setup or components.push more then once
      if ( ! readd )
      { if ( comp.setup )
        { comp.setup ( this )
        }

        comp.entities.push ( this )
        compNames.push ( comp._forge.name )
      }
    }

  , addComponents ( /* string list */ )
    { let len = arguments.length
      let set = arguments [ len - 1 ]
      if ( typeof set === 'object' )
      { len--
      }
      else
      { set = null
      }

      for ( let i = 0; i < len; i++ )
      { this.addComponent ( arguments [ i ] )
      }

      if ( set )
      { this.set ( set )
      }
    }

  // Call multiple methods. Method call order is undefined. This pattern makes
  // it easy to setup objects without the 'chain methods by returning this'
  // hack.
  , set ( definition )
    { for ( let key in definition )
      { if ( definition.hasOwnProperty ( key ) )
        { let method = this [ key ]
          if ( !method )
          { throw new Error
            ( `Cannot set '${key}' (no method with this name).` )
          }

          let args = definition [ key ]
          if ( args instanceof Array )
          { method.apply ( this, args )
          }
          else
          { method.call ( this, args )
          }
        }
      }
    }

  , has ( compName )
    { return this._core.compNames.indexOf ( compName ) !== -1
    }
   
  , destroy ()
    { if ( arguments.length == 1 )
      { let c = arguments [ 0 ]
        if ( c )
        { c.destroy ()
        }
        return
      }

      let compNames = this._core.compNames
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
      this.emit ( 'destroy' )
    }
    
    // Passing a previous callback to `bind` replaces this callback instead
    // of adding a new one.
  , bind ( event, callback )
    { let replacedCallback = null

      if ( typeof event === 'function' )
      { // update existing binding with new callback
        replacedCallback = event
        event = replacedCallback.event
      }

      if ( ! callback )
      { callback = function () {}
      }
      callback.event = event

      let callbacksByEvent = this._core.callbacksByEvent
      let callbacks = callbacksByEvent [ event ]
      if ( ! callbacks )
      { callbacksByEvent [ event ] = callback
      }
      else if ( typeof callbacks === 'function' )
      { if ( replacedCallback )
        { callbacksByEvent [ event ] = callback
        }
        else
        { callbacksByEvent [ event ] = [ callbacks, callback ]
        }
      }
      else
      { if ( replacedCallback )
        { let i = callbacks.indexOf ( replacedCallback )
          if ( i < 0 )
          { throw new Error
            ( `Invalid function passed to replace callback.` )
          }
          callbacks [ i ] = callback
        }
        else
        { callbacks.push ( callback )
        }
      }

      return callback
    }

  , emit ( )
    { let event = shift.call ( arguments )
      let callbacks = this._core.callbacksByEvent [ event ]
      if ( ! callbacks ) return
      if ( typeof callbacks === 'function' ) // single listener optimization
      { callbacks.apply ( this, arguments )
      }
      else
      { for ( let i = 0, len = callbacks.length; i < len; i++ )
        { callbacks [ i ]
          .apply ( this, arguments )
        }
      }
    }
  }
)


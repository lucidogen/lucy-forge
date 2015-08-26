/*
  # Lucy forge

  Entity and component definition tool

  lucy.forge is a minimal 'game' or 'feature composition' engine. It's goal is
  to foster clean and reusable Javascript code through the extensive use of
  mixins and conventions.

  ## Usage example:

  ```js
    const forge = require('lucy-forge')

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
    )
    .name  ( 'John Difool' )
  ```
*/
'use strict'
const caller = require ( 'caller' )
const path   = require ( 'path'   )
const fs     = require ( 'fs'     )

const lib = {}

/////////////////////////////// Private

const loadPaths  = []
const components = {}

const dirFromCaller = function ( caller_id ) {
  return path.dirname
  ( path.resolve
    ( caller_id.substr
      ( caller_id.indexOf ( ':' ) + 1
      )
    )
  )
}

const statPath = function ( path )
{ try
  { let s = fs.statSync ( path )
    if ( s.isFile ()      ) return 'f'
    if ( s.isDirectory () ) return 'd'
    return 'o' // other
  }
  catch (e)
  { return ''  // not found
  }
}


const typeToName =
{ d: 'directory'
, f: 'file'
}

const resolvePath = function ( aPath, paths, type )
{ let start_i = 0
  if ( aPath.substr ( 0, 1 ) == '/' )
  { start_i = -1
    paths   = []
  }

  for ( let i = start_i, len = paths.length; i < len; ++i )
  { let p = i == -1 ? aPath : ( paths [ i ] + '/' + aPath )
    p = path.resolve ( p )
    let info = statPath ( p )
    if ( info == type )
    { return p
    }
    else if ( info != '' ) 
    { // exist but is not of the correct type
      throw new Error
      ( `Path '${p}' is not a ${ typeToName [type] }.` )
    }
  }

  throw new Error
  ( `Cannot resolve '${path}' (not found).` )
}


/////////////////////////////// Public

/** Add a path to search for components.
 */
lib.addLoadPath = function ( path )
{ let dirname = dirFromCaller ( caller () )
  let lpath   = resolvePath ( path, [ dirname ], 'd' )

  if ( loadPaths.indexOf ( lpath ) === -1 )
  { loadPaths.push ( lpath )
  }
}

/** List load paths.
 */
lib.loadPaths = function ()
{ return loadPaths.slice ( 0 )
}

/** Return an object with all known (loaded) components.
 */
lib.components = function ()
{ return components
}

/* Create a new component.
 *
 */
lib.Component = function ( name, definition )
{ let self = components [ name ] || {}
  components [ name ] = self
  let info = self._info || {}
  info.name = name
  self._info = info

  self.type = 'forge.Component'

  definition = definition || {}

  for ( let key in definition )
  { if ( definition.hasOwnProperty ( key ) )
    { self [ key ] = definition [ key ]
    }
  }
  return self
}

lib.Entity = function ()
{

}

module.exports = lib

# Thoughts inspired by Crafty.js

## listen and emit events
One component can emit events (blindly) and another will react to this event by
listening for it. For example, the Color component might emit 'redraw' and the
rendering component would update the color by listening to this event.

  // A Component handling color
  module.exports = forge.Component
  ( 'Color'
  , { init ()  // This method is 'NOT' added to the entity when used but
               // it is called on entity creation. `this` is the entity
               // being created.
      { this._color = { r: 0, g: 0, b: 0 }
        this.emit ( 'color', this._color )
      }
    , color ( r, g, b )
      { this._color = { r, g, b }
        this.emit ( 'color', this._color )
        return this
      }
    }
  )

And here is a dummy 3D component that would use the information provided by the
'color' event.

  module.exports = forge.Component
  ( 'THREE.Mesh'
  , { init ()
      { let mesh   = ...
        this._mesh = mesh

        this.listen
        ( 'color'
        , function ( c )
          { mesh.uniforms.color = [ c.r, c.g, c.b ]
          }
        )
      }
    }
  )

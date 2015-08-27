'use strict'

require ( 'chai' )
.should ()

const forge = require ( '../index' )
const path  = require ( 'path' )
const base  = path.resolve ( __dirname, 'fixtures' )


describe ( 'forge'
, function ()
  { describe
    ( '#addLoadPath'
    , function ()
      { it
        ( 'should add load path'
        , function ()
          { let p = './fixtures'
            forge.addLoadPath ( p )

            forge.loadPaths ()
            .should
            .deep.equal
            ( [ __dirname + '/fixtures'
              ]
            )
          }
        )

        it
        ( 'should not add path twice'
        , function ()
          { let p = './fixtures'
            forge.addLoadPath ( p )
            forge.addLoadPath ( p )

            forge.loadPaths ()
            .should
            .deep.equal
            ( [ __dirname + '/fixtures'
              ]
            )
          }
        )

        it
        ( 'should check path validity'
        , function ()
          { let p = './badpath'
            let f = function ()
            { forge.addLoadPath ( p )
            }
            f.should.throw ( /not found/ )

            p = './fixtures/Name.js'
            f = function ()
            { forge.addLoadPath ( p )
            }
            f.should.throw ( /not a directory/ )
          }
        )
      }
    )
    
    describe
    ( 'Component'
    , function ()
      { it
        ( 'should create component'
        , function ()
          { let p = forge.Component ( 'Bar' )
            p.type
            .should.equal ( 'forge.Component' )
          }
        )

        it
        ( 'should set name'
        , function ()
          { let p = forge.Component ( 'Bar' )
            p._forge.name
            .should.equal ( 'Bar' )
          }
        )

        it
        ( 'should add component to known list'
        , function ()
          { let p = forge.Component
            ( 'Foo'
            , { foo: function ()
                { return 'I am foo.'
                }
              }
            )

            forge.components ()
            .Foo
            .should.equal ( p )

          }
        )

        it
        ( 'should add methods to component definition'
        , function ()
          { let def =
            { init ()
              { this._foo = 'Foo'
              }

            , foo ()
              { return 'I am foo.'
              }
            }
            
            let p = forge.Component ( 'Foo', def )

            forge.components ()
            .Foo.foo
            .should.equal ( def.foo )

          }
        )
      }
    )

    describe
    ( 'Entity'
    , function ()
      { it
        ( 'should create an entity'
        , function ()
          { let e = forge.Entity ( 'Name', 'Foo' )
            e.type
            .should.equal ( 'forge.Entity' )
          }
        )

        it
        ( 'should get a copy of component methods'
        , function ()
          { let e   = forge.Entity ( 'Name', 'Foo' )
            let Foo = forge.components ().Foo
            e.foo
            .should.equal ( Foo.foo )
          }
        )

        it
        ( 'should call init from all components'
        , function ()
          { let e   = forge.Entity ( 'Name', 'Foo' )
            e._name
            .should.equal ( 'No name' )
            
            e._foo
            .should.equal ( 'Foo' )
          }
        )

        it
        ( 'respond to #has component'
        , function ()
          { let e   = forge.Entity ( 'Name', 'Foo' )
            e.has ( 'Name' )
            .should.be.true
            
            e.has ( 'Foo' )
            .should.be.true

            e.has ( 'Bar' )
            .should.be.false
          }
        )

        describe
        ( 'Changing component during runtime'
        , function ()
          { it
            ( 'should update created entities'
            , function ()
              { let e = forge.Entity ( 'Name', 'Foo' )
                e.foo ()
                .should.equal ( 'I am foo' )
                
                forge.Component
                ( 'Foo'
                , { foo ()
                    { return 'I am new foo'
                    }
                  }
                )

                e.foo ()
                .should.equal ( 'I am new foo' )
              }
            )
          }
        )
      }
    )
  }
)

'use strict'

require ( 'chai' )
.should ()

const forge = require ( '../index' )
const path  = require ( 'path' )
const base  = path.resolve ( __dirname, '../components' )


describe ( 'forge'
, function ()
  { let e

    afterEach
    ( function ()
      { if ( e ) e.destroy ()
      }
    )
    
    describe
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
            ( [ base
              , __dirname + '/fixtures'
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
            ( [ base
              , __dirname + '/fixtures'
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
        ( 'should find loaded component'
        , function ()
          { let c = forge.Component ( 'Foo' )
            forge.components ()
            .Foo
            .should.equal ( c )
          }
        )

        it
        ( 'should list #entities'
        , function ()
          { let c  = forge.Component ( 'Foo' )
            let e1 = forge.Entity ( 'Foo' )
            c.entities
            .should.deep.equal ( [ e1 ] )
            e1.destroy ()
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
          { e = forge.Entity ( 'Name', 'Foo' )
            e.type
            .should.equal ( 'forge.Entity' )
          }
        )

        it
        ( 'should get a copy of component methods'
        , function ()
          { e = forge.Entity ( 'Name', 'Foo' )
            let Foo = forge.components ().Foo
            e.foo
            .should.equal ( Foo.foo )
          }
        )

        it
        ( 'should call init from all components'
        , function ()
          { e = forge.Entity ( 'Name', 'Foo' )
            e._name
            .should.equal ( 'No name' )
            
            e._foo
            .should.equal ( 'Foo' )
          }
        )

        it
        ( 'respond to #has component'
        , function ()
          { e = forge.Entity ( 'Name', 'Foo' )
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
              { e = forge.Entity ( 'Name', 'Foo' )
                e.foo ()
                .should.equal ( 'I am foo.' )
                
                forge.Component
                ( 'Foo'
                , { foo ()
                    { return 'I am new foo.'
                    }
                  }
                )

                e.foo ()
                .should.equal ( 'I am new foo.' )
              }
            )
          }
        )
      }
    )

    describe
    ( 'Core'
    , function ()
      { it
        ( 'should add Core to all entities'
        , function ()
          { e = forge.Entity ( 'Foo' )
            e.has ( 'Core' )
            .should.be.true
          }
        )

        it
        ( 'should remove entity from components on #destroy'
        , function ()
          { let c1 = forge.Component ( 'Foo' )
            let c2 = forge.Component ( 'Name' )
            let c3 = forge.Component ( 'Core' )

            e = forge.Entity ( 'Foo', 'Name' )
            c1.entities
            .should.deep.equal ( [ e ] )
            c2.entities
            .should.deep.equal ( [ e ] )
            c3.entities
            .should.deep.equal ( [ e ] )

            e.destroy ()

            c1.entities
            .should.deep.equal ( [ ] )
            c2.entities
            .should.deep.equal ( [ ] )
            c3.entities
            .should.deep.equal ( [ ] )
          }
        )

        it
        ( 'should enable cross component dependency with #addComponent(s)'
        , function ()
          { e = forge.Entity ( 'Person' )
            e.name ( 'John' )
            e.age ( 53 )
            e.contactCard ()
            .should.equal ( 'name: John, age: 53' )
          }
        )

        it
        ( 'should enable method call through object on creation or #set'
        , function ()
          { e = forge.Entity
            ( 'Person'
            , { name: 'Lea'
              , age:  12
              }
            )

            e.contactCard ()
            .should.equal ( 'name: Lea, age: 12' )
            
            e.set
            ( { name: 'Bob'  // same as this.name ( 'Bob' )
              , age:  15     // same as this.age  ( 15    )
              }
            )

            e.contactCard ()
            .should.equal ( 'name: Bob, age: 15' )
          }
        )

        describe
        ( '#bind'
        , function ()
          { it
            ( 'should execute callback with this on emit'
            , function ()
              { e = forge.Entity ()
                e._test = ''
                e.bind
                ( 'Hit'
                , function ()
                  { this._test = 'Hit Test'
                  }
                )

                e.emit ( 'Other' )
                e._test
                .should.equal ( '' )
                
                e.emit ( 'Hit' )
                e._test
                .should.equal ( 'Hit Test' )
              }
            )
           
            it
            ( 'should replace callback'
            , function ()
              { e = forge.Entity ()
                e._test = ''
                let b = e.bind
                ( 'Hit'
                , function ()
                  { this._test = 'Hit Test'
                  }
                )
                b
                .should.be.a ( 'function' )

                b = e.bind
                ( b
                , function ()
                  { this._test2 = 'Hit2 Test'
                  }
                )
                e.emit ( 'Hit' )
                e._test
                .should.equal ( '' )
                e._test2
                .should.equal ( 'Hit2 Test' )
              }
            )
          }
        )
      }
    )
  }
)

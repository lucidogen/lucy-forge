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
            p._info.name
            .should.equal ( 'Bar' )
          }
        )

        it
        ( 'should add component to known list'
        , function ()
          { let p = forge.Component
            ( 'Foo'
            )

            forge.components ()
            .Foo
            .should.equal ( p )

          }
        )
      }
    )
  }
)

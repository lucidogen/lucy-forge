'use strict'

require ( 'chai' )
.should ()

const forge = require ( '../index' )
const path  = require ( 'path' )
const base  = path.resolve ( __dirname, 'fixtures' )


describe ( 'forge'
, function ()
  { describe ( '#addLoadPath'
    , function ()
      { it ( 'should add load path'
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

        it ( 'should not add path twice'
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

        it ( 'should check path validity'
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
  }
)

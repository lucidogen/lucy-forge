# Thoughts inspired by Crafty.js

## Bind and emit events

One component can emit events (blindly) and another will react to this event by
listening for it. For example, the Color component might emit 'redraw' and the
rendering component would update the color by listening to this event.

## On 'return this'

Chaining method calls can be nice since it makes for a little less typing
(actually just the number of letters in the variable). But there are a couple of
problems with this approach.

  * It forces all functions to 'return this' or to mark those compatible with
    this style to differenciate them from the others.
  * As a corrolary, it forbids the use of functions returning something possibly
    more useful then 'this'

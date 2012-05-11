module.exports = ( function StateMachine () {

  /* Very simple mechanism to store callbacks and giveout
   * MIDs. It will need rework, but should work for now. */

  var machine = {

    register: function registrar (callback, callnext) {
      with (machine) {
        messages.push(callback);
        callnext(registry.length);
      }
    },
    registry: []
  }

  return { register: machine.register }; } () );

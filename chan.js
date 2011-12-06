/*
 * Usage :
 *     $button.onclick = function() {
 *          chan.send('signIn', {
 *              name: $login.value,
 *              pass: $passwd.value
 *          });
 *     };
 *
 *     var onSignIn = chan.on('signIn', function(userInfos) {
 *          // Query database
 *          // Start animation
 *     });
 *
 *     // Later
 *     chan.unsubscribe(onSignIn);
 * 
 */
 
(function(window) {
    var _pubsub = {},
        streams = {},
        subscriberID = -1;

    _pubsub.send = function(name, data) {
        if(!streams[name]) return;

        for(var i = 0, streamLen = streams[name].length; i < streamLen; i++) {
            streams[name][i].callback(data);
        }

        return this;
    };

    _pubsub.on = function(name, callback) {
        streams[name] = streams[name] || [];

        streams[name].push({id: ++subscriberID, callback: callback});
        return subscriberID;
    };

    _pubsub.unsubscribe = function(id, callback) {
        for(var pos in streams) {
            for(var i in streams[pos]) {
                if(streams[pos][i].id === id) {
                    streams[pos].splice(i, 1);
                    callback && callback.apply(this);
                }
            }
        }

        return this;
    };

    window.chan = _pubsub;
})(this);
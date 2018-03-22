const color = require('colors');

class Console{
    
    log(msg){ 
        if(typeof(msg) ==='string') this.__print(msg); 
        else if(typeof(msg) === 'object'){
            for(let key in msg){
                if(typeof(this[key]) !== 'undefined') this[key](msg[key]);
                else throw new Error('Invalid logging type: '+key);
            } 
        }
    }
    success(msg){ this.__print(msg.white.bgGreen); }
    primary(msg){ this.__print(msg.blue); }
    error(msg){ this.__print(msg.red); }
    fatal(msg){ this.__print(msg.white.bgRed); }
    toCopy(msg){ this.__print(msg.white.bgRed); }
    
    __print(output){ console.log(this.__linkify(output)) }
    __linkify(output) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return output.replace(urlRegex, function(url) {
            return  url.underline.blue;
        });
    }
    
}
module.exports = new Console();
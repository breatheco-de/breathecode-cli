import React from 'react';
import Flux from 'react-flux-dash';

class ${fileName} extends Flux.Store{
    
    constructor(){
        super();
        this.state = {
            //initialize store state
            foo: 'bar'
        }
    }
    
    _exampleSetter(){
        this.setStoreState({
            //store properties
            foo: 'bar'
        }).emit('anyScope');
    }
    exampleGetter(){
        return this.state.foo;
    }
}
export default new ${fileName}();
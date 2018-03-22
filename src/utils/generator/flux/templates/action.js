import Flux from 'react-flux-dash';

class ${fileName} extends Flux.Action{
    
    createNewSomething(){
        //do whatever your like... and then...
        this.dispatch(
            'MyStoreName.anySetter', //store name followed by store setter method
            { foo: 'bar'} //data to send to the store
        );
    }
}
export default new ${fileName}();
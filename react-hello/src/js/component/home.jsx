import React from 'react';

//include images into your bundle
import rigoImage from '../../img/rigo-baby.jpg';

//create your first component
export class Home extends React.Component{
    
    render(){
        return (
            <div className="text-center mt-5">
                <h1>Hello Rigo!</h1>
                <p><img src={'./public/'+rigoImage} /></p>
                <a href="#" className="btn btn-success">If you see this gree button... bootstrap is working</a>
            </div>
        );
    }
}
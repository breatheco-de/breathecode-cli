//import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';

//include jquery into the bundle and store its contents into the $ variable
import $ from "jquery";
//include bootstrap npm library into the bundle
import 'bootstrap';

//include your index.scss file into the bundle
import '../styles/index.scss';

//import your own components
import {Home} from './component/home.jsx';

//render your react application
ReactDOM.render(
    <Home />,
    document.querySelector('#app')
);
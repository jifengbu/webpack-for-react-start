import React, { Component, Fragment } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Home from './pages/home';
import Page1 from './pages/page1';
import Page2 from './pages/page2';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>这是一个路由的展示页面</div>
                <Link to="/home" style={{color:'black'}}>
                    <div>点击跳转到home</div>
                </Link>
                <Link to="/page1" style={{color:'black'}}>
                    <div>点击跳转到page1</div>
                </Link>
                <Link to="/page2" style={{color:'black'}}>
                    <div>点击跳转到page2</div>
                </Link>
                <Route path='/home' component={Home}/>
                <Route path='/page1' component={Page1}/>
                <Route path='/page2' component={Page2}/>
            </BrowserRouter>
        )
    }
}

export default App;

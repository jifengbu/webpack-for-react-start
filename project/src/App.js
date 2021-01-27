import React, { Component, Fragment } from 'react';
import { BrowserRouter, Link, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

const Loading = ({ isLoading, error }) => {
    if (isLoading) {
        return <div>Loading...</div>
    }
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>
    }
    else {
        return null;
    }
};

const Home = Loadable({ loader: () => import('./pages/home'), loading: Loading });
const Page1 = Loadable({ loader: () => import('./pages/page1'), loading: Loading });
const Page2 = Loadable({ loader: () => import('./pages/Page2'), loading: Loading });

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
                    <Link to="/page3" style={{color:'black'}}>
                        <div>点击跳转到page3</div>
                    </Link>
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    <Route path="/home" component={Home}/>
                    <Route path='/page1' component={Page1}/>
                    <Route path='/page2' component={Page2}/>
            </BrowserRouter>
        )
    }
}

export default App;

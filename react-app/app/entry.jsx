import {hashHistory, IndexRedirect, Route, Router} from 'react-router';
import App from './app.jsx';
import Counter from './counter.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

const router = <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRedirect to='counter'/>
    <Route path='counter' component={Counter}/>
  </Route>
</Router>;

ReactDOM.render(
  router,
  document.getElementById('content')
);

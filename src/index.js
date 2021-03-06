import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Redirect, Router, Route, Switch } from "react-router-dom";

import "./assets/css/fruticulture.css";
import "./assets/css/datetime.css";
import "moment/locale/pt-br";

import indexRoutes from "./routes/index.jsx";


const hist = createBrowserHistory();
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {
        indexRoutes.map((prop, key) => {
          if (prop.redirect)
            return <Redirect from={prop.path} to={prop.to} key={key} />;

          return <Route path={prop.path} component={prop.component} key={key} />;
        })
      }
    </Switch>
  </Router>,
  document.getElementById("root")
);

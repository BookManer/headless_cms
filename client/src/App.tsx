import "./App.css";

import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import { Profile } from './pages/Profile';
// HOC's
import withAuthNavigation from './components/hoc/withAuthNavigation';
import EntityPage from "./pages/EntityPage";
// Libs/components
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
// Ant UI styles
import 'antd/dist/antd.css';
// Store with mobx-react
import { Provider } from 'mobx-react'
import { userStore } from './store/user.store';
import { EntityStore } from "./store/entity.store";
import { ModelStore } from "./store/model.store";
import { FieldsStore } from "./store/fields.store";
import ModelPage from "./pages/ModelPage";
import { MediaStore } from "./store/media.store";
import { Loader } from "./components/Loader";
import { FileSystemStore } from "./store/filesystem.store";

class App extends React.Component {

  render() {

    return userStore ? (
      <Fragment>
        <Provider fileSystemStore={new FileSystemStore} entityStore={new EntityStore} modelsStore={new ModelStore} fieldsStore={new FieldsStore} mediaStore={ new MediaStore} userStore={userStore}>
          <Switch>
            <Route exact path="/entity/:id" render={() => withAuthNavigation(EntityPage, userStore)} />
            <Route exact path="/models/:id" render={() => withAuthNavigation(ModelPage, userStore)} />
            <Route exact path="/" render={() => withAuthNavigation(Home, userStore)}></Route>
            <Route path="/profile" render={() => withAuthNavigation(Profile, userStore)}></Route>
            <Route path="/login" render={() => <Login />}></Route>
          </Switch>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </Provider>
      </Fragment>
    ) : <Loader />
  }
}

export default App;
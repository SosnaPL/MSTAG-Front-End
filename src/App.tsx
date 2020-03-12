import React from 'react';
import { Container } from 'react-bootstrap';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import ParticlesRenderer from './components/particles_render';

const Main = React.lazy(() => import('./pages/Main'));
const Register = React.lazy(() => import('./pages/Register'))
const Login = React.lazy(() => import('./pages/Login'))
const Lobby = React.lazy(() => import('./pages/Lobby'))

export default class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Container className="app_container">
        <ParticlesRenderer />
        <Container className="p-3 rounded content_container">
          <MemoryRouter>
            <React.Suspense
              fallback={(
                <div className="d-flex justify-content-center">
                  <h2>Loading...</h2>
                </div>
              )}
            >
              <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/lobby" component={Lobby} />
              </Switch>
            </React.Suspense>
          </MemoryRouter>
        </Container>
      </Container>
    );
  }
}
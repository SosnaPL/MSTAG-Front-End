import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ParticlesRenderer from './components/particles_render';

const Main = React.lazy(() => import('./pages/Main'));
const Register = React.lazy(() => import('./pages/Register'))
const Login = React.lazy(() => import('./pages/Login'))

export default class App extends React.Component {
  public render(): JSX.Element {
    return (
      <Container className="app_container">
        <ParticlesRenderer />
        <Row>
          <Col className="mx-auto col-md-15">
            <Container className="p-3 rounded content_container">
              <HashRouter>
                <React.Suspense
                  fallback={(
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="projects_load" />
                    </div>
                  )}
                >
                  <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route component={Main} />
                  </Switch>
                </React.Suspense>
              </HashRouter>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}
import React from 'react';
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import { post } from '../components/constants';

class Login extends React.Component<RouteComponentProps, any> {

  state = {
    login: "",
    password: "",
    error_msg: ""
  };

  componentDidMount() {
    const { login, password } = this.state;
    this.setState({ login, password });
  }

  onChange = e => {
    let event_target = e.target;
    this.setState({ [event_target.name]: event_target.value });
  };

  logIn = e => {
    e.preventDefault();
    post("/users/login/", this.state)
      .then(response => {
        console.log("Logged in");
        localStorage.setItem("token", response.data.token);
        this.props.history.push("/")
      })
      .catch(error => {
        console.log(error);
        this.setState({ error_msg: error.message })
      });
  };

  public render(): JSX.Element {
    return (
      <>
        <div className="login_">
          <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=758097201499-i301bgsnrfiu846gbuahl2kcq4qtmuht.apps.googleusercontent.com&redirect_uri=http://localhost:8080/oauth/google&scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&include_granted_scopes=true&access_type=online">
            <div className="login_google" />
          </a>
        </div>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.logIn}>
              <Form.Group>
                <FormControl
                  placeholder="Login"
                  name="login"
                  type="text"
                  value={this.state.login}
                  onChange={this.onChange.bind(this)}
                />
              </Form.Group>
              <Form.Group>
                <FormControl
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange.bind(this)}
                />
              </Form.Group>
              <Row>
                <Col className="d-flex justify-content-center" >
                  {this.state.error_msg}
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button variant="outline-dark" size="lg" type="submit">
                    Log In!
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/">
              <Button variant="outline-dark" size="lg">
                Back
              </Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Login); 
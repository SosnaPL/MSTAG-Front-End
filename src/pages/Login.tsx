import React from 'react';
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import { post } from '../components/constants'

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
        this.props.history.push("/lobby")
      })
      .catch(error => {
        console.log(error);
        this.setState({ error_msg: error.response.data.detail })
      });
  };

  public render(): JSX.Element {
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.logIn}>
              <Form.Group>
                <Form.Label>Login:</Form.Label>
                <FormControl
                  name="login"
                  type="text"
                  value={this.state.login}
                  onChange={this.onChange.bind(this)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <FormControl
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange.bind(this)}
                />
              </Form.Group>
              <Row>
                <Col className="d-flex justify-content-center">
                  {this.state.error_msg}
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button variant="outline-dark" size="lg" type="submit">
                    Send
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
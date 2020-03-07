import React from 'react';
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://25.64.141.174:8000/api/v1/users/login/";

interface LoginProps {
  login: string;
  password: string;
}

export default class Login extends React.Component<{ user: LoginProps }> {

  state = {
    login: "",
    password: ""
  }

  componentDidMount() {
    if (this.props.user) {
      const { login, password } = this.props.user;
      this.setState({ login, password })
    }
  }

  onChange = e => {
    let event_target = e.target
    this.setState({ [event_target.name]: event_target.value });
  };

  createUser = e => {
    e.preventDefault();
    axios.post(API_URL, this.state).then((response) => {
      console.log("Logged in")
      localStorage.setItem("token", response.data.token)
    }).catch((error) => {
      console.log(error.data);
    })
  };

  public render(): JSX.Element {
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.createUser}>
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
                  <Button variant="outline-dark" size="lg" type="submit">Send</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/">
              <Button variant="outline-dark" size="lg">Back</Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}


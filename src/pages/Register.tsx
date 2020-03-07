import React from 'react';
import { Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://25.64.141.174:8000/api/v1/users/register/";

interface UserProps {
  username: string;
  email: string;
  password: string;
}

export default class Register extends React.Component<{ user: UserProps }> {

  state = {
    username: "",
    email: "",
    password: ""
  };

  componentDidMount() {
    if (this.props.user) {
      const { username, email, password } = this.props.user;
      this.setState({ username, email, password })
    }
  }

  onChange = e => {
    let event_target = e.target
    this.setState({ [event_target.name]: event_target.value });
  };

  createUser = e => {
    e.preventDefault();
    axios.post(API_URL, this.state).then(() => {
      console.log("Registered")
      this.setState({
        username: "",
        email: "",
        password: ""
      });
    }).catch((error) => {
      console.log(error.data);
    })
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  public render(): JSX.Element {
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.createUser}>
              <Form.Group>
                <Form.Label>Username:</Form.Label>
                <FormControl
                  name="username"
                  type="text"
                  onChange={this.onChange.bind(this)}
                  value={this.state.username}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <FormControl
                  name="password"
                  type="password"
                  onChange={this.onChange.bind(this)}
                  value={this.state.password}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <FormControl
                  name="email"
                  type="email"
                  onChange={this.onChange.bind(this)}
                  value={this.state.email}
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

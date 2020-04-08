import React from 'react';
import { Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { post } from '../components/constants'
class Register extends React.Component<RouteComponentProps, any> {
  state = {
    username: "",
    email: "",
    password: "",
    errors: { username: "", email: "", password: "" },
  };

  componentDidMount() {
    const { username, email, password } = this.state;
    this.setState({ username, email, password });
  }

  onChange = e => {
    let event_target = e.target;
    this.setState({ [event_target.name]: event_target.value });
  };

  createUser = e => {
    e.preventDefault();
    post("/users/register/", this.state)
      .then(() => {
        console.log("Registered");
        this.props.history.push("/login");
      })
      .catch(error => {
        console.log(error.response)
        const newErrors = Object.assign(this.state.errors, error.response.data);
        this.setState({ errors: newErrors });
      });
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
                <Row>
                  {this.state.errors["username"]}
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <FormControl
                  name="password"
                  type="password"
                  onChange={this.onChange.bind(this)}
                  value={this.state.password}
                />
                <Row>
                  {this.state.errors["password"]}
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <FormControl
                  name="email"
                  type="email"
                  onChange={this.onChange.bind(this)}
                  value={this.state.email}
                />
                <Row>
                  {this.state.errors["email"]}
                </Row>
              </Form.Group>
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

export default withRouter(Register); 

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
    errors: { username: [], email: [], password: [] },
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
    console.log(this.state.errors);
    return (
      <>
        <div className="login_">
          <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=758097201499-i301bgsnrfiu846gbuahl2kcq4qtmuht.apps.googleusercontent.com&redirect_uri=https://mstag.netlify.app/oauth/google&scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&include_granted_scopes=true&access_type=online">
            <div className="login_google" />
          </a>
        </div>
        <Row>
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.createUser}>
              <Form.Group>
                <FormControl
                  name="username"
                  type="text"
                  onChange={this.onChange.bind(this)}
                  value={this.state.username}
                  placeholder="Username"
                />
                {this.state.errors["username"].length ? this.state.errors["username"].map(((err, index) => {
                  return (
                    <Row key={index}>
                      <Col style={{ paddingTop: "16px" }}>
                        {err}
                      </Col>
                    </Row>
                  )
                })) : <></>}
              </Form.Group>
              <Form.Group>
                <FormControl
                  width="50%"
                  name="password"
                  type="password"
                  onChange={this.onChange.bind(this)}
                  value={this.state.password}
                  placeholder="Password"
                />
                {this.state.errors["password"].length ? this.state.errors["password"].map(((err, index) => {
                  return (
                    <Row key={index}>
                      <Col style={{ paddingTop: "16px" }}>
                        {err}
                      </Col>
                    </Row>
                  )
                })) : <></>}
              </Form.Group>
              <Form.Group>
                <FormControl
                  name="email"
                  type="email"
                  onChange={this.onChange.bind(this)}
                  value={this.state.email}
                  placeholder="Email"
                />
                {this.state.errors["email"].length ? this.state.errors["email"].map(((err, index) => {
                  return (
                    <Row key={index}>
                      <Col style={{ paddingTop: "16px" }}>
                        {err}
                      </Col>
                    </Row>
                  )
                })) : <></>}
              </Form.Group>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button variant="outline-dark" size="lg" type="submit">
                    Sign Up!
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

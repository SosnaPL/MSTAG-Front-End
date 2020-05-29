import React from 'react';
import { Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { post } from '../components/constants';
import GoogleLogin from 'react-google-login';

class Register extends React.Component<RouteComponentProps, any> {
  state = {
    username: "",
    email: "",
    password: "",
    errors: { username: [], email: [], password: [] },
  };

  responseGoogle = (response) => {
    console.log(response)
    post("/oauth/google/", {
      code: response.code
    })
      .then((res) => {
        localStorage.setItem("token", res.data.token)
        this.props.history.push("/")
      })
  }

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
        <div style={{ margin: "10px" }}>
          <GoogleLogin
            clientId="758097201499-i301bgsnrfiu846gbuahl2kcq4qtmuht.apps.googleusercontent.com"
            buttonText="Register"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
            responseType="code"
          />
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

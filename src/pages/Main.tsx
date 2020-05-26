import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { post, get, CurrentUser } from "../components/constants";

interface MainState {
  loading: boolean;
  error_type: string;
  oauth_logging_in: boolean;
}

class Main extends React.Component<RouteComponentProps, MainState> {

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loading: true,
      error_type: "",
      oauth_logging_in: false,
    }
  }

  presence_ws: WebSocket = null;
  params = null;
  code = null;

  connect_presence() {
    return new Promise((resolve, reject) => {
      this.presence_ws = new WebSocket("wss://micromstag.westeurope.cloudapp.azure.com:8869");
      this.presence_ws.onopen = () => {
        console.log("ONOPEN")
        this.presence_ws.send(JSON.stringify(localStorage.getItem("token")));
        console.log("SENT")
      };
      this.presence_ws.onmessage = (response) => {
        const msg = JSON.parse(response.data)
        if (msg.error) {
          console.log("closepressence")
          this.presence_ws.close();
          reject(msg.error_type);
        }
        else {
          console.log("connect pressence")
          resolve();
        }
      }
    })
  }

  logInGoogle() {
    if (localStorage.getItem("token")) {
      console.log("no token")
      return;
    }
    if (!window.location.pathname.startsWith("/oauth/google")) {
      return;
    }
    if (!this.code) {
      console.log("no code")
      return;
    }
    this.setState({ loading: false, oauth_logging_in: true });
    post("/oauth/google/", {
      code: this.params.get("code")
    })
      .then(response => {
        console.log("Logged in via google");
        localStorage.setItem("token", response.data.token);
        CurrentUser.token = response.data.token;
        get("/users/profile/").then((res) => {
          console.log(res.data.username)
          if (res.data.username) {
            window.location.href =
              location.protocol +
              "//" +
              location.hostname +
              (location.port ? ":" + location.port : "") +
              "/";
          }
          else {
            this.props.history.push("/set_nick");
          }
        })

      })
  }

  logInAccount() {
    CurrentUser.token = localStorage.getItem("token")
    return get("/users/profile/")
      .then((res) => {
        if (!res.data.username) {
          this.props.history.push("/set_nick");
        }
        else {
          this.connect_presence().then(() => {
            console.log("lobby")
            this.props.history.push("/lobby")
          }).catch((err) => {
            this.setState({ error_type: err, loading: false })
          })
        }
      })
      .catch(() => {
        console.log("timeout")
        localStorage.removeItem("token");
        this.setState({ loading: false })
      })
  }

  removeToken = () => {
    console.log()
    localStorage.removeItem("token");
    this.props.history.push("/login");
  }

  componentDidMount() {
    this.params = new URLSearchParams(window.location.search);
    this.code = this.params.get("code");
    if (this.code) {
      this.logInGoogle();
    }
    else if (localStorage.getItem("token")) {
      this.logInAccount();
    }
    else {
      this.setState({ loading: false });
      console.log("no token");
    }
  }

  public render(): JSX.Element {
    if (this.state.oauth_logging_in) {
      return (
        <div className="d-flex justify-content-center">
          <h2>Authorizing...</h2>
        </div>
      )
    }
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center">
          <h2>Loading...</h2>
        </div>
      )
    }
    if (this.state.error_type) {
      return (
        <div className="d-flex justify-content-center flex-column">
          <h2>{this.state.error_type}</h2>
          <Button onClick={this.removeToken.bind(this)} variant="dark">Try again</Button>
        </div>
      )
    }
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center">
            <h2>Welcome to MSTAG!</h2>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/login">
              <Button variant="outline-dark" size="lg">
                Log in!
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/register">
              <Button variant="outline-dark" size="lg">
                Sign up!
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center guest">
            <Link to="/login_guest">
              <Button variant="outline-dark" size="lg">
                Play as guest!
              </Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Main)
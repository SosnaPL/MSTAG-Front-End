import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL } from '../components/constants';

interface MainState {
  loading: boolean;
  error_type: string;
}

class Main extends React.Component<RouteComponentProps, MainState> {

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loading: true,
      error_type: "",
    }
  }

  presence_ws: WebSocket = null;

  connect_presence() {
    return new Promise((resolve, reject) => {
      this.presence_ws = new WebSocket("ws://25.64.141.174:8769");
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

  is_logged_in() {
    if (localStorage.getItem("token")) {
      return fetch(API_URL + "/users/profile/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token")
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log("bad token")
            localStorage.removeItem("token");
            this.setState({ loading: false })
            return
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
    else {
      this.setState({ loading: false })
      console.log("no token")
    }
  }

  removeToken = () => {
    console.log()
    localStorage.removeItem("token");
    this.props.history.push("/login");
  }

  componentDidMount() {
    this.is_logged_in()
  }

  public render(): JSX.Element {
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
            <h2>Welcome to Definitely not umag2</h2>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/login">
              <Button variant="outline-dark" size="lg">Log in!</Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Link to="/register">
              <Button variant="outline-dark" size="lg">Sign up!</Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center guest">
            <Link to="/lobby">
              <Button variant="outline-dark" size="lg">Play as guest!</Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Main)
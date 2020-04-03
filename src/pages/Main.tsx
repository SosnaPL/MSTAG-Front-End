import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL } from '../components/constants'

class Main extends React.Component<RouteComponentProps, any> {

  state = {
    loading: true
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
            console.log("lobby")
            this.props.history.push("/lobby")
          }
        })
        .catch(() => {
        })
    }
    else {
      this.setState({ loading: false })
      console.log("no token")
    }
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
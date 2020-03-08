import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL } from '../components/constants'

class Main extends React.Component<RouteComponentProps, any> {

  is_logged_in() {
    return fetch(API_URL + "profile/", {
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      if (this.is_logged_in()) {
        this.props.history.push("/lobby")
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  public render(): JSX.Element {
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
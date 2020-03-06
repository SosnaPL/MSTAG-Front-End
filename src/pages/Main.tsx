import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

export default class Home extends React.Component{
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
            <Button variant="outline-dark" size="lg">Log in!</Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Button variant="outline-dark" size="lg">Sign up!</Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center guest">
            <Button variant="outline-dark" size="lg">Play as guest!</Button>
          </Col>
        </Row>
      </>
    );
  }
}

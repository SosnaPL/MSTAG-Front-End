import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default class Party extends React.Component<{ kick: Function, party: any, leader: any, user_nick: string }, {}> {

  kick_member(id) {
    this.props.kick(id)
  }

  public render(): JSX.Element {
    if (!this.props.leader) {
      return (
        <div className="party_container">
          <Row>
            <Col className="d-flex justify-content-start pb-3">
              <Card className="shadow rounded d-flex align-items-center">
                <Card.Title>⭐{this.props.user_nick}</Card.Title>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
    else if (this.props.user_nick == this.props.leader.username) {
      return (
        <div className="party_container">
          <Row key={0}>
            <Col className="d-flex justify-content-start pb-3">
              <Card className="shadow rounded d-flex align-items-center">
                <Card.Title>⭐{this.props.leader.username}</Card.Title>
              </Card>
            </Col>
          </Row>
          {this.props.party.filter((teammate) => { return teammate.username != this.props.leader.username }).map((teammate, index) => (
            <Row key={index + 1}>
              <Col className="d-flex justify-content-start pb-3">
                <Card className="shadow rounded d-flex align-items-center">
                  <Card.Title>{teammate.username}</Card.Title>
                  <div className="invite_container" style={{ backgroundColor: "rgba(33, 36, 61, 0.6)" }}>
                    <FontAwesomeIcon className="kick_icon" size="1x" icon={faTimes} onClick={this.kick_member.bind(this, teammate.id)} />
                  </div>
                </Card>
              </Col>
            </Row>
          ))}
        </div>
      )
    }
    else {
      return (
        <div className="party_container">
          <Row key={0}>
            <Col className="d-flex justify-content-start pb-3">
              <Card className="shadow rounded d-flex align-items-center">
                <Card.Title>⭐{this.props.leader.username}</Card.Title>
              </Card>
            </Col>
          </Row>
          {this.props.party
            .filter(teammate => {
              return teammate.username != this.props.leader.username;
            })
            .map((teammate, index) => (
              <Row key={index + 1}>
                <Col className="d-flex justify-content-start pb-3">
                  <Card className="shadow rounded d-flex align-items-center">
                    <Card.Title>{teammate.username}</Card.Title>
                  </Card>
                </Col>
              </Row>
            ))}
        </div>
      );
    }
  }
}
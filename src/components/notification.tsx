import React from 'react';
import { get } from './constants';
import { Button, Row, Col, Card } from 'react-bootstrap';


interface NotificationsProps {
  team_id?: number,
  text: string,
  delete: Function,
  time: number,
}

export default class Notification extends React.Component<NotificationsProps> {
  delete() {
    this.props.delete(this.props.time)
  }

  public render(): JSX.Element {
    return (
      <Row>
        <Col className="d-flex justify-content-start pb-3">
          <Card className="shadow rounded d-flex align-items-center">
            <Card.Title>{this.props.text}</Card.Title>
            <Button onClick={this.delete.bind(this)}>
              Delete.
            </Button>
          </Card>
        </Col>
      </Row >
    )
  }
}

export class TeamInviteNotification extends Notification {
  accept_invite(id: number) {
    this.delete();
    get("/team/join/" + id.toString() + "/")
      .then(() => {

      })
      .catch(() => {

      })
  }
  public render(): JSX.Element {
    console.log("Render team notification");
    return (
      <Row>
        <Col className="d-flex justify-content-start pb-3">
          <Card className="shadow rounded d-flex align-items-center">
            <Card.Title>{this.props.text}</Card.Title>
            <Row>
              <Col>
                <Button onClick={() => this.accept_invite(this.props.team_id)}>
                  Accept!
                </Button>
                <Button onClick={this.delete.bind(this)}>Decline.</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
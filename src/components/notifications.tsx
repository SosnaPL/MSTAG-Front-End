import React from 'react';
import { API_URL } from './constants';
import { Row, Col, Card } from 'react-bootstrap';
import NotificationsButton from './notifications_button'
import axios from 'axios';

export default class Notifications extends React.Component {

  state = {
    notifications: []
  }

  ws_server = () => {
    axios.get(API_URL + "/server_config/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then((res) => {
        let ws = new WebSocket(res.data.notification)
        ws.onopen = () => {
          ws.send(localStorage.getItem("token"))
          console.log("connected")
        }
        ws.onmessage = (e) => {
          this.setState({ notifications: this.state.notifications.concat([JSON.parse(e.data)]) })
        }
        ws.onclose = (_e) => {
          setTimeout(this.ws_server, 10000);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.ws_server()
  }
  public render(): JSX.Element {
    return (
      <>
        {this.state.notifications.map((notification) => (
          <Row key={notification.time}>
            <Col className="d-flex justify-content-start pb-3">
              <Card className="shadow rounded d-flex align-items-center">
                <Card.Title>{notification.text}</Card.Title>
              </Card>
              <NotificationsButton team_id={("team_id" in notification) ? notification.team_id : 0} type={notification.type} />
            </Col>
          </Row>
        ))}
      </>
    );
  }
}

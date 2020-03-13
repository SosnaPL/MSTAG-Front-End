import React from 'react';
import { API_URL } from './constants';
//import { Row } from 'react-bootstrap';
import Notification, { TeamInviteNotification } from './notification'
import axios from 'axios';

export default class Notifications extends React.Component<{}, { notifications: any[], notification_socket: WebSocket }> {
  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      notification_socket: null,
    }
    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.setState({
      notifications: this.state.notifications.filter(el => el.props.time != id)
    });
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
          let data = JSON.parse(e.data);
          let NewNotif;

          if (data.type == "invited to team") {
            NewNotif = TeamInviteNotification;
          }
          else {
            NewNotif = Notification;
          }
          NewNotif =
            <NewNotif
              team_id={"team_id" in data ? data.team_id : 0}
              type={data.type}
              text={data.text}
              delete={this.delete.bind(this)}
              time={Date.now()}
            />
          this.setState({
            notifications: [...this.state.notifications, NewNotif]
          });

        }
        ws.onclose = (_e) => {
          setTimeout(this.ws_server, 10000);
        }
        this.setState({ notification_socket: ws });
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentWillUnmount() {
    this.state.notification_socket.close();
  }

  componentDidMount() {
    this.ws_server()
  }

  public render(): JSX.Element {
    return (
      <>
        {
          this.state.notifications.reverse().map((notification: Notification, index) => (
            <div key={index}>{notification} </div>
          ))
        }
      </>
    );
  }
}

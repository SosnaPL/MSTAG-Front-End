import React from 'react';
import { API_URL } from './constants';
//import { Row } from 'react-bootstrap';
import Notification, { TeamInviteNotification } from './notification'
import axios from 'axios';

export default class Notifications extends React.Component<{ set_party: Function }, { notifications: any[], notification_socket: WebSocket }> {
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
          let NewNotif = Notification;
          let text = data.text || "DEFAULT TEXT";

          console.log(data.type);

          if (data.type == "invited to team") {
            text = "You have been invited to a team by " + data.inviter_name;
            NewNotif = TeamInviteNotification;
          }
          else if (data.type == "new teammate") {
            text = data.teammate_name + " has joined your team!";
            this.props.set_party();
          }
          else if (data.type == "already invited to team") {
            text = "That player has already been invited to your team!";
          }
          else if (data.type == "already in team") {
            text = "That player is already in your team!";
          }
          else if (data.type == "team joined") {
            text = "You've joined a new team!";
            this.props.set_party();
          }
          else if (data.type == "kicked from team") {
            text = "You have been kicked from your team.";
            this.props.set_party();
          }
          else if (data.type == "teammate kicked") {
            text = data.teammate_name + " has been kicked from your team."
            this.props.set_party();
          }
          else if (data.type == "teammate left") {
            text = data.teammate_name + " has left your team."
            this.props.set_party();
          }

          let notif_instance =
            <NewNotif
              team_id={"team_id" in data ? data.team_id : 0}
              text={text}
              delete={this.delete.bind(this)}
              time={Date.now()}
            />
          this.setState({
            notifications: [...this.state.notifications, notif_instance]
          });

        }
        ws.onclose = (_e) => {
          if (localStorage.getItem("token")) {
            setTimeout(this.ws_server, 10000);
          }
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

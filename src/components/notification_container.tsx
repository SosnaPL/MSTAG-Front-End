import React from 'react';
import { API_URL } from './constants';
import { get } from '../components/constants'
//import { Row } from 'react-bootstrap';
import Notification, { TeamInviteNotification, FriendInviteNotification } from './notification'
import axios from 'axios';

export default class Notifications extends React.Component<{ set_party: Function, update_friends: Function, player_id: number, update_friend: Function }, { notifications: any[], notification_socket: WebSocket }> {
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

  update_friend(id, status) {
    this.props.update_friend(id, status)
  }

  ws_server = () => {
    axios.get(API_URL + "/server_config/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then((res) => {
        let ws = new WebSocket(res.data.notification)
        ws.onopen = () => {
          ws.send(JSON.stringify([localStorage.getItem("token"), this.props.player_id]))
          console.log("connected")
          get('/notification/retrieve/')
            .then(() => {

            })
            .catch(() => {

            })
        }
        ws.onmessage = (e) => {
          let data = JSON.parse(e.data);
          let NewNotif = Notification;
          let text = data.text || "DEFAULT TEXT";
          let show = true;

          console.log(data.type);

          if (data.type == "invited to team") {
            text = "You have been invited to a team by " + data.inviter_name;
            NewNotif = TeamInviteNotification;
          } else if (data.type == "new teammate") {
            text = data.teammate_name + " has joined your team!";
            this.props.set_party();
          } else if (data.type == "already invited to team") {
            text = "That player has already been invited to your team!";
          } else if (data.type == "already in team") {
            text = "That player is already in your team!";
          } else if (data.type == "team joined") {
            text = "You've joined a new team!";
            this.props.set_party();
          } else if (data.type == "kicked from team") {
            text = "You have been kicked from your team.";
            this.props.set_party();
          } else if (data.type == "teammate kicked") {
            text = data.teammate_name + " has been kicked from your team.";
            this.props.set_party();
          } else if (data.type == "teammate left") {
            text = data.teammate_name + " has left your team.";
            this.props.set_party();
          } else if (data.type == "left team") {
            text = "You have left your team.";
            this.props.set_party();
          } else if (data.type == "not the leader") {
            text = "You are not the leader";
          } else if (data.type == "invitation declined") {
            text = data.username + " has declined your invitation";
          } else if (data.type == "friend online") {
            show = false;
            this.update_friend(data.id, true);
          } else if (data.type == "friend offline") {
            show = false;
            this.update_friend(data.id, false);
          } else if (data.type == "friend invite") {
            text = data.username + " has sent you a friend request!";
            NewNotif = FriendInviteNotification;
          } else if (data.type == "friend invite sent") {
            text = "Sent friend invite to " + data.username;
          }
          else if (data.type == "friend invite accepted") {
            text = data.username + " has accepted your friend request!";
            this.props.update_friends()
          }
          else if (data.type == "friend invite declined") {
            text = data.username + " has declined your friend request.";
          }
          else if (data.type == "removed from friends") {
            text = data.username + " has removed you from their friend list. :(";
            this.props.update_friends();
          }

          if (!show) {
            return;
          }
          let notif_instance =
            <NewNotif
              id={"id" in data ? data.id : 0}
              text={text}
              delete={this.delete.bind(this)}
              friends_update={this.props.update_friends}
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
          this.state.notifications.sort((n1, n2) => { return n2.props.time - n1.props.time }).map((notification: Notification, index) => (
            <div key={index}>{notification} </div>
          ))
        }
      </>
    );
  }
}

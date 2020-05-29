import React from 'react';
import { get, GameServer, CurrentUser } from '../components/constants';
import Notification, { TeamInviteNotification, FriendInviteNotification } from './notification';

interface NotificationsProps {
  set_party: Function;
  update_friends: Function;
  player_id: number;
  update_friend: Function;
  in_game: boolean;
  begin_game: Function;
}

export default class NotificationsContainer extends React.Component<NotificationsProps, { notifications: JSX.Element[], notification_socket: WebSocket, error: String }> {
  constructor(props: NotificationsProps) {
    super(props)
    this.state = {
      notifications: [],
      notification_socket: null,
      error: "",
    }
    this.delete = this.delete.bind(this);
  }

  ws_unmounted = false;

  delete(id: number) {
    this.setState({
      notifications: this.state.notifications.filter(el => el.props.time != id)
    });
  }
  update_friend(id: number, status: boolean) {
    this.props.update_friend(id, status)
  }

  ws_server = () => {
    get("/server_config/")
      .then((res) => {
        let ws = new WebSocket(res.data.notification)
        ws.onopen = () => {
          ws.send(JSON.stringify(CurrentUser.token))

          console.log("connected")
          get('/notification/retrieve/')
            .then(() => {

            })
            .catch(() => {

            })
          this.setState({ error: "" });
        }
        ws.onmessage = (e) => {
          if (this.props.in_game) {
            return
          }
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
          else if (data.type == "already in friends") {
            text = data.username + " is already in your friend list!"
          }
          else if (data.type == "already in friend invites") {
            text = "You have already invited " + data.username + " to your friends!"
          }
          else if (data.type == "removed from friends") {
            text = data.username + " has removed you from their friend list. :(";
            this.props.update_friends();
          }
          else if (data.type == "starting game") {
            show = false;
            GameServer.address = data.address;
            this.props.begin_game();
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
          let farts = this.state.notifications;
          farts.push(notif_instance);
          this.setState({
            notifications: farts
          });

        }
        ws.onclose = (_e) => {
          if (!this.ws_unmounted && !this.state.error) {
            setTimeout(this.ws_server, 10000);
          }
        }
        ws.onerror = (_e) => {
          setTimeout(this.ws_server, 10000);
          this.setState({ error: "Can't connect to notification service." })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentWillUnmount() {
    this.ws_unmounted = true
    if (this.state.notification_socket) {
      this.state.notification_socket.close();
    }
  }

  componentDidMount() {
    this.ws_server()
  }

  public render(): JSX.Element {
    if (this.state.error) {
      return (
        <h1 style={{ textAlign: "center" }}>{this.state.error}</h1>
      )
    }
    return (
      <>
        {
          this.state.notifications.sort((n1, n2) => { return n2.props.time - n1.props.time }).map((notification: JSX.Element, index) => (
            <div key={index}>{notification} </div>
          ))
        }
      </>
    );
  }
}

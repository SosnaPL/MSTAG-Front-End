import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { get, CurrentUser, get_suspense } from '../components/constants';
import Notifications from '../components/notification_container';
import { FriendsContainer } from '../components/friends';
import Party from '../components/party';
import Chat from '../components/chat';
import InviteFriend from '../components/invite_friend';

class Lobby extends React.Component<RouteComponentProps, any> {

  state = {
    id: 0,
    nick: "",
    clan: "",
    avatar: "",
    friends: [],
    party: [],
    party_leader: null
  }

  presence_ws = null;

  constructor(props) {
    super(props)
    this.updateFriendOnline = this.updateFriendOnline.bind(this)
    this.fetch_player_profile()
    console.log("constructor called")
  }

  updateFriends() {
    console.log("update_friends")
    get("/users/profile/friends/")
      .then((res) => {
        this.setState({ friends: res.data })
        console.log(this.state.friends)
      })
      .catch((e) => {
        console.log(e.data);
      })
  }

  set_party() {
    get("/team")
      .then((res) => {
        this.setState({ party: res.data.members, party_leader: res.data.leader })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  logOut = () => {
    this.presence_ws.close();
    localStorage.removeItem("token")
    window.location.reload();
  }

  fetch_player_profile() {
    console.log("fetch start")
    const team = get_suspense("/team/")
    const friends = get_suspense("/users/profile/friends/");
    const profile = get_suspense("/users/profile/");
    //const error = get_suspense("/error/");
    console.log("fetch end")
    this.state = {
      party: team.members,
      party_leader: team.leader,
      friends: friends,
      nick: profile.username,
      clan: profile.clan ? profile.clan.name : "No clan",
      avatar: profile.avatar ? profile.avatar : "src/public/avatar.jpg",
      id: profile.id
    }
    CurrentUser.username = profile.username
    CurrentUser.player_id = profile.id;
    this.presence_ws = new WebSocket("ws://25.64.141.174:8769");
    this.presence_ws.onopen = () => {
      this.presence_ws.send(JSON.stringify(localStorage.getItem("token")));
    };
  }

  _play = () => {
    get("/test_notif/").then(() => { });
    //this.props.history.push("/game")
  }

  updateFriendOnline = (friend_id, new_status) => {
    let friends = this.state.friends;
    for (let friend of friends) {
      if (friend.id == friend_id) {
        friend.is_online = new_status;
        friend.last_seen = 1;
        break;
      }
    }
    this.setState({ friends: friends });
  }

  public render(): JSX.Element {
    return (
      <div className="p-3 klamie rounded">
        <div className="lobby_container">
          <div className="left">
            <div className="avatar_holder p-2">
              <Image src={this.state.avatar} rounded />
            </div>
            <div className="chat rounded">
              <Chat />
            </div>
          </div>
          <div className="middle">
            <div className="notifications">
              <Notifications
                begin_game={this._play.bind(this)}
                set_party={this.set_party.bind(this)}
                update_friends={this.updateFriends.bind(this)}
                player_id={this.state.id}
                update_friend={this.updateFriendOnline.bind(this)}
              />
            </div>
          </div>
          <div className="right">
            <div className="user_info">
              <div className="d-flex justify-content-center shadow-sm p-2 rounded nick">
                {this.state.nick}
              </div>
              <div className="d-flex justify-content-center shadow-sm p-2 rounded clan">
                {this.state.clan}
              </div>
              <div className="d-flex justify-content-center mb-2">
                <Button variant="dark" size="sm" onClick={this.logOut}>
                  Log Out!
                </Button>
              </div>
            </div>
            <h2 className="d-flex justify-content-center">Party:</h2>
            <div className="lobby_team">
              <Party
                party={this.state.party}
                leader={this.state.party_leader}
                user_nick={this.state.nick}
              />
            </div>
            <h2 className="d-flex justify-content-center">Friends:</h2>
            <InviteFriend nick={this.state.nick} />
            <div className="lobby_friends">
              <FriendsContainer friends={this.state.friends} update_friends={this.updateFriends.bind(this)} />
            </div>
          </div>
        </div>
        <div className="bottom">
          <Button variant="dark" size="lg" onClick={this._play}>
            Play!
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Lobby)

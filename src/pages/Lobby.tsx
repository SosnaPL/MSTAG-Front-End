import React from 'react';
import { Button, Image, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL, get, CurrentUser } from '../components/constants';
import Notifications from '../components/notification_container';
import Friends from '../components/friends';
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

  constructor(props) {
    super(props)
    this.updateFriendOnline = this.updateFriendOnline.bind(this)
  }

  updateFriends() {
    console.log("update_friends")
    get("/users/profile/friends/")
      .then((res) => {
        this.setState({ friends: res.data })
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
    localStorage.removeItem("token")
    this.props.history.push("/")
  }

  fetch_player_profile() {
    get("/team")
      .then((res) => {
        this.setState({ party: res.data.members, party_leader: res.data.leader })
      })
      .catch((err) => {
        console.log(err)
      })
    get("/users/profile/friends/")
      .then((res) => {
        this.setState({ friends: res.data })
      })
      .catch((e) => {
        console.log(e.data);
      })
    fetch(API_URL + "/users/profile/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then(response => {
        response.json().then(json => {
          this.setState({
            nick: json.username,
            clan: json.player.clan ? json.player.clan.name : "No clan",
            avatar: json.player.avatar ? json.player.avatar : "src/public/avatar.jpg",
            id: json.player.id
          })

          CurrentUser.username = json.username;
        });
      });
  }

  play = () => {
    get("/game/request/")
      .then((res) => {
        let ws = new WebSocket(res.data)
        ws.onopen = () => {
          console.log("connected")
        }
      })
      .catch(() => {

      })
  }

  _play = () => {
    this.props.history.push("/game")
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

  componentDidMount() {
    this.fetch_player_profile();
  }

  public render(): JSX.Element {
    if (!this.state.nick) {
      return (
        <div className="d-flex justify-content-center">
          <h2>Logging in...</h2>
        </div>
      )
    }
    return (
      <div className="klamie">
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
              <Notifications set_party={this.set_party.bind(this)} update_friends={this.updateFriends.bind(this)} player_id={this.state.id} update_friend={this.updateFriendOnline.bind(this)} />
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
                <Button variant="outline-dark" size="sm" onClick={this.logOut}>
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
            <div className="lobby_friends">
              {this.state.friends.filter((friend) => { return friend.is_online }).map((friend) => (
                <Row key={friend.id}>
                  <Col className="d-flex justify-content-start pb-3">
                    <Friends friends={friend} update_friends={this.updateFriends.bind(this)} />
                  </Col>
                </Row>
              ))}
              {this.state.friends.filter((friend) => { return !friend.is_online }).map((friend) => (
                <Row key={friend.id}>
                  <Col className="d-flex justify-content-start pb-3">
                    <Friends friends={friend} update_friends={this.updateFriends.bind(this)} />
                  </Col>
                </Row>
              ))}
              <InviteFriend />
            </div>
          </div>
        </div>
        <div className="bottom">
          <Button variant="outline-dark" size="lg" onClick={this._play}>
            Play!
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Lobby)

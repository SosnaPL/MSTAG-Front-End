import React from 'react';
import { Button, Image, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL, get, post } from '../components/constants';
import Notifications from '../components/notification_container';
import Friends from '../components/friends';
import Party from '../components/party'

class Lobby extends React.Component<RouteComponentProps, any> {

  state = {
    nick: "",
    clan: "",
    avatar: "",
    friends: [],
    friends_online: [],
    friend_update_interval: null,
    party: [],
    party_leader: null,
  }

  constructor(props) {
    super(props)
    this.kick_member = this.kick_member.bind(this);
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

  kick_member(id) {
    this.setState({
      party: this.state.party.filter(el => el.id != id)
    })
    get("/team/kick/" + id.toString())
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err.data)
      })
  }

  logOut = () => {
    localStorage.removeItem("token")
    this.props.history.push("/")
  }

  fetch_player_profile() {
    get("/team")
      .then((res) => {
        console.log(res)
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
            avatar: json.player.avatar ? json.player.avatar : "src/public/avatar.jpg"
          })
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
    post("/notification/send/", { text: "ziemniak", time: Date.now() })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.fetch_player_profile();
    let self = this;
    let benis = window.setInterval(function activity() {
      get("/users/profile/friends/")
        .then((res) => {
          self.setState({ friends: res.data })
        })
        .catch(() => {
          localStorage.removeItem("token")
          self.props.history.push("/")
        })
    }, 60000)
    this.setState({ friend_update_interval: benis });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.friend_update_interval);
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
              Chat
            </div>
          </div>
          <div className="middle">
            <div className="notifications">
              <Notifications set_party={this.set_party.bind(this)} />
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
            <div className="lobby_team">
              <h2 className="d-flex justify-content-center">Party:</h2>
              <Party
                kick={this.kick_member.bind(this)}
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
                    <Friends friends={friend} />
                  </Col>
                </Row>
              ))}
              {this.state.friends.filter((friend) => { return !friend.is_online }).map((friend) => (
                <Row key={friend.id}>
                  <Col className="d-flex justify-content-start pb-3">
                    <Friends friends={friend} />
                  </Col>
                </Row>
              ))}
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

import React from 'react';
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL } from '../components/constants'
import Notifications from '../components/notification_container'
import Friends from '../components/friends'
import axios from 'axios';

class Lobby extends React.Component<RouteComponentProps, any> {

  state = {
    nick: "",
    clan: "",
    avatar: "",
    friends: [],
    friends_online: []
  }

  logOut = () => {
    localStorage.removeItem("token")
    this.props.history.push("/")
  }

  fetch_player_profile() {
    return fetch(API_URL + "/users/profile/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then(response => {
        axios.get(API_URL + "/users/profile/friends/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
          .then((res) => {
            console.log(res.data)
            this.setState({ friends: res.data })
          })
          .catch(() => {
          })
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
    axios.get(API_URL + "/game/request/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
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
    axios.post(API_URL + "/notification/send/", { text: "ziemniak", time: Date.now() }, { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  invite = () => {

  }

  componentDidMount() {
    //console.log(new URLSearchParams(window.location.href.split("?")[1]).get("invite"))
    this.fetch_player_profile();
    let self = this;
    window.setInterval(function activity() {
      axios.get(API_URL + "/users/profile/friends/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
        .then((res) => {
          self.setState({ friends: res.data })
        })
        .catch(() => {
          //localStorage.removeItem("token")
        })
    }, 60000)
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
      <Container className="klamie">
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
              <Notifications />
            </div>
            <div className="active_friends">
              {this.state.friends.filter((friend) => { return friend.is_online }).map((friend) => (
                <Row key={friend.id}>
                  {console.log(friend.last_seen, friend.username)}
                  <Col className="d-flex justify-content-start pb-3">
                    <Friends friends={friend} />
                  </Col>
                </Row>
              ))}
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
              <div className="d-flex justify-content-center shadow-sm p-2 rounded party_member mb-2">
                {this.state.nick}
              </div>
            </div>
            <h2 className="d-flex justify-content-center">Friends:</h2>
            <div className="lobby_friends">
              {this.state.friends.map((friend) => (
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
          <Button variant="outline-dark" size="sm" onClick={this.invite}>
            Invite
          </Button>
          <Button variant="outline-dark" size="lg" onClick={this._play}>
            Play!
          </Button>
        </div>
      </Container>
    );
  }
}

export default withRouter(Lobby)

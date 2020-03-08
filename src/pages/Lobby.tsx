import React from 'react';
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { API_URL } from '../components/constants'
import Friends from '../components/friends'
import axios from 'axios';

class Lobby extends React.Component<RouteComponentProps, any> {

  state = {
    nick: "",
    clan: "",
    avatar: "",
    friends: []
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
          console.log(json.player.friends)
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
  }

  componentDidMount() {
    this.fetch_player_profile();
  }

  public render(): JSX.Element {
    if (!this.state.nick) {
      return (
        <div className="d-flex justify-content-center">
          <h2>Loading...</h2>
        </div>
      )
    }
    return (
      <Container>
        <div className="lobby_container">
          <div className="left">
            <div className="avatar_holder p-2">
              <Image src={this.state.avatar} rounded />
            </div>
            <div className="chat rounded">
              Chat
            </div>
          </div>
          <div className="middle"></div>
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
          <Button variant="outline-dark" size="sm">
            Invite
          </Button>
          <Button variant="outline-dark" size="lg" onClick={this.play}>
            Play!
          </Button>
        </div>
      </Container>
    );
  }
}

export default withRouter(Lobby)

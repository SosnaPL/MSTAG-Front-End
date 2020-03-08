import React from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";

const API_URL = "http://25.64.141.174:8000/api/v1/users/profile/";

class Lobby extends React.Component<RouteComponentProps, any> {

  state = {
    nick: "",
    clan: "",
    avatar: ""
  }

  logOut = () => {
    localStorage.removeItem("token")
    this.props.history.push("/")
  }

  fetch_player_profile() {
    return fetch(API_URL, { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then(response => {
        console.log(response)
        response.json().then(json => {
          this.setState({ nick: json.username, clan: json.player.clan ? json.player.clan.name : "No clan", avatar: json.player.avatar ? json.player.avatar : "src/public/avatar.jpg" })
        });
      });
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
            <div className="avatar_holder">
              <Image src={this.state.avatar} roundedCircle />
            </div>
            <div className="shadow-lg flex-column p-3 chat rounded mt-2 chat">
              Chat
            </div>
          </div>
          <div className="middle"></div>
          <div className="right">
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
            <div className="lobby_team">
              <div className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
                Ktos
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <Button variant="outline-dark" size="sm">
            Invite
          </Button>
          <Button variant="outline-dark" size="lg">
            Play!
          </Button>
        </div>
      </Container>
    );
  }
}

export default withRouter(Lobby)

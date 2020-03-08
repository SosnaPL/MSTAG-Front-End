import React from 'react';
import { Row, Col, Container, Button, Image } from 'react-bootstrap';
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
        <Row>
          <Col className="p-2 col-3 d-flex justify-content-start">
            <Image src={this.state.avatar} roundedCircle />
          </Col>
          <Col className="col-7"></Col>
          <Col className="flex-column p-3 col-2">
            <div className="d-flex justify-content-center shadow-sm p-2 rounded nick">
              {this.state.nick}
            </div>
            <div className="d-flex justify-content-center shadow-sm p-2 rounded clan">
              {this.state.clan}
            </div>
            <div className="d-flex justify-content-center">
              <Button variant="outline-dark" size="sm" onClick={this.logOut}>
                Log Out!
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="shadow-lg flex-column p-3 col-3 chat rounded mt-2">
            Chat
          </Col>
          <Col className="col-7"></Col>
          <Col className="flex-column p-3 col-2">
            <div className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
              Ktos
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Button variant="outline-dark" size="sm">
              Invite
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Button variant="outline-dark" size="lg">
              Play!
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Lobby)

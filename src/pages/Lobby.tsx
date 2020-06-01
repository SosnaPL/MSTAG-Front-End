import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { withRouter, RouteComponentProps } from "react-router";
import { get, CurrentUser, get_suspense, Avatar } from '../components/constants';
import NotificationsContainer from '../components/notification_container';
import FriendsContainer, { FriendProps } from '../components/friends';
import Party, { PartyProps } from '../components/party';
import Chat from '../components/chat';
import InviteFriend from '../components/invite_friend';

interface LobbyState {
  id: number;
  nick: string;
  clan: string;
  avatar: string;
  friends: FriendProps[] | null;
  party: PartyProps[] | undefined;
  party_leader: PartyProps | undefined;
  play_button_enabled: boolean;
  in_game: boolean;
  online: string;
}

class Lobby extends React.Component<RouteComponentProps, LobbyState> {

  constructor(props: RouteComponentProps) {
    super(props)
    this.updateFriendOnline = this.updateFriendOnline.bind(this)
    this.updateFriends = this.updateFriends.bind(this)
    this.fetch_player_profile()
    console.log("constructor meme")
  }

  updatePlayButton(button_state: boolean) {
    this.setState({ play_button_enabled: button_state })
  }

  updateFriends() {
    get("/users/profile/friends/")
      .then((res) => {
        this.setState({ friends: res.data })
        console.log(this.state.friends)
      })
      .catch(() => {
        this.setState({ friends: null })
      })
  }

  set_party() {
    get("/team")
      .then((res) => {
        this.updatePlayButton(!res.data.leader || res.data.leader.username == this.state.nick)
        this.setState({ party: res.data.members, party_leader: res.data.leader })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  logOut = () => {
    localStorage.removeItem("token")
    window.location.reload();
  }

  fetch_player_profile() {
    CurrentUser.token = localStorage.getItem("token");
    const team = get_suspense("/team/")
    const friends = get_suspense("/users/profile/friends/");
    const profile = get_suspense("/users/profile/");
    const online = get_suspense("/users/online/");
    //const error = get_suspense("/error/");
    this.state = {
      party: team.response.members,
      party_leader: team.response.leader,
      friends: friends.ok ? friends.response : null,
      nick: profile.response.username,
      clan: profile.response.clan ? profile.response.clan.name : "No clan",
      avatar: profile.response.avatar ? profile.response.avatar : Avatar,
      id: profile.response.id,
      online: online.response.count,
      play_button_enabled: true,
      in_game: false
    }
    console.log(this.state)
    CurrentUser.username = profile.response.username;
    CurrentUser.player_id = profile.response.id;
  }

  _play = () => {
    this.setState({ in_game: true }, () => {
      this.props.history.push("/game");
    })
  }

  updateFriendOnline = (friend_id: number, new_status: boolean) => {
    if (this.state.friends) {
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
              <Chat
                friends={this.state.friends}
              />
            </div>
          </div>
          <div className="middle">
            <div className="notifications">
              <NotificationsContainer
                begin_game={this._play.bind(this)}
                set_party={this.set_party.bind(this)}
                update_friends={this.updateFriends.bind(this)}
                player_id={this.state.id}
                update_friend={this.updateFriendOnline.bind(this)}
                in_game={this.state.in_game}
              />
            </div>
          </div>
          <div className="right">
            <div className="user_info">
              <div className="d-flex justify-content-center shadow-sm p-2 rounded nick">
                {this.state.nick}
              </div>
              <div className="d-flex justify-content-center shadow-sm p-2 rounded clan" style={{ margin: "0px" }}>
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
            <h2 className="d-flex justify-content-center" style={{ margin: "0px" }}>Friends:</h2>
            <InviteFriend nick={this.state.nick} button_status={!this.state.friends} />
            <div className="lobby_friends">
              <FriendsContainer
                friends={this.state.friends}
                update_friends={this.updateFriends.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="bottom">
          <Button disabled={!this.state.play_button_enabled} variant="dark" size="lg" onClick={this._play}>
            Play!
          </Button>
          <div className="online_counter">
            {this.state.online}
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(Lobby)

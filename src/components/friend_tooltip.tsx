import React from 'react';
import { get } from './constants';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull, faCrown, faGamepad } from '@fortawesome/free-solid-svg-icons';

interface FriendTooltipState {
  username: string;
  avatar: string;
  kills: number;
  wins: number;
  games: number;
  last_seen: number;
  clan: any;
  loading: boolean;
}

export default class FriendTooltip extends React.Component<{ id: number }, FriendTooltipState> {

  getUserInfo = (id: number) => {
    if (id === null) {
      return
    }
    get("/user/" + id.toString() + "/")
      .then((resp) => {
        this.setState(resp.data, () => {
          this.setState({ loading: false })
        })
      })
  }

  componentDidUpdate(prevProps: { id: number }) {
    if (prevProps.id != this.props.id) {
      this.setState({ loading: true }, () => {
        this.getUserInfo(this.props.id);
      })
    }
  }

  public render(): JSX.Element {
    if (this.props.id === null || this.state === null || (this.state && this.state.loading)) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ width: "240px", height: "75px" }}>
          <div className="spinner-border" role="projects_load" />
        </div>
      )
    }
    return (
      <div className="friend_tooltip">
        <div className="friend_tooltip_avatar">
          <Image
            src={
              this.state.avatar ? this.state.avatar : require("../public/avatar.jpg")
            }
            rounded
          />
        </div>
        <div className="friend_tooltip_menu">
          <div className="friend_tooltip_info">
            {console.log(this.state.username)}
            <span>{this.state.username}</span>
            <span>{this.state.clan ? this.state.clan : "No clan"}</span>
          </div>
          <div className="friend_tooltip_stats">
            <span>
              <FontAwesomeIcon
                className="stats_icon"
                size="1x"
                icon={faSkull}
              />
              &nbsp;{this.state.kills}
            </span>
            <span>
              <FontAwesomeIcon
                className="stats_icon"
                size="1x"
                icon={faCrown}
              />
              &nbsp;{this.state.wins}
            </span>
            <span>
              <FontAwesomeIcon
                className="stats_icon"
                size="1x"
                icon={faGamepad}
              />
              &nbsp;{this.state.games}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
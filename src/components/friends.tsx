import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { get } from '../components/constants'
import { API_URL } from '../components/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface FriendsProps {
  id: number,
  username: string;
  last_seen: number;
  is_online: boolean;
}

export default class Friends extends React.Component<{ friends: FriendsProps, update_friends: Function }> {

  timeSince(seconds: number) {
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + "mt";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }


  invite_friend = (id: number) => {
    console.log("sending invite");
    axios.get(API_URL + "/team/invite/" + id.toString(), { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then(() => {
      })
      .catch((err) => {
        console.log(err)
      })
  }

  remove_friend = (id: number) => {
    get('/users/profile/friends/remove/' + id.toString() + "/")
      .then(() => {
        this.props.update_friends()
      })
      .catch(() => {

      })
  }

  public render(): JSX.Element {
    const {
      username, last_seen, id, is_online
    } = this.props.friends;

    if (is_online) {
      return (
        <div className="friend_container p-2 rounded">
          <div className="friend_info">
            🟢&nbsp;{username}
          </div>
          <div className="friend_menu">
            <FontAwesomeIcon className="remove_icon" size="1x" icon={faUserTimes} onClick={() => this.remove_friend(id)} />
            <FontAwesomeIcon className="invite_icon" size="1x" icon={faPlusCircle} onClick={() => this.invite_friend(id)} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="friend_container p-2 rounded">
          <div className="friend_info">
            ⚫&nbsp;{username}
          </div>
          <div className="friend_menu">
            <FontAwesomeIcon className="remove_icon" size="1x" icon={faUserTimes} onClick={() => this.remove_friend(id)} />
            <span style={{ paddingRight: "5px" }}>{this.timeSince(last_seen)}</span>
          </div>
        </div>
      );
    }
  }
}

export class FriendsContainer extends React.Component<{ friends: FriendsProps[], update_friends: Function }> {
  public render(): JSX.Element {
    return (
      <>
        {this.props.friends.filter((friend) => { return friend.is_online }).map((friend) => (
          <Row key={friend.id}>
            <Col className="d-flex justify-content-start pb-3">
              <Friends friends={friend} update_friends={this.props.update_friends} />
            </Col>
          </Row>
        ))}
        {this.props.friends.filter((friend) => { return !friend.is_online }).map((friend) => (
          <Row key={friend.id}>
            <Col className="d-flex justify-content-start pb-3">
              <Friends friends={friend} update_friends={this.props.update_friends} />
            </Col>
          </Row>
        ))}
      </>
    )
  }
}

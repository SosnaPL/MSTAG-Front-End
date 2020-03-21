import React from 'react';
import { Card } from 'react-bootstrap';
import { API_URL } from '../components/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface FriendsProps {
  id: number,
  username: string;
  last_seen: number;
  is_online: boolean;
}

export default class Friends extends React.Component<{ friends: FriendsProps }> {

  timeSince(date: number) {

    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
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

  public render(): JSX.Element {
    const {
      username, last_seen, id, is_online
    } = this.props.friends;

    if (is_online) {
      return (
        <div className="friend_container">
          <div className="friend_status">
            <Card className="d-flex align-items-center">
              <Card.Title>{username}</Card.Title>
              <Card.Text>Online</Card.Text>
              <div className="invite_container" style={{ backgroundColor: "rgba(33, 36, 61, 0.6)" }}>
                <FontAwesomeIcon className="invite_icon" size="1x" icon={faPlusCircle} onClick={() => this.invite_friend(id)} />
                <FontAwesomeIcon className="chat_icon" size="1x" icon={faCommentDots} />
              </div>
            </Card>
          </div>
        </div>
      );
    }
    else {
      return (
        <Card className="shadow rounded d-flex align-items-center">
          <Card.Title>{username}</Card.Title>
          <Card.Text>Last seen: {this.timeSince(last_seen)} ago</Card.Text>
        </Card>
      );
    }

  }
}

import React from 'react';
import { Card } from 'react-bootstrap';
import { API_URL } from '../components/constants'
import axios from 'axios';

interface FriendsProps {
  id: number,
  username: string;
  last_seen: number;
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
    axios.get(API_URL + "/team/invite/" + id.toString(), { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  public render(): JSX.Element {
    const {
      username, last_seen, id
    } = this.props.friends;
    return (
      <Card className="shadow rounded d-flex align-items-center" onClick={() => this.invite_friend(id)}>
        <Card.Title>{username}</Card.Title>
        <Card.Text>Last seen: {this.timeSince(last_seen)} ago</Card.Text>
      </Card>
    );
  }
}

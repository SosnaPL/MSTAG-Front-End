import React from 'react';
import { API_URL } from './constants';
import { Button } from 'react-bootstrap';
import axios from 'axios';


interface NotificationsProps {
  team_id?: number,
  type: string
}

export default class NotificationsButton extends React.Component<NotificationsProps> {

  accept_invite(id: number) {
    axios.get(API_URL + "/team/join/" + id.toString() + "/", { headers: { Authorization: "Token " + localStorage.getItem("token") } })
      .then(() => {

      })
      .catch(() => {

      })
  }

  public render(): JSX.Element {

    const {
      type, team_id
    } = this.props

    if (type == "invited to team")
      return (
        <Button onClick={() => this.accept_invite(team_id)}>
          Accept!
        </Button>
      );
    else {
      return (
        <>
        </>
      );
    }
  }
}

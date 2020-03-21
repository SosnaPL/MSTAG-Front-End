import React from 'react';
import { get } from './constants';
import { Button } from 'react-bootstrap';

export default class TeamButton extends React.Component<{ members: number }> {

  leave_team() {
    get("/team/leave/")
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err.data)
      })
  }

  public render(): JSX.Element {
    if (this.props.members > 1) {
      return (
        <div className="d-flex justify-content-center">
          <Button variant="outline-dark" size="sm" onClick={this.leave_team}>Leave</Button>
        </div>
      )
    }
    else {
      return (
        <>
        </>
      )
    }
  }
}
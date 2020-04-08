import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { get } from '../components/constants';

export interface PartyProps {
  id: number;
  username: string;
  kills: number;
  wins: number;
  games: number;
  clan: string | null;
  avatar: string;
  last_seen: number;
}


export default class Party extends React.Component<{ party: PartyProps[] | undefined, leader: PartyProps | undefined, user_nick: string }> {

  kick_member(id: number) {
    get("/team/kick/" + id.toString())
      .then(() => {
      })
      .catch((err) => {
        console.log(err.data)
      })
  }

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
    console.log(this.props.party, this.props.leader)
    if (!this.props.leader) {
      return (
        <div className="party_container">
          <div className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
            ⭐{this.props.user_nick}
          </div>
        </div>
      )
    }
    else if (this.props.user_nick == this.props.leader.username) {
      return (
        <div className="party_container">
          <div key={0} className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
            ⭐{this.props.leader.username}
          </div>
          {this.props.party.filter((teammate) => { return teammate.username != this.props.leader.username }).map((teammate, index) => (
            <div key={index + 1} className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
              {teammate.username}
              <FontAwesomeIcon className="kick_icon" size="1x" icon={faTimes} onClick={this.kick_member.bind(this, teammate.id)} />
            </div>
          ))}
          {
            this.props.party.length > 1
              ?
              <div className="d-flex justify-content-center">
                <Button variant="dark" size="sm" onClick={this.leave_team}>Leave</Button>
              </div>
              :
              <></>
          }
        </div>
      )
    }
    else {
      return (
        <div className="party_container">
          <div key={0} className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
            ⭐{this.props.leader.username}
          </div>
          {this.props.party
            .filter(teammate => {
              return teammate.username != this.props.leader.username;
            })
            .map((teammate, index) => (
              <div key={index + 1} className="d-flex justify-content-center shadow-sm p-2 rounded party_member">
                {teammate.username}
              </div>
            ))}
          {
            this.props.party.length > 1
              ?
              <div className="d-flex justify-content-center">
                <Button variant="dark" size="sm" onClick={this.leave_team}>Leave</Button>
              </div>
              :
              <></>
          }
        </div>
      );
    }
  }
}
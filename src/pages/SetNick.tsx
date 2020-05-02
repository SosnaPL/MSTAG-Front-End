import React, { ChangeEvent, KeyboardEvent } from 'react';
import { get, post } from "../components/constants";
import { RouteComponentProps } from 'react-router';
import { Button } from 'react-bootstrap';

interface SetNickState {
  username_available: boolean;
  username: string | null;
}

export default class SetNick extends React.Component<RouteComponentProps, SetNickState> {

  constructor(props) {
    super(props)
    window.history.replaceState({}, "MSTAG", "/");
    this.state = {
      username_available: false,
      username: null
    }
  }

  typingTimer: any;
  typingTimeout: number = 500;

  sendInvite = () => {
    if (!this.state.username) {
      return;
    }
    console.log("send invite")
    post("/users/set_username/", { username: this.state.username })
      .then(() => {
        window.location.href =
          location.protocol +
          "//" +
          location.hostname +
          (location.port ? ":" + location.port : "") +
          "/";
      })
      .catch((err) => {
        console.log(err)
      });
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value.toString();
    this.setState({ username: name }, () => {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.checkUserExists(name);
      }, this.typingTimeout);
    })
  }

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.sendInvite()
    }
  }

  checkUserExists = (name: string) => {
    get("/users/check_exists/" + name)
      .then((response) => {
        this.setState({
          username_available: !response.data.exists
        })
      })
      .catch((e) => {
        console.log(e)
      });
  }

  public render(): JSX.Element {
    return (
      <>
        <div>
          Username: <input type="text" spellCheck="false" onChange={this.onChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
          {this.state.username_available ? "✔️" : "❌"}
        </div>
        <Button variant="outline-dark" disabled={!this.state.username_available} onClick={this.sendInvite}>Send</Button>
      </>
    )
  }
}
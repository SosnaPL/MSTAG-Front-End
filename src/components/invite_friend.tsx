import React, { ChangeEvent, KeyboardEvent } from 'react';
import { get } from '../components/constants';
import { Button } from 'react-bootstrap';

interface InviteFriendState {
  modal_visiblity: string,
  user_exists: boolean,
  id: number | null,
  usernameInputRef: React.RefObject<HTMLInputElement> | null,
  invite_button_disabled: boolean,
}

interface InviteFriendProps {
  nick: string,
  button_status: boolean
}

export default class InviteFriend extends React.Component<InviteFriendProps, InviteFriendState> {

  constructor(props: InviteFriendProps) {
    super(props);
    this.state = {
      modal_visiblity: "none",
      user_exists: false,
      id: null,
      usernameInputRef: React.createRef(),
      invite_button_disabled: true,
    }
  }

  typingTimer: any;
  typingTimeout: number = 500;

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.value.toString();
    clearTimeout(this.typingTimer);
    if (name && name != this.props.nick) {
      this.typingTimer = setTimeout(() => {
        this.checkUserExists(name);
      }, this.typingTimeout);
    }
    else {
      this.setState({ invite_button_disabled: true, user_exists: false })
    }
  }

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !this.state.invite_button_disabled) {
      this.sendInvite()
    }
  }

  checkUserExists = (name: string) => {
    get("/users/check_exists/" + name)
      .then((response) => {
        this.setState({
          user_exists: response.data.exists, id: response.data.exists ? response.data.id : null, invite_button_disabled: !response.data.exists
        })
      })
      .catch((e) => {
        console.log(e)
      });
  }

  showModal = () => {
    this.setState({ modal_visiblity: "flex" }, this.clearUsernameInput.bind(this))
  }

  clearUsernameInput = () => {
    this.state.usernameInputRef.current.value = "";
    this.state.usernameInputRef.current.focus();
    this.setState({ user_exists: false, invite_button_disabled: true })
  }

  hideModal = () => {
    this.setState({ modal_visiblity: "none", user_exists: false, invite_button_disabled: true })
  }

  sendInvite = () => {
    if (!this.state.id) {
      return;
    }
    console.log("send invite")
    get("/users/profile/friends/add/" + this.state.id.toString() + "/")
      .finally(() => {
        this.hideModal();
      })
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="d-flex justify-content-center">
          <Button disabled={this.props.button_status || this.props.nick.includes("Guest")} variant="dark" onClick={this.showModal.bind(this)}>Send Friend Request</Button>
        </div>
        <div className="modal_add_friends_container" style={{ display: this.state.modal_visiblity }}>
          <div className="modal_add_friends">
            <div className="modal_close" onClick={this.hideModal.bind(this)}>
              &times;
            </div>
            <div>
              Username: <input ref={this.state.usernameInputRef} type="text" spellCheck="false" onChange={this.onChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}
                style={{
                  color: "white",
                  backgroundColor: "#3c4043",
                  border: "none",
                  borderRadius: "0.25rem"
                }}
              />
            </div>
            <div>
              {this.state.user_exists ? "✔️" : "❌"}
            </div>
            <Button variant="outline-dark" disabled={this.state.invite_button_disabled} onClick={this.sendInvite}
              style={{ color: "#3c4043" }}
            >
              Send
            </Button>
          </div>
        </div>
      </>
    );
  }
}

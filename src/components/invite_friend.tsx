import React from 'react';
import { get } from '../components/constants';
import { Button } from 'react-bootstrap';

export default class InviteFriend extends React.Component {

  state = {
    modal_visiblity: "none",
    user_exists: false,
    id: null,
    typingTimer: null,
    typingTimeout: 500,
    usernameInputRef: null,
    invite_button_disabled: true
  }

  constructor(props) {
    super(props);
    this.state.usernameInputRef = React.createRef();
  }

  onChange = (e) => {
    let name = e.target.value.toString();
    clearTimeout(this.state.typingTimer);
    if (name) {
      this.state.typingTimer = setTimeout(() => {
        this.checkUserExists(name);
      }, this.state.typingTimeout);
    }
  }

  checkUserExists = (name) => {
    get("/users/check_exists/" + name)
      .then((response) => {
        this.setState({
          user_exists: response.data.exists, id: response.data.exists ? response.data.id : null, invite_button_disabled: !response.data.exists
        })
      })
      .catch(() => {

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
    get("/users/profile/friends/add/" + this.state.id.toString())
      .then(() => {
        this.hideModal();
      })
      .catch(() => {
        this.hideModal();
      });
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="d-flex justify-content-center">
          <Button variant="outline-dark" onClick={this.showModal.bind(this)}>Send Friend Request</Button>
        </div>
        <div className="modal_add_friends_container" style={{ display: this.state.modal_visiblity }}>
          <div className="modal_add_friends">
            <div className="modal_close" onClick={this.hideModal.bind(this)}>
              &times;
            </div>
            <div>
              Username: <input ref={this.state.usernameInputRef} type="text" spellCheck="false" onChange={this.onChange.bind(this)} />
            </div>
            <div>
              {this.state.user_exists ? "✔️" : "❌"}
            </div>
            <Button variant="outline-dark" disabled={this.state.invite_button_disabled} onClick={this.sendInvite}>Send</Button>
          </div>
        </div>
      </>
    );
  }
}

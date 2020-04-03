import React from 'react';
import { post, get } from '../components/constants';
import ScrollableFeed from 'react-scrollable-feed';
import { Twemoji } from 'react-emoji-render';

export default class Chat extends React.Component {

  state = {
    messages: [],
    chat_server: null,
    error: "",
    connecting: true,
  }

  ws_unmounted = false;

  ws_server = () => {
    get("/server_config/")
      .then((res) => {
        this.setState({ connecting: true });
        let ws = new WebSocket(res.data.chat)
        this.setState({ chat_server: ws })
        ws.onopen = () => {
          this.setState({ connecting: false, error: "" })
        }
        ws.onmessage = (e) => {
          let message = JSON.parse(e.data);
          if (this.state.messages.length && this.state.messages[this.state.messages.length - 1].name == message.name) {
            let meme = this.state.messages;
            meme[meme.length - 1].text += "\n" + message.text;
            this.setState({ messages: meme });
          }
          else {
            this.setState({ messages: [...this.state.messages, message] });
          }
        }
        ws.onclose = (_e) => {
          if (!this.ws_unmounted) {
            setTimeout(this.ws_server, 10000);
          }
        }
        ws.onerror = (_e) => {
          setTimeout(this.ws_server, 10000);
          this.setState({ connecting: false, error: "Connection failed :(" })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  chatSendMessage = (message) => {
    post("/chat/send/", { message })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value != "") {
        this.chatSendMessage(e.target.value)
        e.target.value = ""
      }
    }
  }

  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  componentWillUnmount() {
    this.ws_unmounted = true;
    if (this.state.chat_server) {
      this.state.chat_server.close();
    }
  }

  componentDidMount() {
    this.ws_server()
  }

  public render(): JSX.Element {
    if (this.state.connecting) {
      return (
        <>
          <p>Connecting...</p>
          <div className="input_holder" style={{ position: "absolute", bottom: "0px", left: "0px" }}>
            <input
              disabled
              type="text"
              placeholder="Send message!"
              onKeyDown={this.handleKeyDown.bind(this)}
            />
          </div>
        </>
      )
    }
    if (this.state.error) {
      return (
        <>
          <p>{this.state.error}</p>
          <div className="input_holder" style={{ position: "absolute", bottom: "0px", left: "0px" }}>
            <input
              disabled
              type="text"
              placeholder="Send message!"
              onKeyDown={this.handleKeyDown.bind(this)}
            />
          </div>
        </>
      )
    }
    return (
      <>
        <div className="chat_messages">
          <div className="scrollable-wrapper" style={{ maxHeight: "100%" }}>
            <ScrollableFeed>
              {this.state.messages.map((message, index) => (
                <div className="message_container" key={index}>
                  <div
                    className="message_name"
                    style={{
                      borderRight:
                        "1px solid #" +
                        this.intToRGB(this.hashCode(message.name)).toString()
                    }}
                  >
                    {message.name}
                  </div>
                  <div className="message_text">
                    {message.text.split("\n").map((part, index2) => (
                      <div key={index2}>
                        <Twemoji text={part} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollableFeed>
          </div>
        </div>
        <div className="input_holder">
          <input
            type="text"
            placeholder="Send message!"
            onKeyDown={this.handleKeyDown.bind(this)}
          />
        </div>
      </>
    );
  }
}

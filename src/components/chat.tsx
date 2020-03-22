import React from 'react';
import { post, get } from '../components/constants';
import ScrollableFeed from 'react-scrollable-feed';
import { Twemoji } from 'react-emoji-render';

export default class Chat extends React.Component {

  state = {
    messages: [],
    chat_server: null
  }

  ws_server = () => {
    get("/server_config/")
      .then((res) => {
        let ws = new WebSocket(res.data.chat)
        this.setState({ chat_server: ws })
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
    this.state.chat_server.close();
  }

  componentDidMount() {
    this.ws_server()
  }

  public render(): JSX.Element {
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
            style={{
              left: "0",
              bottom: "0",
              position: "absolute",
              width: "100%"
            }}
            onKeyDown={this.handleKeyDown.bind(this)}
          />
        </div>
      </>
    );
  }
}

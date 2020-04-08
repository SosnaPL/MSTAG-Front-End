import React, { KeyboardEvent } from 'react';
import { post, get } from '../components/constants';
import ScrollableFeed from 'react-scrollable-feed';
import { Twemoji } from 'react-emoji-render';
import { Button } from 'react-bootstrap';

enum ChatType {
  GLOBAL = "global",
  PARTY = "party",
  NONE = "",
}

interface ChatState {
  global_messages: string[];
  party_messages: string[];
  has_unread_messages: Set<string>;
  chat_server: WebSocket | null;
  error: string;
  connecting: boolean;
  current_chat_tab: ChatType;
}

export default class Chat extends React.Component<{}, ChatState> {

  state = {
    global_messages: [],
    party_messages: [],
    has_unread_messages: new Set<string>(),
    chat_server: null,
    error: "",
    connecting: true,
    current_chat_tab: ChatType.GLOBAL,
  }

  ws_unmounted = false;

  ws_server = () => {
    get("/server_config/")
      .then((res) => {
        this.setState({ connecting: true });
        let ws = new WebSocket(res.data.chat)
        this.setState({ chat_server: ws })
        ws.onopen = () => {
          ws.send(JSON.stringify(localStorage.getItem("token")));
          this.setState({ connecting: false, error: "" })
        }
        ws.onmessage = (e) => {
          let message = JSON.parse(e.data);
          console.log(message)
          let chat_type = message.source + "_messages";
          let chat_type_state = {}
          chat_type_state[chat_type] = [...this.state[chat_type], message]
          if (this.state.current_chat_tab != message.source) {
            let current_unread: Set<string> = this.state.has_unread_messages as Set<string>;
            current_unread.add(message.source);
            this.setState({ has_unread_messages: current_unread })
          }
          if (this.state[chat_type].length && message.name != "*" && this.state[chat_type][this.state[chat_type].length - 1].name == message.name) {
            let meme = this.state[chat_type];
            meme[meme.length - 1].text += "\n" + message.text;
            chat_type_state[chat_type] = meme;
          }
          this.setState(chat_type_state);
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

  chatSendMessage = (message: string) => {
    return new Promise((resolve, reject) => {
      post("/chat/send/" + this.state.current_chat_tab + "/", { message })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
    });
  }

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const inp: HTMLInputElement = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      if (inp.value != "") {
        this.chatSendMessage(inp.value).then(() => {
          inp.value = ""
        }).catch(() => { })
      }
    }
  }

  hashCode(str: string) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i: number) {
    let c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  setChatType(chat_type: ChatType) {
    let current_unread: Set<string> = this.state.has_unread_messages as Set<string>;
    current_unread.delete(chat_type);
    this.setState({ current_chat_tab: chat_type, has_unread_messages: current_unread })
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
        <div className="chat_type">
          <Button
            variant="dark"
            size="sm"
            disabled={this.state.current_chat_tab == ChatType.GLOBAL ? true : false}
            onClick={this.setChatType.bind(this, ChatType.GLOBAL)}
            style={{
              backgroundColor: this.state.has_unread_messages.has(ChatType.GLOBAL) ? "red" : "",
            }}
          >
            Global
          </Button>
          <Button
            variant="dark"
            size="sm"
            disabled={this.state.current_chat_tab == ChatType.PARTY ? true : false}
            onClick={this.setChatType.bind(this, ChatType.PARTY)}
            style={{
              backgroundColor: this.state.has_unread_messages.has(ChatType.PARTY) ? "red" : "",
            }}
          >
            Party
          </Button>
        </div>
        <div className="chat_messages">
          <div className="scrollable-wrapper" style={{ maxHeight: "100%" }}>
            <ScrollableFeed>
              {this.state[this.state.current_chat_tab + "_messages"].map(
                (message, index) => (
                  <div className="message_container" key={index}>
                    <div
                      className="message_name"
                      style={{
                        borderRight:
                          "2px solid #" +
                          this.intToRGB(this.hashCode(message.name)).toString(),
                      }}
                    >
                      {message.name}
                    </div>
                    <div className="message_text">
                      {message.text
                        .split("\n")
                        .map((part: string, index2: number) => (
                          <div key={index2}>
                            {message.name == "*" ? (
                              <span style={{ fontStyle: "italic" }}>
                                <Twemoji text={part} />
                              </span>
                            ) : (
                                <Twemoji text={part} />
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
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

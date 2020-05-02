import React from "react";
import { get } from "../components/constants";
import { RouteComponentProps } from "react-router";

export default class LoginAsGuest extends React.Component<RouteComponentProps, {}> {
  componentDidMount() {
    get("/guest_login/")
      .then((response) => {
        console.log("Logged in as guest");
        localStorage.setItem("token", response.data.token);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return <h2>Loading...</h2>;
  }
}

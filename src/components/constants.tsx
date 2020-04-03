import axios from "axios";
import useFetch from 'fetch-suspense';

export const API_URL = "http://25.64.141.174:8000/api/v1";

export function get(url): Promise<any> {
  return axios.get(API_URL + url, { headers: { Authorization: "Token " + localStorage.getItem("token") } });
}

export function post(url, data): Promise<any> {
  if (localStorage.getItem("token")) {
    return axios.post(API_URL + url, data, { headers: { Authorization: "Token " + localStorage.getItem("token") } });
  }
  else {
    return axios.post(API_URL + url, data);
  }
}

export function get_suspense(url): any {
  return useFetch(
    API_URL + url,
    {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }
  ) as any;
}
export const CurrentUser = { username: "", player_id: -1 };

export const GameServer = { address: "" };
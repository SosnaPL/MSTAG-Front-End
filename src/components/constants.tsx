import axios from "axios";
import useFetch from 'fetch-suspense';

export const API_URL = "http://25.64.141.174:8000/api/v1";

export function get(url: string): Promise<any> {
  if (CurrentUser.token) {
    return axios.get(API_URL + url, { headers: { Authorization: "Token " + CurrentUser.token } });
  }
  else {
    return axios.get(API_URL + url)
  }
}

export function post(url: string, data: Object | string): Promise<any> {
  if (CurrentUser.token) {
    return axios.post(API_URL + url, data, { headers: { Authorization: "Token " + CurrentUser.token } });
  }
  else {
    return axios.post(API_URL + url, data);
  }
}

export function get_suspense(url: string): any {
  return useFetch(
    API_URL + url,
    {
      method: "GET",
      headers: {
        Authorization: "Token " + CurrentUser.token
      }
    },
    {
      metadata: true
    }
  ) as any;
}
export const CurrentUser = { username: "", player_id: -1, token: "" };

export const GameServer = { address: "" };
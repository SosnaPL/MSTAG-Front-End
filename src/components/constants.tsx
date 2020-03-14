import axios from "axios";

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
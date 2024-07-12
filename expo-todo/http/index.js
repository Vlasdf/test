import axios from "axios";

export const API_URL = "http://192.168.100.6:5000";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

export default $api;
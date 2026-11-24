import axios, { AxiosInstance } from "axios";

const PROJECT_ID = process.env.MP_PROJECT_ID ?? "";
const SERVICE_ACCOUNT = process.env.MP_SERVICE_ACCOUNT ?? "";
const SERVICE_SECRET = process.env.MP_SERVICE_SECRET ?? "";

function basicAuth(): string {
  return Buffer.from(SERVICE_ACCOUNT + ":" + SERVICE_SECRET).toString("base64");
}

export const mixpanelQueryApi: AxiosInstance = axios.create({
  baseURL: "https://mixpanel.com/api/query",
  headers: {
    Authorization: "Basic " + basicAuth(),
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const mixpanelEngageApi: AxiosInstance = axios.create({
  baseURL: "https://mixpanel.com/api/query",
  headers: {
    Authorization: "Basic " + basicAuth(),
    Accept: "application/json",
  },
});

export { PROJECT_ID };

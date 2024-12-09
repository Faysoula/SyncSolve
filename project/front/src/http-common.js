import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.10.208:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

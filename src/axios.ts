import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8090/api",
});

instance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        return config;
    }
);
instance.defaults.withCredentials = true;

export default instance;


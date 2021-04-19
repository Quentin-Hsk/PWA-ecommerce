import { withConfiguration } from "./config";
import Cookies from "js-cookie";

const fetcher = function fetcher(method: string) {
    return function (url: string, payload?: any, type = "application/json;charset=UTF-8") {
        return withConfiguration((config: any) => {
            return fetch("".concat(config["serverUrl"]).concat(url), {
                method,
                headers: type === "" ? new Headers({
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }) : new Headers({
                    "Content-Type": type,
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }),
                body:
                    payload !== undefined
                        ? type !== "application/json;charset=UTF-8"
                            ? payload
                            : JSON.stringify(payload)
                        : undefined
            }).then(function (result) {
                if (result.status === 401) window.location.href = "/login/signin";
                if (result.ok === false) return undefined;
                if (result.status === 204) return "";
                return result.json();
            });
        });
    };
};

export const post = fetcher("POST");
export const get = fetcher("GET");
export const deleteMethod = fetcher("DELETE");
export const put = fetcher("PUT");

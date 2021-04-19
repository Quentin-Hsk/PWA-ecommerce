import config from '../config.json'

interface Config {
    dev: any,
    prod: any,
    [key: string]: any
}
const env: string = process.env.REACT_APP_ENV || "dev";

export const withConfiguration = (cb: Function) => cb((config as Config)[env])
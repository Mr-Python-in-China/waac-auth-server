import "server-only";

if (!process.env.DOMAIN) throw new Error("envirment variable DOMAIN not set");
export const DOMAIN = process.env.DOMAIN;
export const BASE_URL = process.env.BASE_URL || "https://" + DOMAIN;
export const MAP_URL = process.env.MAP_URL;

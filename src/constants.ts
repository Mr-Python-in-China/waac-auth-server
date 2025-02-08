if (!process.env.DOMAIN) throw new Error("envirment variable DOMAIN not set");
export const DOMAIN = process.env.DOMAIN;
export const BASE_URL = process.env.BASE_URL || "https://" + DOMAIN;

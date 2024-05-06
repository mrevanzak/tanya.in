import { env } from "@/env";

export const siteConfig = {
  title: "Tanya.in",
  description:
    "Chatbot apps for ITS students to ask for internal campus information.",
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  url: env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000",
};

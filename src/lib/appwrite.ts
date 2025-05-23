// const sdk = require("node-appwrite");

import { Client, Messaging, Users } from "node-appwrite";

// Init SDK
export const client = new Client();

export const messaging = new Messaging(client);

export const users = new Users(client);

export { ID } from "node-appwrite";

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(`${process.env.APPWRITE_PROJECT_ID}`) // Your project ID
  .setKey(`${process.env.APPWRITE_API_KEY}`); // Your secret API key

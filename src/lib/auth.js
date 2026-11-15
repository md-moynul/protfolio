import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "portfolio");

const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "mdmoynulislam.dev@gmail.com"
).trim().toLowerCase();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "better_auth_default_secret_min_32_chars_long_12345",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userEmail = user.email?.trim().toLowerCase();

          // Disallow any unauthorized email registration
          if (userEmail !== ADMIN_EMAIL) {
            throw new Error(
              "Registration is closed. Only the portfolio administrator is authorized."
            );
          }

          return {
            data: {
              ...user,
              role: "admin",
            },
          };
        },
      },
    },
  },
});

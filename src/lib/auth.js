import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "portfolio");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "better_auth_default_secret_min_32_chars_long_12345",
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
          const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          let role = "user";

          if (adminEmail && user.email?.toLowerCase() === adminEmail) {
            role = "admin";
          } else {
            // First user registered automatically gets admin role
            const count = await db.collection("user").countDocuments();
            if (count === 0) {
              role = "admin";
            }
          }

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },
});

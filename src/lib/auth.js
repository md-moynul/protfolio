import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { client } from "@/lib/mongodb";
import { getAdminEmail } from "@/lib/admin";

const db = client.db(process.env.MONGODB_DB || "portfolio");

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: BETTER_AUTH_SECRET environment variable is required in production."
    );
  }
}

const authSecret =
  secret || "dev_secret_only_for_local_development_at_least_32_chars";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: authSecret,
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
          const adminEmail = getAdminEmail();
          const userEmail = user.email?.trim().toLowerCase();
          const allowSignup = process.env.ALLOW_ADMIN_SIGNUP === "true";

          // Reject every sign-up unless BOTH are true:
          // process.env.ALLOW_ADMIN_SIGNUP === "true" AND the email equals ADMIN_EMAIL
          if (!allowSignup || !adminEmail || userEmail !== adminEmail) {
            throw new APIError("FORBIDDEN", {
              message:
                "Sign-up is currently disabled. Contact administrator for access.",
            });
          }

          // Never create any other role
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

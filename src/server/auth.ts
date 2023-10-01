import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { z } from "zod";
import { prisma } from "~/server/db";

import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import argon2 from "argon2";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      workspaceId: string;
      // ...other properties
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
          provider: token.provider,
          workspaceId: token.workspaceId,
        },
      }
    },
    jwt: ({ token, user, account, trigger, session }) => {
      if (user?.id)
        token.userId = user.id;
      if (account?.provider)
        token.provider = account.provider;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (trigger === 'update' && session?.workspaceId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        token.workspaceId = session.workspaceId;
      }

      return token;
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validCredentials = await z.object({
          email: z.string().email(),
          password: z.string(),
        }).parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: {
            email: validCredentials.email,
          },
        });

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Password not set");

        const isPasswordValid = await argon2.verify(
          user.password,
          validCredentials.password
        );

        if (!isPasswordValid) throw new Error("Invalid password");
        return user;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    /**
     * 
     * 
     * ...add more providers here.
     */
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    // Set to jwt in order to make CredentialsProvider work properly
    strategy: 'jwt'
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

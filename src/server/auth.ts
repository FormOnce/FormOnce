/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import GoogleProvider from 'next-auth/providers/google';
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

  interface User {
    workspaceId: string;
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
    jwt: ({ token, user, account, trigger, session }) => {
      if (user) {
        token.userId = user.id;
        token.workspaceId = user.workspaceId;
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      if (trigger === 'update' && session?.workspaceId) {
        token.workspaceId = session.workspaceId;
      }
      return token;
    },

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

        const prismaUser = await prisma.user.findFirst({
          where: {
            email: validCredentials.email,
          },
          include: {
            WorkspaceMember: {
              select: {
                id: true,
              }
            },
          }
        });

        if (!prismaUser) throw new Error("User not found");
        if (!prismaUser.password) throw new Error("Password not set");

        const isPasswordValid = await argon2.verify(
          prismaUser.password,
          validCredentials.password
        );

        if (!isPasswordValid) throw new Error("Invalid password");

        const defaultWorkspaceId = prismaUser.WorkspaceMember[0]!.id;

        const user = {
          ...prismaUser,
          WorkspaceMember: undefined,
          workspaceId: defaultWorkspaceId
        };
        return user;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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

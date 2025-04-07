import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email: credentials.email as string,
              },
              {
                username: credentials.email as string,
              }
            ]
          }
        });
        if (!user) throw new Error("user not found");


        return { name: user.name, email: user.email };
      },
    })
  ],
  callbacks: {
    authorized({ request, auth }) {
      if (request.nextUrl.pathname.match(/\.(png|jpg|jpeg|svg|gif)$/)) {
        return true;
      }

      if (auth?.user && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      } else if (!auth?.user && (request.nextUrl.pathname !== "/login" && request.nextUrl.pathname !== "/signup")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return true;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const exists = await prisma.user.findUnique({
          where: {
            email: user.email!
          }
        });
        if (!exists) {
          const userData = await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              username: `${user.name?.split(" ").join("")!}_${Math.floor(Math.random() * 6)}`,
              account_type: "oAuth",
              profile_photo: user.image
            }
          });

          const users = await prisma.user.findMany({
            where: {
              id: {
                not: userData.id
              }
            }
          });
          if (users.length) {
            const newChats = users.map(user => {
              return {
                user_id: userData.id,
                chat_id: user.id,
                last_message: null,
                last_message_date: null,
              }
            });
            await prisma.privateChat.createMany({
              data: newChats
            });
          }
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
});

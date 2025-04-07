-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('oAuth', 'credential');

-- CreateEnum
CREATE TYPE "Members_role" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('channel', 'private');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('online', 'offline');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "password" TEXT,
    "account_type" "AccountType" NOT NULL,
    "profile_photo" TEXT,
    "status" "Status" NOT NULL DEFAULT 'offline',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "profile_photo" TEXT,
    "last_message" TEXT,
    "last_message_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_chats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "last_message" TEXT,
    "last_message_image" TEXT,
    "last_message_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_members" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "role" "Members_role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_links" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "type" "ChatType" NOT NULL,

    CONSTRAINT "chat_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_messages" (
    "id" SERIAL NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isEdited" INTEGER NOT NULL DEFAULT 0,
    "unread" INTEGER NOT NULL DEFAULT 1,
    "image" TEXT,

    CONSTRAINT "private_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_lists" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "blocked_id" INTEGER NOT NULL,

    CONSTRAINT "block_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "owner_id" ON "channels"("owner_id");

-- CreateIndex
CREATE INDEX "channel_id" ON "channel_members"("channel_id");

-- CreateIndex
CREATE INDEX "member_id" ON "channel_members"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "link" ON "chat_links"("link");

-- CreateIndex
CREATE INDEX "from" ON "private_messages"("from");

-- CreateIndex
CREATE INDEX "to" ON "private_messages"("to");

-- CreateIndex
CREATE INDEX "chat_id" ON "private_messages"("chat_id");

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_ibfk_2" FOREIGN KEY ("chat_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "private_chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_ibfk_1" FOREIGN KEY ("from") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

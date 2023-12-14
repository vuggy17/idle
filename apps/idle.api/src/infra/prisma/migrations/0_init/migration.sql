-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('pending', 'accepted', 'declined', 'cancelled');

-- CreateEnum
CREATE TYPE "room_type" AS ENUM ('private', 'group', 'bot');

-- CreateTable
CREATE TABLE "friend_invitations" (
    "id" UUID NOT NULL,
    "status" "request_status" NOT NULL,
    "sender_id" UUID,
    "receiver_id" UUID,

    CONSTRAINT "friend_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "type" "room_type" NOT NULL,
    "member_id" UUID,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friends" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "usfriend_ider_id" UUID,

    CONSTRAINT "user_friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "meta" STRING NOT NULL,
    "email" STRING,
    "phone" STRING(18),
    "avatar" STRING,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friend_invitations" ADD CONSTRAINT "friend_invitations_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friend_invitations" ADD CONSTRAINT "friend_invitations_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_usfriend_ider_id_fkey" FOREIGN KEY ("usfriend_ider_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;


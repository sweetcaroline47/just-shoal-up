import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { Children } from "react";
import { addUserChat, deleteUserChat, getUserChats } from "./userActions";

export const createChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase());
  const newChat = await push(child(dbRef, "chats"), newChatData);
  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }
  return newChat.key;
};

export const sendTextMessage = async (
  chatId,
  senderId,
  messageText,
  replyTo
) => {
  sendMessage(chatId, senderId, messageText, null, replyTo, null);
};

export const sendInfoMessage = async (chatId, senderId, messageText) => {
  sendMessage(chatId, senderId, messageText, null, null, "info");
};

export const sendImage = async (
  chatId,
  senderId,
  messageText,
  imageUrl,
  replyTo
) => {
  // CY EDIT: instead of 'image' I kept messageText below
  messageText = messageText || "post to prove";
  sendMessage(chatId, senderId, messageText, imageUrl, replyTo, null);
};

export const updateChatData = async (chatId, userId, chatData) => {
  const dbRef = ref(getDatabase());
  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    ...chatData,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  });
};

const sendMessage = async (
  chatId,
  senderId,
  messageText,
  imageUrl,
  replyTo,
  type
) => {
  const dbRef = ref(getDatabase());
  const messagesRef = child(dbRef, `messages/${chatId}`);
  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText,
  };

  if (replyTo) {
    messageData.replyTo = replyTo;
  }

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  if (type) {
    messageData.type = type;
  }

  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};

export const starMessage = async (messageId, chatId, userId) => {
  try {
    const dbRef = ref(getDatabase());
    const childRef = child(
      dbRef,
      `userStarredMessages/${userId}/${chatId}/${messageId}`
    );

    const snapshot = await get(childRef);

    if (snapshot.exists()) {
      // Starred item exists - Un-star
      await remove(childRef);
    } else {
      // Starred item does not exist - star
      const starredMessageData = {
        messageId,
        chatId,
        starredAt: new Date().toISOString(),
      };

      await set(childRef, starredMessageData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeUserFromChat = async (
  userLoggedInData,
  userToRemoveData,
  chatData
) => {
  const userToRemoveId = userToRemoveData.userId;
  const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);
  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: newUsers,
  });

  const userChats = await getUserChats(userToRemoveId);

  for (const key in userChats) {
    const currentChatId = userChats[key];

    if (currentChatId === chatData.key) {
      await deleteUserChat(userToRemoveId, key);
      break;
    }
  }

  const messageText =
    userLoggedInData.userId === userToRemoveData.userId
      ? `${userLoggedInData.fullName} left`
      : `${userLoggedInData.fullName} removed ${userToRemoveData.fullName}`;

  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

export const addUsersToChat = async (
  userLoggedInData,
  usersToAddData,
  chatData
) => {
  const existingUsers = Object.values(chatData.users);
  const newUsers = [];

  let userAddedName = "";

  usersToAddData.forEach(async (userToAdd) => {
    const userToAddId = userToAdd.userId;

    if (existingUsers.includes(userToAddId)) return;

    newUsers.push(userToAddId);

    await addUserChat(userToAddId, chatData.key);

    userAddedName = `${userToAdd.fullName}`;
  });

  if (newUsers.length === 0) {
    return;
  }

  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: existingUsers.concat(newUsers),
  });

  const moreUsersMessage =
    newUsers.length === 1
      ? ""
      : newUsers.length === 2
      ? `and 1 other`
      : `and ${newUsers.length - 1} others`;

  const messageText = `${userLoggedInData.fullName} added ${userAddedName} ${moreUsersMessage}`;
  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { Children } from "react";

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

export const sendTextMessage = async (chatId, senderId, messageText, replyTo) => {
  sendMessage(chatId, senderId, messageText, null, replyTo);
}

export const sendImage = async (chatId, senderId, messageText, imageUrl, replyTo) => {
  // CY EDIT: instead of 'image' I kept messageText below
  messageText = messageText || "post to prove";
  sendMessage(chatId, senderId, messageText, imageUrl, replyTo);
}

const sendMessage = async (chatId, senderId, messageText, imageUrl, replyTo) => {

  const dbRef = ref(getDatabase());
  const messagesRef = child(dbRef, `messages/${chatId}`);
  const messageData = {
    sentBy: senderId,
    sentAt:  new Date().toISOString(),
    text: messageText,
  };

  if (replyTo) {
    messageData.replyTo = replyTo;
  }

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  })

}

export const starMessage = async (messageId, chatId, userId) => {
  try {
      const dbRef = ref(getDatabase());
      const childRef = child(dbRef, `userStarredMessages/${userId}/${chatId}/${messageId}`);

      const snapshot = await get(childRef);

      if (snapshot.exists()) {
          // Starred item exists - Un-star
          await remove(childRef);
      }
      else {
          // Starred item does not exist - star
          const starredMessageData = {
            messageId,
            chatId,
            starredAt: new Date().toISOString()
        }

        await set(childRef, starredMessageData);
      }
  } catch (error) {
      console.log(error);        
  }
}
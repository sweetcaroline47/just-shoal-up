import {
  child,
  endAt,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  startAt,
} from "firebase/database";

export const getUserData = async (userId) => {
  try {
    const dbRef = ref(getDatabase());
    const userRef = child(dbRef, `users/${userId}`);

    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const getUserChats = async (userId) => {
  try {
    const dbRef = ref(getDatabase());
    const userRef = child(dbRef, `userChats/${userId}`);

    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserChat = async (userId, key) => {
  try {
    const dbRef = ref(getDatabase());
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);

    await remove(chatRef);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUserChat = async (userId, chatId) => {
  try {
      const dbRef = ref(getDatabase());
      const chatRef = child(dbRef, `userChats/${userId}`);

      await push(chatRef, chatId);
  } catch (error) {
      console.log(error);
      throw error;
  }
}

export const searchUsers = async (queryText) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const dbRef = ref(getDatabase());
    const userRef = child(dbRef, `users`);
    // JSON search
    const queryRef = query(
      userRef,
      orderByChild("fullNameLower"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
};

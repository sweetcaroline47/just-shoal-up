import { auth } from "../firebaseHelper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, child, ref } from "firebase/database";

export const signUp = async (fullName, email, password) => {

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = result.user;

      const userData = await createUser(fullName, email, uid);

      console.log( userData );
    } catch (error) {
      
      const errorCode = error.code;

      let message = "Something went wrong.";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      throw new Error(message);
    }
  };

const createUser = async (fullName, email, userId) => {
  const userData = {
    fullName,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

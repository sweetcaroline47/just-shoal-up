import { auth } from "../firebaseHelper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, set, child, ref, update } from "firebase/database";
import { authenticate, logout } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./userActions";

let timer;

// REGISTER function that goes to register.js
export const signUp = (fullName, email, password) => {
  return async (dispatch) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expireDate = new Date(expirationTime);

      // set time until expire
      const timeNow = new Date();
      const milliSecondsUntilExpire = expireDate - timeNow;

      const userData = await createUser(fullName, email, uid);
      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expireDate);

      // set the log out for 1 hour (automatic)
      timer = setTimeout(() => {
        dispatch(userLogout());
      }, milliSecondsUntilExpire);

    } catch (error) {
      const errorCode = error.code;

      let message = "Something went wrong.";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      throw new Error(message);
    }
  };
};

// LOG IN function that goes to register.js
export const signIn = (email, password) => {
  return async (dispatch) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expireDate = new Date(expirationTime);

      // set time until expire
      const timeNow = new Date();
      const milliSecondsUntilExpire = expireDate - timeNow;

      const userData = await getUserData(uid);
      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expireDate);

      // set the log out for 1 hour (automatic)
      timer = setTimeout(() => {
        dispatch(userLogout());
      }, milliSecondsUntilExpire);
    } catch (error) {
      const errorCode = error.code;
      let message = "Something went wrong.";

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/user-not-found"
      ) {
        message = "The email or password was incorrect";
      }

      throw new Error(message);
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  };
};

export const updateSignedInUserData = async (userId, newData) => {
  if (newData.fullName) {
    const fullNameLower = `${newData.fullName}`.toLowerCase();
    newData.fullNameLower = fullNameLower;
}

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await update(childRef, newData);
};

const createUser = async (fullName, email, userId) => {
  const fullNameLower = `${fullName}`.toLowerCase();
  const userData = {
    fullName,
    fullNameLower,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = (token, userId, expireDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expireDate: expireDate.toISOString(),
    })
  );
};

import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const openCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    console.log("No permission to access the camera");
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

// https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
export const uploadImageAsync = async (uri, isChatImage = null) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const pathFolder = isChatImage ? "chatImages" : "profilePics";
  const storageRef = ref(getStorage(), `${pathFolder}/${uuid.v4()}`);
  await uploadBytesResumable(storageRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(storageRef);
};

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }
  return Promise.resolve();
};

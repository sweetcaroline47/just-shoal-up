import React, {useState} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, } from "react-native";


import ProfileImageDefault from "../assets/images/ProfileImage_Default.png";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { launchImagePicker, uploadImageAsync } from "../utils/imagePickerHelper";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { updateExistingUserData } from "../store/authSlice";



const ProfileImage = (props) => {
  const dispatch = useDispatch();

  const source = props.uri ?  { uri: props.uri } : ProfileImageDefault;

    const [image, setImage] = useState(source);
    const [isLoading, setIsLoading] = useState(false);

    const showEditButton = props.showEditButton && props.showEditButton === true;
    
    const userId = props.userId;

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker();

            if (!tempUri) return;
            setIsLoading(true);
            // Upload the image
            const uploadUrl = await uploadImageAsync(tempUri);
            setIsLoading(false);
            if (!uploadUrl){
              throw new Error("Could not upload image");
            }
            const newProfilePicture = {profilePicture: uploadUrl};

            await updateSignedInUserData(userId, newProfilePicture);
            dispatch(updateExistingUserData({ newData: newProfilePicture }));
            setImage({ uri: uploadUrl });
        }
        catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }
    const Container = showEditButton ? TouchableOpacity : View;

  return (
    <Container onPress={pickImage}>
      {
        isLoading ?
        <View style={{ marginTop: 20, width: props.size, height: props.size }}>
          <ActivityIndicator
                size={"small"}
                color={colors.pink_white}
                style={{ marginTop: 10 }}
              />
        </View> :
      
      
      <Image
        style={{
          ...styles.image,
          ...{ width: props.size, height: props.size },
        }}
        source={image ? image : ProfileImageDefault}
      />
    }
    
    {
      showEditButton && !isLoading &&
      <View style={styles.editIconContainer}>
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={colors.chinese_black}
        />
      </View>
    }
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.pink_white,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: -1,
    backgroundColor: colors.pink_white,
    borderRadius: 20,
    padding: 1,
  },
});

export default ProfileImage;

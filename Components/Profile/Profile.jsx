import { StyleSheet, Text, View, ImageBackground,ScrollView } from "react-native";
import Top from "./Top";
import Middle from "./Middle";
import Bottom from "./Bottom";
import Sizes from "../Constants/Sizes";
import React from "react";

export default function Profile() {
  return (
    
    //<ImageBackground
      //style={styles.backgroundImage}
      //source={require("../../assets/bg2.png")}
      // blurRadius={1}
    //>
    <ScrollView>
      <View style={styles.container}>
        <Top />
        <Middle />
        <Bottom/>
      </View>
    
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    // marginHorizontal: Sizes.medium,
    marginTop: 10,
  },
});

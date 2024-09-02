import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../Constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Middle() {
  return (
    <View style={styles.main}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require("../../assets/user.jpg")} />
        <Text style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>
          Sansa Stark
        </Text>
        <Text
          style={{ fontSize: 16, fontWeight: "500" }} className="text-gray-300"
        >
          sansa2001@gmail.com
        </Text>
      </View>

      <View style={styles.middleSectionTextContainer}>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext} >Age</Text>
          <Text style={styles.bottomtext} className="text-gray-300">23</Text>
        </View>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Weight</Text>
          <Text style={styles.bottomtext} className="text-gray-300">55Kg</Text>
        </View>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Height</Text>
          <Text style={styles.bottomtext} className="text-gray-300">5' 6"</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 30,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 5,
  },
  middleSectionTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  middleSectionText: {
    justifyContent: "center",
    alignItems: "center",
  },
  toptext: {
    fontSize: 18,
    color:  Colors.white,
    fontWeight: "bold",
  },
  bottomtext: {
    fontSize: 16,
    fontWeight: "700",
  },
});

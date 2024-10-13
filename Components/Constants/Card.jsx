import { StyleSheet, Text, View , Dimensions} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Colors from "./Colors";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const width =  Dimensions.get("window").width;

export default function Card({ icon, cardTextOne, cardTextTwo, cardText, style }) {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View className="items-center justify-center mx-auto">
        <Text style={styles.cardTextOne}>{cardTextOne}</Text>
        <Text style={styles.cardText}>{cardText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    width: width*0.46,
    height: 100,
    borderRadius: 30,
    padding: 10,
    flexDirection:"row",
    alignItems: "center",
  },
  iconContainer: {
    //backgroundColor: Colors.white,
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText:{
    color: Colors.darkGray,
    fontWeight: "400",
    fontSize: 16,
    marginVertical: 5,
  },
  cardTextOne: {
    fontWeight: "bold",
    color: Colors.darkGray,
    fontSize: 24,
  },
  cardTextTwo: {
    borderBottomColor: Colors.darkGray,
    color: Colors.darkGray,
    fontWeight: "bold",
    fontSize: 18,
    borderBottomWidth: 1,
    marginBottom: 3,
  },
});

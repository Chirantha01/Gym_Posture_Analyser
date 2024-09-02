import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import Sizes from "../Constants/Sizes";
import Card from "../Constants/Card";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Bottom() {
  return (
    <View style={styles.bottomContainer}>
      <Text style={{ fontSize: 20, color: Colors.white, fontWeight: "bold" }}>
        Begin your Gym career
      </Text>

      <View style={styles.completeContainer}>
        <Card
          icon={
            <FontAwesome
              name="heartbeat"
              size={24}
              color="red"
            />
          }
          cardTextOne="2 Issues"
          cardText="Health"
          style={{ backgroundColor: Colors.primary}}
        />
        <Card
          icon={
            <FontAwesome name="trophy" size={24} color={Colors.secondary} />
          }
          cardTextOne="1 Achievement"
          cardText="Achievements"
          style={{ backgroundColor: Colors.secondary }}
        />
      </View>

      <View style={styles.bottomSection} className="p-3 bg-green-300 rounded-3xl w-8/12 mx-auto">
        <Text style={styles.bottomSectionText}>Start Exercising Now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: Sizes.medium,
  },
  completeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Sizes.xs,
  },
  card: {
    backgroundColor: Colors.secondary,
  },
  bottomSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Sizes.medium,
  },
  bottomSectionText: {
    fontWeight: "bold",
    fontSize: Sizes.smedium,
    color: Colors.darkGray,
    marginBottom: 5,
    borderBottomColor: Colors.darkGray,
  }
});

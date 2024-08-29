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
        Complete Profile
      </Text>

      <View style={styles.completeContainer}>
        <Card
          icon={
            <FontAwesome
              name="graduation-cap"
              size={24}
              color={Colors.primary}
            />
          }
          cardTextOne="02 Steps"
          cardText="Education"
          style={{ backgroundColor: Colors.primary}}
        />
        <Card
          icon={
            <FontAwesome name="briefcase" size={24} color={Colors.secondary} />
          }
          cardTextOne="04 Steps"
          cardText="Professional"
          style={{ backgroundColor: Colors.secondary }}
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.bottomSectionText}>Buy Pro $23.49</Text>
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
    borderBottomWidth: 1,
    marginBottom: 5,
    borderBottomColor: Colors.darkGray,
  }
});

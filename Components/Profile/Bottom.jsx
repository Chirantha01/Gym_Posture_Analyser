import { StyleSheet, Text, View , Dimensions } from "react-native";
import React , { useState } from "react";
import Colors from "../Constants/Colors";
import Sizes from "../Constants/Sizes";
import Card from "../Constants/Card";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from 'react-native-circular-progress-indicator';

const WIDTH =  Dimensions.get("window").width;

export default function Bottom() {
  const [value, setValue] = useState(85);

  return (
    //<ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: "white" }}>
    <View style={styles.bottomContainer}>
      <View style={styles.completeContainer}>
        <Card
          icon={
            <Icons
              name="heart-pulse"
              size={50}
              color="red"
            />
            
          }
          cardTextOne="2"
          cardText="Health"
          style={{ backgroundColor: "#93E9BE" ,marginLeft:WIDTH*0.035 , marginRight:WIDTH*0.01}}
        />
        <Card
          icon={
            <Icons name="trophy" size={50} color="gold" />
          }
          cardTextOne="1"
          cardText="Achievements"
          style={{ backgroundColor: "#FFE4C4" , marginLeft:WIDTH*0.01 , marginRight:WIDTH*0.02}}
        />
      </View>
      <View className="flex-row m-3 rounded-3xl p-3 bg-fuchsia-200">
        <CircularProgress
          radius={60}
          value={value}
          textColor='#222'
          fontSize={20}
          valueSuffix={'%'}
          activeStrokeColor={'tomato'}
          inActiveStrokeOpacity={0.2}
          duration={4000}
        />
        <View className="justify-center mx-5">
          <Text className="font-bold text-2xl mb-2">Weakly Progress</Text>
          <Text className="font-semibold text-xl">Time Spent : 15 hours</Text>
          <Text className="font-semibold text-xl">Challenges : 12/15</Text>
        </View>
      </View>
      <View className="mt-2 flex-row">
        <Card
          icon={
            <Icons
              name="heart-pulse"
              size={50}
              color="red"
            />
            
          }
          cardTextOne="2"
          cardText="Health"
          style={{ backgroundColor: "#93E9BE" ,marginLeft:WIDTH*0.035 , marginRight:WIDTH*0.01}}
        />
        <Card
          icon={
            <Icons name="trophy" size={50} color="gold" />
          }
          cardTextOne="1"
          cardText="Achievements"
          style={{ backgroundColor: "#FFE4C4" , marginLeft:WIDTH*0.01 , marginRight:WIDTH*0.02}}
        />
      </View>
      <View style={styles.completeContainer}>
        <Card
          icon={
            <Icons
              name="heart-pulse"
              size={50}
              color="red"
            />
            
          }
          cardTextOne="2"
          cardText="Health"
          style={{ backgroundColor: "#93E9BE" ,marginLeft:WIDTH*0.035 , marginRight:WIDTH*0.01}}
        />
        <Card
          icon={
            <Icons name="trophy" size={50} color="gold" />
          }
          cardTextOne="1"
          cardText="Achievements"
          style={{ backgroundColor: "#FFE4C4" , marginLeft:WIDTH*0.01 , marginRight:WIDTH*0.02}}
        />
      </View>
      <View style={styles.bottomSection} className="p-3 bg-green-300 rounded-3xl w-8/12 mx-auto">
        <Text style={styles.bottomSectionText}>Start Exercising Now</Text>
      </View>
    </View>
    //</ScrollView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: Sizes.medium,
    width:WIDTH,
    flexDirection:"column"
  },
  completeContainer: {
    flexDirection: "row",
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
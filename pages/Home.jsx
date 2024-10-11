import React from "react";
import { View, Text , StatusBar , Image , StyleSheet , Dimensions , ScrollView} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Carousel from '../Components/Image-Carousel/ImageCarouselScreen';
import Workout from './Workout';
import Graph from "./Graph";


// const SRC_WIDTH = Dimensions.get("window").width;
// const CARD_LENGTH = SRC_WIDTH*0.8;
// const SPACING = SRC_WIDTH*0.02;
// const SIDECARD_LENGTH = (SRC_WIDTH*0.18)/2;


export default function Home() {
  console.log("Home screen loaded...");

  const ScreenHeight = Dimensions.get('window').height;
  const ScreenWidth = Dimensions.get('window').width;


  return(
    <ScrollView contentContainerStyle={{ alignItems: 'center', backgroundColor: "white" }}>
      <View style={{alignItems:"center"}} className="flex-col">
      {/* <StatusBar style="auto" /> */}
      <View
          className="bg-blue-800 rounded-b-3xl"
          style={{
            width: ScreenWidth,
            shadowColor: '#000',       // Ensure the shadow color is set to black for contrast
            shadowOffset: { width: 0, height: 4 },  // Adjust shadow offset for better visibility
            shadowOpacity: 0.9,        // Increase shadow opacity for stronger effect
            shadowRadius: 20,           // Increase shadow radius for a larger shadow
            elevation: 30,             // Use elevation on Android for shadow effect
          }}
        >
        {<Image
          source={require("../assets/icon-white.png")}
          className="h-24 w-52 ml-8"

        />}
        <View className="flex-row">
          <View className="m-6 items-center w-25 h-25 rounded-full bg-white justify-center p-1">
          <Image source={require("../assets/user.jpg")} className="w-24 h-24 rounded-full"/>
          </View>
          <View className="flex-col my-7 justify-center">
            <Text className="text-2xl text-white font-bold font">Hey John,</Text>
            <View className="flex-row items-center">
              <MaterialIcons name="star" color={'gold'} size={15}/>
              <Text className="text-white text-lg font-semibold mx-2">88% Healthy</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="sync" color={'red'} size={20} />
              <Text className="text-white text-lg font-semibold mx-2">Last Workout: 2 Days ago</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="my-3 flex-1">
      <Text className="font-bold text-2xl mx-6 mb-1">Start your Workout now...</Text>
        <Carousel/>
      </View>
      <View className=" bg-white flex-1"> 
        <Text className="font-bold text-2xl mx-6">Workout History</Text>
        <Graph/>
      </View>
      </View>
    </ScrollView>
  );
}
import React from "react";
import { ScrollView, View, Text , StyleSheet , Dimensions} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Graph = ({data, title, spacing}) => {
    console.log("Graph Loaded");
  const graphWidth = Dimensions.get('window').width;

  

  const renderTooltip = (item) => {
    return (
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>Value: {item.value}</Text>
        <Text style={styles.tooltipText}>Day: {item.label}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{backgroundColor: '#232323' , width:graphWidth*0.959, borderRadius:4, borderWidth:0 , padding:5 , margin:5}}>
      <Text style={styles.subTopicText}>{title}</Text>
      <View>
        <BarChart
          data={data}
          barWidth={22}
          noOfSections={5}
          spacing={spacing ? spacing:22}
          barBorderRadius={4}
          xAxisThickness={0}
          yAxisThickness={0}
          xAxisLabelTextStyle={{color: '#aaa' , fontSize: 11}}
          yAxisTextStyle={{ color: "#aaa", fontSize: 12 }}
          frontColor="#E2F163"
          isAnimated = {true}
          animationDuration={500}
          renderTooltip={renderTooltip}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: '#232323',
    padding: 0,
    borderRadius: 0,
    position: 'absolute',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Graph;
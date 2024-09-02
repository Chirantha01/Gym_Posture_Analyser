import * as React from 'react';
import { Dimensions, Text, View , Image} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { interpolate } from 'react-native-reanimated';

function Cardcarousel() {
    const width = Dimensions.get('window').width;

    const cardWidth = width*0.7;
    const cardMargin = 10;

    const data = [
        {
          image: require('../assets/img1.jpg'),
          name:"img1",
        },
        {
          image: require('../assets/img2.jpg'),
          name:"img2",
        },
        {
          image: require('../assets/img3.jpg'),
          name:"img3",
        },
        {
          image: require('../assets/img4.jpg'),
          name:"img4",
        },
      ];

    return (
        <View style={{backgroundColor:"black"}}>
            <Carousel
                loop
                width={cardWidth}
                height={width*0.5}
                autoPlay={true}
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current image:', data[index].name)}
                customAnimation={(value) => {
                    const translateX = interpolate(value, [0, 1], [50, 0]);
                    const opacity = interpolate(value, [0, 1], [0.7, 1]);

                    return {
                        transform: [{ translateX }],
                        opacity,
                    };
                }}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={item.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover', // Adjust how the image fits
                                borderRadius: 10, // Optional: Add rounded corners
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

export default Cardcarousel;
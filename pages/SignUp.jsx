import React, { useState, useRef , useEffect} from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View , ScrollView , Dimensions, Animated} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import ImagePlaceholder from '../assets/image-placeholder.jpg';
// import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";

const SignUpScreen = ({ onSignUp, onSwitchToSignIn, onGoBack }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bDay, setBDay] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [profileImage , setProfileImage] = useState(null);
  const [click,setClick] = useState(false);
  const [usernameMessege , setUsernameMessege] = useState("");
  const [errors, setErrors] = useState({username:[],password:[],email:[]});
  const [otherError , setOtherError] = useState("")

  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log(errors); // This will log after the state has updated and re-rendered
    console.log(usernameMessege); // Check if usernameMessage state is correctly updating
    console.log(otherError);
  }, [errors, usernameMessege , otherError]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
        toValue: 0.95, // Scale down to 95%
        useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
        toValue: 1, // Scale back to 100%
        useNativeDriver: true,
    }).start();
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate){
      console.log(selectedDate);
      setShowPicker(false); // Hide picker after selecting a date
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      setBDay(formattedDate); // Format date as needed
      console.log(bDay);
    } else{
      setShowPicker(false);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleBackendErrors = (responseErrors) => {
    const errorMap = {
      username: [],
      password: [],
      email: [],
    };

    // Initialize each field with an empty array
    responseErrors.forEach((error) => {
      if (!errorMap[error.field]) {
        errorMap[error.field] = [];
      }
      // Push the error message to the array of errors for the corresponding field
      errorMap[error.field].push(error.message);
    });
    console.log(errorMap);
    setErrors(errorMap); // Update error state
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrors({username:[],password:[],email:[]});
    setUsernameMessege("");
    setOtherError("");
    // const username_extracted = username.trim().split(/\s+/);
    // const password_whiteSpace_present = /\s/.test(password);
    // const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // if (username_extracted.length > 1){
    //   setUsernameMessege("Username should be in 1 word!");
    // }
    // if (username_extracted)
    // if(password===""){
    //   setIsPasswordEmpty(true);
    // }
    // else{
    //   setIsPasswordEmpty(false);
    // }
    // if(email===""){
    //   setIsEmailEmpty(true);
    // }
    // else{
    //   setIsEmailEmpty(false);
    // }
    // if(username===""){
    //   setIsUsernameEmpty(true);
    // }
    // else{
    //   setIsUsernameEmpty(false);
    // }
    try{
      // Call API to get JWT token (mock here)
      const response = await axios.post("http://192.168.1.148:4000/signup", 
        {
          username:username,
          email:email,
          password:password,
          profilePicture:profileImage,
          birthday:bDay,
          weight:weight,
          height:height
        });
      

        const data = response.data;
        const success = data.success;

      if (success){
        const token = data.token;
        await AsyncStorage.setItem('jwtToken', token);
        onSignUp();
      }
    } catch(error){
      if (error.response && error.response.status === 400) {
        const data = error.response.data;
        if (data.errors) {
          handleBackendErrors(data.errors); // Update the error state with backend errors
      
        } if(data.usernameMessage) {
          console.log("Error occurred: ", data.usernameMessage);
          setUsernameMessege(data.usernameMessage);
        }
      } else {
        // Handle other possible errors (network issues, server problems, etc.)
        console.log("Something went wrong: ", error.message);
        setOtherError("Something went Wrong!")
      }
    }
  }

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    // Launch image library to select a photo
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true, // Option to crop the image
    });

    if (!result.cancelled) {
      setProfileImage(result.uri); // Set the selected image
    }
  };
  const removeImage = () => {
    setProfileImage(null); // Reset profile image
  };

  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
                <Text style={styles.headerTitle}>Create Account</Text>
                <Pressable onPress={onGoBack} style={styles.backButton}>
                  {/* <Icons name="arrow-left" size={24} color="#E2F163" /> */}
                </Pressable>
        </View>
        <Text style={styles.title}>Let's Start !</Text>
        {/* <Image source={logo} style={styles.image} resizeMode='contain' /> */}
        {/* <Text style={styles.title}>Sign Up</Text> */}
        
        <View style={styles.profilePic}>
              {/* <Pressable style={styles.profileImageView} onPress={pickImage}>
                {profileImage ? (
                  <Image source={{uri : profileImage}} style={styles.profileImage}  />
                ): (
                  <Image source={ImagePlaceholder} style={styles.profileImage}/>
                )}  */}
              {/* </Pressable >
                {profileImage ? (
                  // <Pressable style={styles.profileIcons} onPress={removeImage}><Icons name='minus-circle-outline' size={40} color='white'/></Pressable>
                ): (
                  // <Pressable style={styles.profileIcons} onPress={pickImage}><Icons name='plus-circle-outline' size={40} color='white'/></Pressable>
                )} */}
        </View>
       <View style={styles.inputView}>
            <Text style={styles.text}>Username</Text>
            <TextInput style={styles.input} placeholder='USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            {errors.username && errors.username.length > 0 && errors.username.map((err, idx) => (
              <Text key={idx} style={styles.requiredText}>{err}</Text>
            ))}
            {usernameMessege !== "" && <Text style={styles.requiredText}>{usernameMessege}</Text>}
            
            <Text style={styles.text}>E-mail</Text>
            <TextInput style={styles.input} placeholder='E-MAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none'/>
            {errors.email && errors.email.length > 0 && errors.email.map((err, idx) => (
              <Text key={idx} style={styles.requiredText}>{err}</Text>
            ))}

            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
            {errors.password && errors.password.length > 0 && errors.password.map((err, idx) => (
              <Text key={idx} style={styles.requiredText}>{err}</Text>
            ))}

            <Text style={styles.text}>Birth Day</Text>
            <TextInput style={styles.input} placeholder='BIRTH DAY' value={bDay} onFocus={showDatePicker} autoCorrect={false}
        autoCapitalize='none'/>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
            <Text style={styles.text}>Height</Text>
            <TextInput style={styles.input} placeholder='HEIGHT' value={height} onChangeText={setHeight} autoCorrect={false}
        autoCapitalize='none'/>
            <Text style={styles.text}>Weight</Text>
            <TextInput style={styles.input} placeholder='WEIGHT' value={weight} onChangeText={setWeight} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        {/* <View style={styles.rememberView}>
            <View style={styles.switch}>
                <Switch  value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
                <Text style={styles.rememberText}>Remember Me</Text>
            </View>
        </View> */}

        <View style={styles.buttonView}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable style={styles.button} 
                        onPressIn={handlePressIn} 
                        onPressOut={handlePressOut} 
                        onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
            </Animated.View>
        </View>

        <Text style={styles.footerText}>Already Have an Account?<Text style={styles.signup} onPress={onSwitchToSignIn}>  Sign In</Text></Text>
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: "#232323",
    flex: 1,
},
  image : {
    height : 100,
    width : 220
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    color: "white"
  },
  profilePic:{
    paddingTop: 20,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center',
    position: 'relative', 
    paddingBottom: 40
    ,
  },
  profileImageView:{
    height:Dimensions.get('window').width*0.32,
    width:Dimensions.get('window').width*0.32,
    borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
    backgroundColor:'#232323',
    alignItems:'center',
    justifyContent:'center',
    borderWidth:0,
  },
  profileImage: {
    height:Dimensions.get('window').width*0.3,
    width:Dimensions.get('window').width*0.3,
    borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
  },
  imagePlaceholder:{
    height:Dimensions.get('window').width*0.3,
    width:Dimensions.get('window').width*0.3,
    borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
    backgroundColor: '#232323',
    alignItems:'center',
    justifyContent:'center',
  },
  profileIcons: {
    position: 'absolute', // Position absolutely within profilePic
    bottom: 30, // Adjust this value to move the icon up or down
    right: 10, // Adjust this value to move the icon left or right
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#232323',
    padding: 5, // Optional: Add some padding around the icon
  },
  inputView : {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    paddingBottom: 20,
    marginBottom: 5,
    paddingTop: 10,
    backgroundColor: "#B3A0FF",
  },
  input : {
    fontSize: 17,
    height: 50,
    fontWeight: "500",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderWidth: 0,
    borderRadius: 15
  },
  text : {
    color: "#232323",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  requiredText:{
    fontsize: 10,
    color:"red"
  },
  rememberView : {
    width : "100%",
    paddingHorizontal : 50,
    justifyContent: "space-between",
    alignItems : "center",
    flexDirection : "row",
    marginBottom : 8
  },
  switch :{
    flexDirection : "row",
    gap : 1,
    justifyContent : "center",
    alignItems : "center"
    
  },
  rememberText : {
    fontSize: 13
  },
  forgetText : {
    fontSize : 11,
    color : "red"
  },
  button: {
    backgroundColor: "#373737",
    height: 50,
    width: 200,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonView: {
    paddingTop: 5,
    paddingBottom: 5,
    width: "100%",
    paddingHorizontal: 50,
    alignItems: 'center',
},
  optionsText : {
    textAlign : "center",
    paddingVertical : 10,
    color : "gray",
    fontSize : 13,
    marginBottom : 6
  },
  mediaIcons : {
    flexDirection : "row",
    gap : 15,
    alignItems: "center",
    justifyContent : "center",
    marginBottom : 23
  },
  icons : {
    width : 40,
    height: 40,
  },
  footerText : {
    textAlign: "center",
    color : "gray",
  },
  signup : {
    color : "#E2F163",
    fontSize : 13
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  backButton: {
      position: 'absolute',
      flex: 1,
      left: 20,
      top: 9,
  },
  headerTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#E2F163',
      flex: 1,
  },
})

export default SignUpScreen;

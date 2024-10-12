import React, { useState } from 'react';
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View , ScrollView , Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const logo = require("../assets/logo.png")
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import ImagePlaceholder from '../assets/image-placeholder.jpg';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUpScreen = ({ onSignUp, onSwitchToSignIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bDay, setBDay] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [profileImage , setProfileImage] = useState(null);
  const [click,setClick] = useState(false);
  const [isUsernameEmpty , setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty , setIsPasswordEmpty] = useState(false);
  const [isEmailEmpty , setIsEmailEmpty] = useState(false);
  const [isMultipleWordUsername , setIsMultipleUsername] = useState(false);
  const [usernameMessege , setUsernameMessege] = useState("")

  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

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

  const handleSignUp = async () => {
    const username_extracted = username.trim().split(/\s+/);
    const password_whiteSpace_present = /\s/.test(password);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (username_extracted.length > 1){
      setUsernameMessege("Username should be in 1 word!");
    }
    if (username_extracted)
    if(password===""){
      setIsPasswordEmpty(true);
    }
    else{
      setIsPasswordEmpty(false);
    }
    if(email===""){
      setIsEmailEmpty(true);
    }
    else{
      setIsEmailEmpty(false);
    }
    if(username===""){
      setIsUsernameEmpty(true);
    }
    else{
      setIsUsernameEmpty(false);
    }
    if(password !== "" && email !== "" && username !== ""){
      // Call API to get JWT token (mock here)
      // const token = await mockSignUp(username, password);
      
      // if (token) {
      //   await AsyncStorage.setItem('jwtToken', token); // Save token in AsyncStorage
      //   onSignUp(); // Navigate to main app after sign-up
      // }
      onSignUp();
    } 
  };

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
        </View>
        <Text style={styles.title}>Let's Start !</Text>
        {/* <Image source={logo} style={styles.image} resizeMode='contain' /> */}
        {/* <Text style={styles.title}>Sign Up</Text> */}
        
        <View style={styles.profilePic}>
              <Pressable style={styles.profileImageView} onPress={pickImage}>
                {profileImage ? (
                  <Image source={{uri : profileImage}} style={styles.profileImage}  />
                ): (
                  <Image source={ImagePlaceholder} style={styles.profileImage}/>
                )} 
              </Pressable >
                {profileImage ? (
                  <Pressable style={styles.profileIcons} onPress={removeImage}><Icons name='minus-circle-outline' size={40} color='white'/></Pressable>
                ): (
                  <Pressable style={styles.profileIcons} onPress={pickImage}><Icons name='plus-circle-outline' size={40} color='white'/></Pressable>
                )}
        </View>
       <View style={styles.inputView}>
            <Text style={styles.text}>Username</Text>
            <TextInput style={styles.input} placeholder='USERNAME' value={username} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            {isUsernameEmpty ? <Text style={styles.requiredText}>Enter a username!</Text>:<View></View>}
            
            <Text style={styles.text}>E-mail</Text>
            <TextInput style={styles.input} placeholder='E-MAIL' value={email} onChangeText={setEmail} autoCorrect={false}
        autoCapitalize='none'/>
            {isEmailEmpty ? <Text style={styles.requiredText}>Enter an Email!</Text>:<View></View>}

            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
            {isPasswordEmpty? <Text style={styles.requiredText}>Enter a Password!</Text>:<View></View>}

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
            <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
        </View>

        <Text style={styles.footerText}>Already Have an Account?<Text style={styles.signup} onPress={onSwitchToSignIn}>  Sign In</Text></Text>
    </SafeAreaView>
    </ScrollView>
  );
};

const mockSignUp = (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('mock-jwt-token');
    }, 1000);
  });
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

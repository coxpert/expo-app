import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

export default function App() {
  
  const [sound, setSound] = React.useState();
  
  useEffect(()=>{
    registerNotification().then(()=>{
      console.log("success registering notification")
    });
  },[])
  
  async function playSound() {
    
    console.log('Loading Sound');
    
    const { sound } = await Audio.Sound.createAsync(
        require('./assets/ring.wav'),
        {
          shouldPlay: true,
          isLooping: true,
        },
        null,
        true
    );
    
    setSound(sound);
    
    console.log('Playing Sound');
    await sound.playAsync();
  }
  
  useEffect(() => {
    return sound
        ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
        : undefined;
  }, [sound]);
  
  
  const onSubmit = () => {
    Notifications.scheduleNotificationAsync ({
      content: {
        title: "Time's up!",
        body: 'Change sides!',
        sound: true
      },
      trigger: {
        seconds: 2,
      },
    }).then(r => {
      console.log(r)
    });
  }

  const handleNotification = async () => {
     // await playSound();
  }
  
  const registerNotification = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
    Notifications.addNotificationReceivedListener(handleNotification);
  }

  return (
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center', width:'100%'}}>
        <Button onPress={onSubmit} title={'Submit'}/>
      </View>
  );
  
}

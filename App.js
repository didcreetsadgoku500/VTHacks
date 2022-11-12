import React from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
  Button,
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
import { Platform } from "react-native";
import { Menu, HamburgerIcon, Pressable, Image, ScrollView, View} from "native-base";
import { useState, useEffect } from 'react';


// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider>
      <ScrollView
        style={{ flex: 1}}
        scrollEnabled={true}
        paddingTop="8">
        <Center
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          px={4}
          flex={1}>
          
            <MatchCard team1={{"name": "Germany", "icon": "DE"}} team2={{"name": "Russia", "icon": "RU"}} isLive={true}/>
              
       
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}

function MatchCard(props) {
  const [score1, setScore1] = useState(0)
  const [score2, setScore2] = useState(0)

  // const getData=()=>{
  //   fetch('https://reqres.in/api/unknown/2')
  //   .then(response=>response.json())
  //   .then(data=>setScore1(data.data.id));
  // }

  // useEffect(() => {getData()}, [])
  setInterval(updateScore(setScore1, setScore2), 1000)

  return <NativeBaseProvider>
      <Box bg="primary.100" py="4" px="3" borderRadius="5" rounded="md" maxWidth="100%" width="900">
        
        <View flexDirection="row" justifyContent="space-between">
           <TeamIcon value={props.team1.name} source={"https://osuflags.omkserver.nl/" + props.team1.icon + ".png"}/>
           <View flexDirection="row" justifyContent="space-between" width="70">
           <Heading alignSelf="center">{score1}</Heading>
           <Heading alignSelf="center">{score2}</Heading>
           </View>
           <TeamIcon value={props.team2.name} source={"https://osuflags.omkserver.nl/" + props.team2.icon + ".png"}/>
        </View>
        {props.isLive ? <LiveIndicator /> : null}
        
      </Box>
    </NativeBaseProvider>;
}

function TeamIcon(props) {  
  return <VStack flexDirection="column" alignItems="center">
    <Heading size="md">{props.value}</Heading>
      <Image source={{uri: props.source}} style={{width: 80, height: 80}} alt="Load failed" />
    </VStack>;
}

function LiveIndicator() {
  return <View flexDirection="row" alignItems="center">
    <Box width="3" height="3" rounded={100} bg="red.700"></Box>
    <Text px="1" style={{fontStyle: "italic", color: "6A6C6E"}}>Live</Text>
  </View>

}


function updateScore(setScore1, setScore2) {
  setScore1(Math.floor(Math.random() * 9))
  setScore2(Math.floor(Math.random() * 9))
}
//Layout:
//VStack
//  Team Name, image
// Score (3 - 0)
// Team Name, image

//Maybe make team-name/image combo its own element?
//<TeamIcon value="Russia" source="https://osuflags.omkserver.nl/RU.png"/>
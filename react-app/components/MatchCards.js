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
  import {Image, ScrollView, View} from "native-base";
  import { useState, useEffect } from 'react';


  function TeamIcon(props) {  
    return <VStack flexDirection="column" alignItems="center">
      <Heading size="md" maxWidth="100" textAlign="center">{props.value}</Heading>
        <Image source={{uri: props.source}} style={{width: 80, height: 80}} alt="Load failed" />
      </VStack>;
  }

  function LiveIndicator() {
    return <View flexDirection="row" alignItems="center">
      <Box width="3" height="3" rounded={100} bg="red.700"></Box>
      <Text px="1" style={{fontStyle: "italic", color: "6A6C6E"}}>Live</Text>
    </View>
  
  }
  
  function TimeDisplay(props) {
    return <View flexDirection="row" alignItems="center">
      <Text px="1" style={{fontStyle: "italic", color: "6A6C6E"}}>{props.time}</Text>
    </View>
  
  }




  function MatchCard(props) {
    const [score1, setScore1] = useState(props.score1)
    const [score2, setScore2] = useState(props.score2)
  
    if (props.isLive) {
    setTimeout(() => {
      updateScore(score1, setScore1, score2, setScore2)
    }, 2000)}
  
  
    return <NativeBaseProvider>
        <Box bg="blueGray.200" py="4" px="3" borderRadius="5" rounded="md" maxWidth="100%" width="900" marginTop="10" shadow="3">
          
          <View flexDirection="row" justifyContent="space-between">
             <TeamIcon value={props.team1.teamName} source={props.team1.logo}/>
             <View flexDirection="row" justifyContent="space-between" width="70">
             <Heading alignSelf="center">{score1}</Heading>
             <Heading alignSelf="center">-</Heading>
             <Heading alignSelf="center">{score2}</Heading>
             </View>
             <TeamIcon value={props.team2.teamName} source={props.team2.logo}/>
          </View>
          {props.isLive ? <LiveIndicator /> : <TimeDisplay time={props.timestamp} />}
          
        </Box>
      </NativeBaseProvider>;
  }
  
  
  
  
  
  
  function updateScore(score1, setScore1, score2, setScore2) {
    setScore1(score1 + 1);
    setScore2(score2 + 1);
  }

  export {TeamIcon, LiveIndicator, TimeDisplay, MatchCard};


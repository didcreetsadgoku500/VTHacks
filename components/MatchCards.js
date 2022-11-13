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

  export {TeamIcon, LiveIndicator, TimeDisplay};
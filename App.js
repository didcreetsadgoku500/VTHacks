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
import {TeamIcon, LiveIndicator, TimeDisplay} from './components/MatchCards'



// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  let abc = true
  return (
    <NativeBaseProvider>
      <ScrollView
        style={{ flex: 1}}
        scrollEnabled={true}
        marginTop="8">
        <Center
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          px={4}
          flex={1}>
            {abc ? <HomepageMatchCards /> : <MatchDetails/>}
       
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
}

function HomepageMatchCards(props) {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetchInitialData()
    .then(objs => setData(objs))


  }, [])

  return <View marginBottom="10">
    {data}

  </View>


}

function MatchDetails(props) {
  return <View>
    <Text>hi</Text>
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

function fetchInitialData() {
  return new Promise((resolve, reject) => {
    sampleFetchFunc('http://50.116.47.82/get_recent_matches')  //replace with fetch("query-api")
   // .then(response => response.json())                //uncomment this when you actually fetch
    .then(data => {
      const objs = data.matches.map(match => <MatchCard key={match.matchID} isLive={false} team1={match.team1} team2={match.team2} score1={match.score1} score2={match.score2} timestamp={match.date}></MatchCard>)
      resolve(objs)

    }) 

  })

}










function sampleFetchFunc(ignore) {
  return new Promise((resolve, reject) => {resolve(sampleFetchData)})

}


const sampleFetchData = {
  "matches": [
    {
      "matchID": 120823734,
      "team1": {"teamName": "South Korea", "logo": "https://osuflags.omkserver.nl/KR.png"},
      "team2": {"teamName": "Russia", "logo": "https://osuflags.omkserver.nl/RU.png"},
      "score1": 6,
      "score2": 4,
      "date": "YOUR DATE OBJECT HERE",
      "finished": false
    },
    {
      "matchID": 29348566,
      "team1": {"teamName": "USA", "logo": "https://osuflags.omkserver.nl/US.png"},
      "team2": {"teamName": "Korea", "logo": "https://osuflags.omkserver.nl/KR.png"},
      "score1": 6,
      "score2": 3,
      "date": "YOUR DATE OBJECT HERE",
      "finished": true
    },
    {
      "matchID": 97653456,
      "team1": {"teamName": "Hong Kong", "logo": "https://osuflags.omkserver.nl/HK.png"},
      "team2": {"teamName": "Ukraine", "logo": "https://osuflags.omkserver.nl/UA.png"},
      "score1": 1,
      "score2": 6,
      "date": "YOUR DATE OBJECT HERE",
      "finished": true
    },
    {
      "matchID": 1,
      "team1": {"teamName": "Hong Kong", "logo": "https://osuflags.omkserver.nl/HK.png"},
      "team2": {"teamName": "Ukraine", "logo": "https://osuflags.omkserver.nl/UA.png"},
      "score1": 1,
      "score2": 6,
      "date": "YOUR DATE OBJECT HERE",
      "finished": true
    }
    
  ]
}

//Layout:
//VStack
//  Team Name, image
// Score (3 - 0)
// Team Name, image

//Maybe make team-name/image combo its own element?
//<TeamIcon value="Russia" source="https://osuflags.omkserver.nl/RU.png"/>




  // const getData=()=>{
  //   fetch('https://reqres.in/api/unknown/2')
  //   .then(response=>response.json())
  //   .then(data=>setScore1(data.data.id));
  // }

  // useEffect(() => {getData()}, [])
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
import {TeamIcon, LiveIndicator, TimeDisplay, MatchCard} from './components/MatchCards'



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
        marginTop="8">
        <Center
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          px={4}
          flex={1}>
            {/* {abc ? <HomepageMatchCards /> : <MatchDetails />} */}
            <SceneManager value={0} />
       
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
}

function SceneManager(props) {
  const [scene, switchScene] = useState(props.value)

  if (scene == 0) {
    return <HomepageMatchCards />

  }
  if (scene == 1) {
    return <MatchDetails />

  }


}

function HomepageMatchCards(props) {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetchInitialData()
    .then(objs => setData(objs))
    setLoading(false)

  }, [])

  return <View marginBottom="10">
    {isLoading ? <Text>Loading...</Text> : data}

  </View>
}




function MatchDetails(props) {
  return <View>
    <MatchCard isLive={false} team1={{"teamName": "South Korea", "logo": "https://osuflags.omkserver.nl/KR.png"}} team2={{"teamName": "Russia", "logo": "https://osuflags.omkserver.nl/RU.png"}} score1={0} score2={0}/>
     </View>

}




function fetchInitialData() {
  return new Promise((resolve, reject) => {
    fetch('http://50.116.47.82/get_recent_matches')  //replace with fetch("query-api")
    .then(response => response.json())                //uncomment this when you actually fetch
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
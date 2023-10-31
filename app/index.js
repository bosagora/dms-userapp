import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {useStores, StoreProvider, trunk} from "../stores";
import DetailsScreen from "../screens/Detail";

const Stack = createNativeStackNavigator();
export default function App() {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await trunk.init();
      setIsStoreLoaded(true);
    }
    rehydrate();
  }, []);

  function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
          <View style={styles.main}>
            <Text style={styles.title}>Hello World</Text>
            <Text style={styles.subtitle}>This is the first page of your app.</Text>
              <Button
                  title="Go to Details... again"
                  onPress={() => navigation.push('Detail')}
              />
          </View>
          <View>
            <Link href="/about">About</Link>
            <Link href="/user/bacon">View user {userStore.name}</Link>
          </View>
          <StatusBar style="auto" />
        </View>
    );
  }


  const { noteStore, userStore } = useStores();

  if ( !isStoreLoaded) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
    );
  } else {
    return (
        <NavigationContainer  independent={true}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
              <Stack.Screen name="Detail" component={DetailsScreen}  />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});

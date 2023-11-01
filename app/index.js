import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { styled, StyledProvider } from '@gluestack-style/react';
import { config } from '../gluestack-style.config.js';
import { useStores, StoreProvider, trunk } from '../stores';
import DetailsScreen from '../screens/Detail';
import Wallet from '../screens/Wallet';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Test from '../screens/Test';
import About from '../screens/About';
import ActionSheetScreen from '../screens/ActionSheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();
export default function App() {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await trunk.init();
      setIsStoreLoaded(true);
    };
    rehydrate();
  }, []);

  function SearchScreen() {
    return <Text>Search</Text>;
  }

  function NotificationScreen() {
    return <Text>Notification</Text>;
  }

  function MessageScreen({ navigation }) {
    return (
      <View style={styles.main}>
        <Button
          title='Go to Details... again'
          onPress={() => navigation.navigate('Detail')}
        />
      </View>
    );
  }
  function MyTab() {
    return (
      <Tab.Navigator
        initialRouteName='Wallet'
        screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name='Wallet'
          component={Wallet}
          options={{
            title: '홈',
            tabBarIcon: ({ color, size }) => (
              <Icon name='home' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name='Search'
          component={SearchScreen}
          options={{
            title: '검색',
            tabBarIcon: ({ color, size }) => (
              <Icon name='search' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name='Notification'
          component={NotificationScreen}
          options={{
            title: '알림',
            tabBarIcon: ({ color, size }) => (
              <Icon name='notifications' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name='Message'
          component={MessageScreen}
          options={{
            title: '메시지',
            tabBarIcon: ({ color, size }) => (
              <Icon name='message' color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const { noteStore, userStore } = useStores();

  if (!isStoreLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  } else {
    return (
      <BottomSheetModalProvider>
        <NavigationContainer independent={true}>
          <GluestackUIProvider config={config}>
            <Stack.Navigator>
              <Stack.Screen
                name='MyTab'
                component={MyTab}
                options={{ headerShown: false }}
              />
              <Stack.Screen name='Detail' component={DetailsScreen} />
              <Stack.Screen
                name='ActionSheetScreen'
                component={ActionSheetScreen}
              />
              <Stack.Screen name='About' component={About} />
              <Stack.Screen name='Test' component={Test} />
            </Stack.Navigator>
          </GluestackUIProvider>
        </NavigationContainer>
      </BottomSheetModalProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
});

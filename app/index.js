import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DetailsScreen from '../screens/Detail';
import Wallet from '../screens/Wallet';
import SignIn from '../screens/SignIn';
import Test from '../screens/Test';
import About from '../screens/About';
import ActionSheetScreen from '../screens/ActionSheet';
import LocalNotification from '../screens/LocalNotification';
import BiometricAuthScreen from '../screens/BiometricAuthScreen';
import HandelAuthentication from '../screens/HandelAuthentication';
import ModalScreen from '../screens/ModalScreen';
import PinCodeScreen from '../screens/PinCodeScreen';

import { config } from '../gluestack-style.config.js';
import { useStores, StoreProvider, trunk } from '../stores';
import Term from '../screens/initScreens/Term';
import PhoneAuth from '../screens/initScreens/PhoneAuth';
import Secret from '../screens/initScreens/Secret';
import { AUTH_STATE } from '../stores/user.store';
import InitPinCodeScreen from '../screens/initScreens/InitPinCodeScreen';
import { observer } from 'mobx-react';

const Tab = createBottomTabNavigator();

const InitStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // if (Device.isDevice) {
  if (3) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: 'dfff3581-3', // Expo Project ID
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

// export default function App() {
const App = observer(() => {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { pinStore, userStore } = useStores();

  useEffect(() => {
    if (Device.isDevice) {
      registerForPushNotificationsAsync().then((token) => {
        console.log('token :', token);
        setExpoPushToken(token);
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);

  useEffect(() => {
    const rehydrate = async () => {
      await trunk.init();
      setIsStoreLoaded(true);
    };
    rehydrate();
  }, []);

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
          <GluestackUIProvider config={config} colorMode='dark'>
            {userStore.state !== AUTH_STATE.DONE ? (
              <InitStackScreen />
            ) : (
              <MainStackScreen />
            )}
          </GluestackUIProvider>
        </NavigationContainer>

        <PinCodeScreen />
      </BottomSheetModalProvider>
    );
  }
});

function InitStackScreen() {
  return (
    <InitStack.Navigator>
      <Stack.Screen
        name='Term'
        component={Term}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Secret'
        component={Secret}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='InitPinCodeScreen'
        component={InitPinCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='PhoneAuth'
        component={PhoneAuth}
        options={{ headerShown: false }}
      />
    </InitStack.Navigator>
  );
}

function MainStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='MyTab'
        component={MyTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='Detail' component={DetailsScreen} />
      <Stack.Screen name='ActionSheetScreen' component={ActionSheetScreen} />
      <Stack.Screen name='About' component={About} />
      <Stack.Screen name='Test' component={Test} />
      <Stack.Screen name='SignIn' component={SignIn} />
      <Stack.Screen name='ModalScreen' component={ModalScreen} />

      <Stack.Screen
        name='HandelAuthentication'
        component={HandelAuthentication}
      />
      <Stack.Screen
        name='BiometricAuthScreen'
        component={BiometricAuthScreen}
      />
    </Stack.Navigator>
  );
}

function MyTab() {
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
        component={LocalNotification}
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
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => console.log('Touchable for tab screen')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
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

export default App;

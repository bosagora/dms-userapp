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

import DetailsScreen from '../screens/kitchen/Detail';
import Kitchen from '../screens/kitchen/Kitchen';
import SignIn from '../screens/kitchen/SignIn';
import Test from '../screens/kitchen/Test';
import About from '../screens/kitchen/About';
import ActionSheetScreen from '../screens/kitchen/ActionSheet';
import LocalNotification from '../screens/kitchen/LocalNotification';
import BiometricAuthScreen from '../screens/kitchen/BiometricAuthScreen';
import HandelAuthentication from '../screens/kitchen/HandelAuthentication';
import ModalScreen from '../screens/kitchen/ModalScreen';
import PinCodeScreen from '../screens/PinCodeScreen';
import Term from '../screens/initScreens/Term';
import PhoneAuth from '../screens/initScreens/PhoneAuth';
import Secret from '../screens/initScreens/Secret';
import { AUTH_STATE } from '../stores/user.store';
import InitPinCodeScreen from '../screens/initScreens/InitPinCodeScreen';
import Temp from '../screens/Temp';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { config } from '../gluestack-style.config.js';
import { useStores, StoreProvider, trunk } from '../stores';

import { observer } from 'mobx-react';
import QRActionSheet from '../screens/QRActionSheet';
import Configuration from '../screens/configuration';
import WalletManager from '../screens/configuration/WalletManager';
import { navigationRef } from '../utils/root.navigation';
import Wallet from '../screens/wallet';
import MileageHistory from '../screens/wallet/MileageHistory';
import MileageRedeemNotification from '../screens/wallet/MileageRedeemNotification';
import * as RootNavigation from '../utils/root.navigation';
import 'react-native-url-polyfill/auto';
const InitStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
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

function useNotificationObserver() {
  React.useEffect(() => {
    let isMounted = true;

    function redirect(notification) {
      const url = notification.request.content.data?.url;
      // if (url) {
      //     router.push(url);
      // }
      RootNavigation.navigate('MileageRedeemNotification');
      console.log('redirect > content :', notification.request.content);
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

const App = observer(() => {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { pinStore, userStore } = useStores();
  useNotificationObserver();
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
        <NavigationContainer independent={true} ref={navigationRef}>
          <GluestackUIProvider config={config} colorMode='dark'>
            {userStore.state !== AUTH_STATE.DONE ? (
              <InitStackScreen />
            ) : (
              <MainStackScreen />
            )}

            <QRActionSheet />
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
      <InitStack.Screen
        name='Term'
        component={Term}
        options={{ headerShown: false }}
      />
      <InitStack.Screen
        name='Secret'
        component={Secret}
        options={{ headerShown: false }}
      />
      <InitStack.Screen
        name='InitPinCodeScreen'
        component={InitPinCodeScreen}
        options={{ headerShown: false }}
      />
      <InitStack.Screen
        name='PhoneAuth'
        component={PhoneAuth}
        options={{ headerShown: false }}
      />
    </InitStack.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name='TabScreens'
        component={TabScreens}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name='Temp'
        component={Temp}
        options={{ headerShown: false }}
      />
      <MainStack.Screen name='WalletManager' component={WalletManager} />
      <MainStack.Screen name='QRActionSheet' component={QRActionSheet} />
      <MainStack.Screen name='MileageHistory' component={MileageHistory} />
      <MainStack.Screen
        name='MileageRedeemNotification'
        component={MileageRedeemNotification}
      />
      <MainStack.Screen
        name='LocalNotification'
        component={LocalNotification}
      />
      <MainStack.Screen name='Detail' component={DetailsScreen} />
      <MainStack.Screen
        name='ActionSheetScreen'
        component={ActionSheetScreen}
      />
      <MainStack.Screen name='About' component={About} />
      <MainStack.Screen name='Test' component={Test} />
      <MainStack.Screen name='SignIn' component={SignIn} />
      <MainStack.Screen name='ModalScreen' component={ModalScreen} />
      <MainStack.Screen
        name='HandelAuthentication'
        component={HandelAuthentication}
      />
      <MainStack.Screen
        name='BiometricAuthScreen'
        component={BiometricAuthScreen}
      />
    </MainStack.Navigator>
  );
}

const TabScreens = observer(() => {
  const { secretStore } = useStores();
  function SearchScreen() {
    return <Text>Search</Text>;
  }

  function NotificationScreen() {
    return <Text>Notification</Text>;
  }

  function MessageScreen({ navigation }) {
    return (
      <View>
        <Button
          title='Go to Details... again'
          onPress={() => navigation.navigate('Detail')}
        />
      </View>
    );
  }
  const handleQRSheet = () => {
    secretStore.setShowQRSheet(!secretStore.showQRSheet);
  };

  return (
    <Tab.Navigator
      initialRouteName='Wallet'
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tab.Screen
        name='Wallet'
        component={Wallet}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name='wallet-outline'
              size={24}
              color={focused ? 'red' : 'black'}
            />
          ),
        }}
      />

      {/*<Tab.Screen*/}
      {/*  name='Search'*/}
      {/*  component={SearchScreen}*/}
      {/*  options={{*/}
      {/*    title: '검색',*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <Icon name='search' color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name='Notification'*/}
      {/*  component={LocalNotification}*/}
      {/*  options={{*/}
      {/*    title: '알림',*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <Icon name='notifications' color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Tab.Screen
        name='Message'
        component={MessageScreen}
        options={{
          title: '메시지',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='qr-code' size={24} color='black' />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => handleQRSheet()} />
          ),
        }}
      />
      <Tab.Screen
        name='Configuration'
        component={Configuration}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name='ios-settings-outline'
              size={24}
              color={focused ? 'red' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Kitchen'
        component={Kitchen}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name='kitchen'
              size={24}
              color={focused ? 'red' : 'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
});

export default App;

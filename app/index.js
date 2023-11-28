import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
import 'react-native-url-polyfill/auto';
import { usePushNotification } from '../hooks/usePushNotification';
import Permissions from '../screens/initScreens/Permissions';

const InitStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = observer(() => {
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);
  const { pinStore, userStore } = useStores();

  const { expoPushToken } = usePushNotification(userStore);
  useEffect(() => {
    const rehydrate = async () => {
      await trunk.init();
      setIsStoreLoaded(true);
      pinStore.setVisible(false);
      console.log('push token :', expoPushToken);
      if (expoPushToken !== undefined && expoPushToken?.data?.length > 10) {
        userStore.setExpoPushToken(expoPushToken.data);
      }
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
        name='Permissions'
        component={Permissions}
        options={{ headerShown: false }}
      />
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

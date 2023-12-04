import { Platform, SafeAreaView } from 'react-native';
import { trunk, useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { getSecureValue, saveSecureValue } from '../../utils/secure.store';
import ImportPrivateKey from '../../components/ImportPrivateKey';
import {
  Box,
  ButtonText,
  Button,
  Center,
  Text,
  VStack,
  Spinner,
  HStack,
} from '@gluestack-ui/themed';
import MobileHeader from '../../components/MobileHeader';
import { Wallet } from 'ethers';
import * as Device from 'expo-device';
import { getClient } from '../../utils/client';

const Secret = observer(({ navigation }) => {
  const { pinStore, userStore, secretStore } = useStores();
  const [client, setClient] = useState();
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const fetchClient = async () => {
    const { client: client1, address: userAddress } = await getClient();
    console.log('>>>>>>> userAddress :', userAddress);
    setClient(client1);
    setAddress(userAddress);
    //
    // const web3Status = await client1.web3.isUp();
    // console.log('web3Status :', web3Status);
    // const isUp = await client1.ledger.isRelayUp();
    // console.log('isUp:', isUp);
    console.log('Secret fetch > client1 :', client1);
    return client1;
  };

  async function createWallet() {
    setIsLoading(true);
    const wallet = Wallet.createRandom();

    console.log('address :', wallet.address);
    console.log('mnemonic :', wallet.mnemonic);
    console.log('privateKey :', wallet.privateKey);

    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('mnemonic', JSON.stringify(wallet.mnemonic));
    await saveSecureValue('privateKey', wallet.privateKey);
    // setIsLoading(false);

    const cc = await fetchClient();
    if (Device.isDevice) {
      await registerPushTokenWithClient(cc);
      resetPinCode();
    } else {
      console.log('Not on device.');
      resetPinCode();
    }
  }

  async function tt() {
    console.log('------>>>>>');
    setIsLoading(true);
    setTimeout(async () => {
      await createWallet();
      setIsLoading(false);
    }, 100);
  }

  async function registerPushTokenWithClient(cc) {
    console.log('registerPushTokenWithClient >>>>>>>> cc:', cc);
    const token = userStore.expoPushToken;
    const language = 'kr';
    const os = Platform.OS === 'android' ? 'android' : 'iOS';
    await cc.ledger.registerMobileToken(token, language, os);
  }
  function resetPinCode() {
    console.log('registerPushToken >>');
    alert('지갑이 생성되었습니다.');
    navigation.navigate('InitPinCodeScreen');
  }

  async function saveKey(key) {
    setIsLoading(true);
    console.log('key :', key);
    const privateKey = key.includes('0x') ? key.split('0x')[1] : key;
    console.log('save privateKey :', privateKey);
    const wallet = new Wallet(key);
    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('privateKey', privateKey);
    setIsLoading(false);
    const cc = await fetchClient();
    if (Device.isDevice) {
      await registerPushTokenWithClient(cc);
      resetPinCode();
    } else {
      console.log('Not on device.');
      resetPinCode();
    }
  }

  return (
    <SafeAreaView>
      <Box
        sx={{
          _dark: { bg: '$backgroundDark800' },
          _web: {
            height: '100vh',
            w: '100vw',
            overflow: 'hidden',
          },
        }}
        height='$full'
        bg='$backgroundLight0'>
        <MobileHeader
          title='지갑 생성'
          subTitle='마일리지 적립/사용을 위한 지갑'
        />
        <VStack space='lg' pt='$4' m='$7'>
          <Box>
            <Button py='$2.5' px='$3' onPress={tt}>
              <ButtonText>지갑 생성하기</ButtonText>
              {isLoading && <Spinner px='$3' color='$amber600' />}
            </Button>
          </Box>
          <ImportPrivateKey saveKey={saveKey} />
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default Secret;

import { SafeAreaView } from 'react-native';
import { trunk, useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { PinCodeT } from '@anhnch/react-native-pincode';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { getSecureValue, saveSecureValue } from '../../utils/secure.store';
import ImportPrivateKey from '../../components/ImportPrivateKey';
import { Box, ButtonText, Button, Center, VStack } from '@gluestack-ui/themed';
import MobileHeader from '../../components/MobileHeader'; //for ethers.js
// import { Client, Context, LIVE_CONTRACTS } from 'dms-sdk-client';
import { Wallet } from 'ethers';

const Secret = observer(({ navigation }) => {
  const { pinStore, userStore, secretStore } = useStores();

  async function createWallet() {
    const wallet = Wallet.createRandom();

    console.log('address :', wallet.address);
    console.log('mnemonic :', wallet.mnemonic);
    console.log('privateKey :', wallet.privateKey);

    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('mnemonic', JSON.stringify(wallet.mnemonic));
    await saveSecureValue('privateKey', wallet.privateKey);
    registerPushToken();
  }

  function registerPushToken() {
    fetch('http://192.168.50.83:8333/api/notification/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: secretStore.address,
        token: userStore.expoPushToken,
        lang: 'kr',
        platform: 'ios',
      }),
    }).then((res) => {
      console.log('response of register token :', JSON.stringify(res));
      resetPinCode();
    });
  }
  function resetPinCode() {
    console.log('registerPushToken >>');
    navigation.navigate('InitPinCodeScreen');
  }

  async function saveKey(key) {
    const privateKey = key.includes('0x') ? key.split('0x')[0] : key;
    console.log('save privateKey :', privateKey);
    const wallet = new Wallet(key);
    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    registerPushToken();
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
            <Button py='$2.5' px='$3' onPress={() => createWallet()}>
              <ButtonText>지갑 생성하기</ButtonText>
            </Button>
          </Box>
          <ImportPrivateKey saveKey={saveKey} />
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default Secret;

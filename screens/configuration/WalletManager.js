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
const { Wallet } = ethers;

const WalletManager = observer(({ navigation }) => {
  const { secretStore } = useStores();

  async function exportWallet() {
    const wallet = Wallet.createRandom();

    console.log('address :', wallet.address);
    console.log('mnemonic :', wallet.mnemonic);
    console.log('privateKey :', wallet.privateKey);

    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('mnemonic', JSON.stringify(wallet.mnemonic));
    await saveSecureValue('privateKey', wallet.privateKey);
    resetPinCode();
  }
  function resetPinCode() {
    navigation.navigate('InitPinCodeScreen');
  }

  async function saveKey(key) {
    const privateKey = key.includes('0x') ? key.split('0x')[0] : key;
    console.log('save privateKey :', privateKey);
    const wallet = new Wallet(key);
    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    resetPinCode();
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
        <MobileHeader title='지갑 관리' subTitle='지갑을 보관하거나 불러오기' />
        <VStack space='lg' pt='$4' m='$7'>
          <Box>
            <Button py='$2.5' px='$3' onPress={() => exportWallet()}>
              <ButtonText>지갑 내보내기</ButtonText>
            </Button>
          </Box>
          <ImportPrivateKey saveKey={saveKey} />
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default WalletManager;

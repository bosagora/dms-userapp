import { Button, View, Text } from 'react-native';
import { trunk, useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { PinCodeT } from '@anhnch/react-native-pincode';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { getSecureValue, saveSecureValue } from '../../utils/secure.store'; //for ethers.js
const { Wallet } = ethers;

const Secret = observer(({ navigation }) => {
  const { pinStore, userStore } = useStores();

  async function createWallet() {
    const wallet = Wallet.createRandom();

    console.log('address :', wallet.address);
    console.log('mnemonic :', wallet.mnemonic);
    console.log('privateKey :', wallet.privateKey);

    await saveSecureValue('address', wallet.address);
    await saveSecureValue('mnemonic', wallet.mnemonic);
    await saveSecureValue('privateKey', wallet.privateKey);
  }
  function resetPinCode() {
    navigation.navigate('InitPinCodeScreen');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Secret Screen</Text>
      <Button title='Create Wallet' onPress={() => createWallet()} />
      <Button title='Next' onPress={() => resetPinCode()} />
    </View>
  );
});

export default Secret;

import { Button, View, Text } from 'react-native';
import { trunk, useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { PinCodeT } from '@anhnch/react-native-pincode';

const Secret = observer(({ navigation }) => {
  const { pinStore, userStore } = useStores();

  function resetPinCode() {
    navigation.navigate('InitPinCodeScreen');
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Secret Screen</Text>
      <Button title='Next' onPress={() => resetPinCode()} />
    </View>
  );
});

export default Secret;

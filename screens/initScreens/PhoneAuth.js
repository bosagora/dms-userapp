import { Button, View, Text } from 'react-native';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';
import React from 'react';
import { AUTH_STATE } from '../../stores/user.store';

const PhoneAuth = observer(({ navigation }) => {
  const { userStore } = useStores();
  function completeAuth() {
    userStore.setAuthState(AUTH_STATE.DONE);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Phone Auth Screen </Text>
      <Button title='Next' onPress={() => completeAuth()} />
    </View>
  );
});

export default PhoneAuth;

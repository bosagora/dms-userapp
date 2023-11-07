import { Button, View, Text } from 'react-native';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';
import React from 'react';

const Term = observer(({ navigation }) => {
  const { noteStore, userStore } = useStores();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Term Screen</Text>
      <Button title='Next' onPress={() => navigation.navigate('Secret')} />
    </View>
  );
});

export default Term;

import React, { useState } from 'react';
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import { useStores } from '../stores';
import { observer } from 'mobx-react';

const PinCodeScreen = observer(({ navigation, route }) => {
  const { pinStore, userStore } = useStores();
  console.log('pinStore :', pinStore);
  return (
    <PinCode
      pin={pinStore.code}
      visible={pinStore.needPinCode}
      mode={pinStore.mode}
      options={{
        backSpace: <Icon name='backspace' size={24} color='white' />,
        lockIcon: <Icon name='lock' size={24} color='white' />,
        retryLockDuration: 1000,
        maxAttempt: 5,
      }}
      textOptions={customTexts}
      styles={customStyles}
      onEnter={() => {
        pinStore.setSuccessEnter(true);
        pinStore.setNeedPinCode(false);
      }}
      onSet={(newPin) => {
        pinStore.setCode(newPin);
        pinStore.setMode(PinCodeT.Modes.Enter);
        navigation.goBack();
      }}
      onReset={() => pinStore.setCode(undefined)}
      onSetCancel={() => pinStore.setMode('enter')}
      onModeChanged={(lastMode, newMode) => {
        console.log(lastMode, newMode);
        if (newMode === 'reset') {
          pinStore.setMode('set');
        }
      }}
    />
  );
});

const customTexts = {
  enter: {
    subTitle: 'Enter PIN to access.',
  },
  set: {
    subTitle: 'Enter {{pinLength}} digits.',
  },
  locked: {
    title: 'Locked',
    subTitle: `Wrong PIN {{maxAttempt}} times.\nTemporarily locked in {{lockDuration}}.`,
  },
};

const EnterAndSet = {
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 100,
  },
  title: { fontSize: 24 },
};

const customStyles = {
  main: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    backgroundColor: 'blue',
  },
  enter: {
    ...EnterAndSet,
    buttonTextDisabled: { color: 'gray' },
  },
  set: EnterAndSet,
  locked: {
    countdown: { borderColor: 'black' },
    countdownText: { color: 'black' },
  },
  reset: {
    confirmText: { color: 'red' },
  },
};

export default PinCodeScreen;

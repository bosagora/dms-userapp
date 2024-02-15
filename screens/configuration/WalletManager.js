import { Platform, SafeAreaView } from 'react-native';
import { trunk, useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import * as Clipboard from 'expo-clipboard';

import { getSecureValue, saveSecureValue } from '../../utils/secure.store';
import ImportPrivateKey from '../../components/ImportPrivateKey';
import {
  Box,
  ButtonText,
  Button,
  Center,
  VStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  Heading,
  Text,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  Input,
  View,
  InputField,
  ButtonGroup,
} from '@gluestack-ui/themed';
import MobileHeader from '../../components/MobileHeader'; //for ethers.js
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getClient } from '../../utils/client';
import * as Device from 'expo-device';
import { MobileType } from 'dms-sdk-client';

const { Wallet } = ethers;

const WalletManager = observer(({ navigation }) => {
  const { userStore, secretStore, loyaltyStore } = useStores();
  const [privateKey, setPrivateKey] = useState(
    '0000000000000000000000000000000000000000000000000000000000000001',
  );

  const [client, setClient] = useState();
  const [address, setAddress] = useState('');

  const fetchClient = async () => {
    try {
      const { client: client1, address: userAddress } = await getClient();
      console.log(
        '>>>>>>> userAddress :',
        userAddress,
        'EXAMPLE_ENV',
        process.env.EXAMPLE_ENV,
      );
      setClient(client1);
      setAddress(userAddress);

      console.log('Secret fetch > client1 :', client1);
      return client1;
    } catch (e) {
      console.log('2:', e);
    }
  };
  async function registerPushTokenWithClient(cc) {
    console.log('registerPushTokenWithClient >>>>>>>> cc:', cc);
    const token = userStore.expoPushToken;
    console.log('token :', token);
    const language = 'kr';
    const os = Platform.OS === 'android' ? 'android' : 'iOS';
    try {
      await cc.ledger.registerMobileToken(
        token,
        language,
        os,
        MobileType.USER_APP,
      );
      return true;
    } catch (e) {
      await Clipboard.setStringAsync(JSON.stringify(e));
      console.log('error : ', e);
      alert(t('secret.alert.push.fail') + JSON.stringify(e.message));
      return false;
    }
  }

  useEffect(() => {
    async function fetchKey() {
      const key = await getSecureValue('privateKey');
      setPrivateKey(key);
    }
    fetchKey();
  }, []);

  async function exportWallet() {
    setShowModal(true);
  }

  async function saveKey(key) {
    key = key.trim();
    // const privateKey = key.includes('0x') ? key.split('0x')[0] : key;
    // console.log('save privateKey :', privateKey);
    let wallet;
    try {
      wallet = new Wallet(key);
    } catch (e) {
      console.log('Invalid private key.');
      alert(t('secret.alert.wallet.invalid'));
      return;
    }
    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('privateKey', key);
    const time = Math.round(+new Date() / 1000);

    const cc = await fetchClient();
    let ret = false;
    if (Device.isDevice) {
      ret = await registerPushTokenWithClient(cc);
    } else {
      ret = true;
      console.log('Not on device.');
    }

    if (ret) {
      loyaltyStore.setLastUpdateTime(time);
      alert(t('config.wallet.alert.import.done'));
      navigation.navigate('Wallet');
    } else {
      alert(t('config.wallet.alert.import.fail'));
    }
  }
  const [showModal, setShowModal] = useState(false);
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
          title={t('config.wallet.header.title')}
          subTitle={t('config.wallet.header.subtitle')}
        />
        <VStack space='lg' pt='$4' m='$7'>
          <Box>
            <Button py='$2.5' px='$3' onPress={() => exportWallet()}>
              <ButtonText>{t('wallet.export')}</ButtonText>
            </Button>
          </Box>
          <ImportPrivateKey saveKey={saveKey} />
        </VStack>
        <Box>
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 150 }}
            enableOnAndroid={true}
            scrollEnabled={true}
            extraScrollHeight={100}
            keyboardShouldPersistTaps='handled'
            scrollToOverflowEnabled={true}
            enableAutomaticScroll={true}>
            <View>
              <Modal
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                }}>
                <ModalBackdrop />
                <ModalContent maxWidth='$96'>
                  <ModalBody p='$5'>
                    <VStack space='xs' mb='$4'>
                      <Heading>{t('config.wallet.modal.heading')}</Heading>
                      <Text size='sm'>
                        {t('config.wallet.modal.body.text.a')}
                      </Text>
                      <Text size='sm'>
                        {t('config.wallet.modal.body.text.b')}
                      </Text>
                    </VStack>
                    <VStack py='$2' space='xl'>
                      <FormControl>
                        <FormControlHelper>
                          <FormControlHelperText>
                            {t('import.body.text.b')}
                          </FormControlHelperText>
                        </FormControlHelper>
                        <Input>
                          <InputField value={privateKey} />
                        </Input>
                      </FormControl>
                    </VStack>

                    <ButtonGroup space='md' alignSelf='center'>
                      <Button
                        variant='outline'
                        py='$2.5'
                        action='secondary'
                        onPress={() => {
                          setShowModal(false);
                        }}>
                        <ButtonText fontSize='$sm' fontWeight='$medium'>
                          {t('button.press.c')}
                        </ButtonText>
                      </Button>
                      <Button
                        variant='solid'
                        bg='$success700'
                        borderColor='$success700'
                        onPress={async () => {
                          await Clipboard.setStringAsync(privateKey);
                          setShowModal(false);
                        }}>
                        <ButtonText fontSize='$sm' fontWeight='$medium'>
                          {t('copy')}
                        </ButtonText>
                      </Button>
                    </ButtonGroup>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </View>
          </KeyboardAwareScrollView>
        </Box>
      </Box>
    </SafeAreaView>
  );
});

export default WalletManager;

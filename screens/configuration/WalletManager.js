import { SafeAreaView } from 'react-native';
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
  InputField,
  ButtonGroup,
} from '@gluestack-ui/themed';
import MobileHeader from '../../components/MobileHeader'; //for ethers.js
const { Wallet } = ethers;

const WalletManager = observer(({ navigation }) => {
  const { secretStore, loyaltyStore } = useStores();
  const [privateKey, setPrivateKey] = useState(
    '0000000000000000000000000000000000000000000000000000000000000001',
  );
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
      alert('유효하지 않은 키 입니다.');
      return;
    }
    secretStore.setAddress(wallet.address);
    await saveSecureValue('address', wallet.address);
    await saveSecureValue('privateKey', key);
    const time = Math.round(+new Date() / 1000);
    loyaltyStore.setLastUpdateTime(time);
    alert('불러온 지갑이 적용 되었습니다.');
    navigation.navigate('Wallet');
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
        <MobileHeader title='지갑 관리' subTitle='지갑을 보관하거나 불러오기' />
        <VStack space='lg' pt='$4' m='$7'>
          <Box>
            <Button py='$2.5' px='$3' onPress={() => exportWallet()}>
              <ButtonText>지갑 내보내기</ButtonText>
            </Button>
          </Box>
          <ImportPrivateKey saveKey={saveKey} />
        </VStack>
        <Box>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}>
            <ModalBackdrop />
            <ModalContent maxWidth='$96'>
              <ModalBody p='$5'>
                <VStack space='xs' mb='$4'>
                  <Heading>지갑 비공개키</Heading>
                  <Text size='sm'>
                    이 키를 다른 기기에 설치된 THE9 앱에 붙여 넣으면 현재 지갑을
                    복구해 사용할 수 있습니다. (다른 기기의 THE9 앱에서 ‘다른
                    지갑 불러오기’ 선택)
                  </Text>
                  <Text size='sm'>
                    경고 : 이 키를 노출하지 마세요. 비공개 키가 있는 사람이라면
                    누구든 회원님의 계정에 있는 자산을 훔칠 수 있습니다.
                  </Text>
                </VStack>
                <VStack py='$2' space='xl'>
                  <FormControl>
                    <FormControlHelper>
                      <FormControlHelperText>
                        여기에 비공개 키 문자열을 붙여넣으세요.
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
                      Close
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
                      Copy
                    </ButtonText>
                  </Button>
                </ButtonGroup>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </SafeAreaView>
  );
});

export default WalletManager;

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  View,
  Divider,
  Button,
  ButtonText,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ButtonGroup,
} from '@gluestack-ui/themed';
import { getSecureValue, saveSecureValue } from '../../utils/secure.store';
import { Client, Context, LIVE_CONTRACTS } from 'dms-sdk-client';
import { Wallet } from 'ethers';
export const web3EndpointsMainnet = {
  working: ['https://mainnet.bosagora.org/'],
  failing: ['https://bad-url-gateway.io/'],
};

export const web3EndpointsDevnet = {
  working: ['http://rpc.devnet.bosagora.org:8545/'],
  failing: ['https://bad-url-gateway.io/'],
};

export const TEST_WALLET_ADDRESS = '0x64D111eA9763c93a003cef491941A011B8df5a49';
export const TEST_WALLET =
  '70438bc3ed02b5e4b76d496625cb7c06d6b7bf4362295b16fdfe91a046d4586c';

const grapqhlEndpoints = {
  working: [
    {
      url: 'http://subgraph.devnet.bosagora.org:8000/subgraphs/name/bosagora/dms-osx-devnet',
    },
  ],
  timeout: [
    {
      url: 'https://httpstat.us/504?sleep=100',
    },
    {
      url: 'https://httpstat.us/504?sleep=200',
    },
    {
      url: 'https://httpstat.us/504?sleep=300',
    },
  ],
  failing: [{ url: 'https://bad-url-gateway.io/' }],
};

export const relayEndpointsDevnet = {
  working: 'http://relay.devnet.bosagora.org:7070/',
  failing: 'https://bad-url-gateway.io/',
};
const contextParamsDevnet = {
  network: 24680,
  signer: new Wallet(TEST_WALLET),
  web3Providers: web3EndpointsDevnet.working,
  relayEndpoint: relayEndpointsDevnet.working,
  graphqlNodes: grapqhlEndpoints.working,
};
const Index = observer(({ navigation }) => {
  const { secretStore, userStore } = useStores();
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState(null);
  const handleQRSheet = () => {
    secretStore.setShowQRSheet(!secretStore.showQRSheet);
    console.log('handle QR sheet : ', secretStore.showQRSheet);
  };

  const convertToToken = () => {
    console.log('convert to token');
    setShowModal(true);
  };
  useEffect(() => {
    async function fetchKey() {
      console.log('1');
      console.log(
        'process.env.public TESTING :',
        process.env.EXPO_PUBLIC_TESTING,
      );
      process.env.TESTING = process.env.EXPO_PUBLIC_TESTING;
      console.log('process.env.TESTING :', process.env.TESTING);
      await getSecureValue('privateKey');
      console.log(
        'LIVE_CONTRACTS.bosagora_devnet.LedgerAddress :',
        LIVE_CONTRACTS.bosagora_devnet.LedgerAddress,
      );

      const ctx = new Context({
        network: 24680,
        signer: new Wallet(TEST_WALLET),
        web3Providers: web3EndpointsDevnet.working,
        relayEndpoint: relayEndpointsDevnet.working,
        graphqlNodes: grapqhlEndpoints.working,
        ledgerAddress: LIVE_CONTRACTS['bosagora_devnet'].LedgerAddress,
        tokenAddress: LIVE_CONTRACTS['bosagora_devnet'].TokenAddress,
        phoneLinkCollectionAddress:
          LIVE_CONTRACTS['bosagora_devnet'].PhoneLinkCollectionAddress,
        validatorCollectionAddress:
          LIVE_CONTRACTS['bosagora_devnet'].ValidatorCollectionAddress,
        currencyRateAddress:
          LIVE_CONTRACTS['bosagora_devnet'].CurrencyRateAddress,
        shopCollectionAddress:
          LIVE_CONTRACTS['bosagora_devnet'].ShopCollectionAddress,
      });
      console.log('2');
      const clienttmp = new Client(ctx);
      console.log('3');
      console.log('clienttmp :', clienttmp);
      setClient(clienttmp);
      const isUp = await client.ledger.isRelayUp();
      console.log('isUp:', isUp);
      const balance = await client.ledger.getPointBalance(TEST_WALLET_ADDRESS);
      console.log('balance :', balance);
    }
    fetchKey();
  }, []);

  return (
    <View
      h='$full'
      sx={{
        _dark: {
          bg: '$backgroundDark800',
          borderColor: '$borderDark800',
        },
      }}>
      <VStack justifyContent='center' alignItems='center' p='$5'>
        <HStack>
          <Box
            // maxWidth='$64'
            w='$full'
            h='$full'
            borderColor='$orange400'
            borderRadius='$xl'
            borderWidth='$2'
            p='$4'
            overflow='hidden'
            sx={{
              '@base': {
                m: '$3',
              },
              _dark: {
                bg: '$backgroundDark900',
                borderColor: '$orange400',
              },
            }}>
            <Box>
              <Heading _dark={{ color: '$textLight200' }} size='lg'>
                나의 KIOS 마일리지
              </Heading>
              <Text _dark={{ color: '$textLight200' }} fontSize='$xs' my='$1.5'>
                모든 키오스크에서 상품 교환이 가능한 통합 마일리지
              </Text>
            </Box>

            <Divider my='$5' mr='$1' bg='$darkBlue300' />
            <Box>
              <HStack justifyContent='space-between'>
                <HStack m='$30'>
                  <Text
                    _dark={{ color: '$textLight200' }}
                    fontSize='$xl'
                    mr='$1'>
                    63
                  </Text>
                  <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                    point
                  </Text>
                </HStack>
                <Pressable
                  onPress={() => navigation.navigate('MileageHistory')}>
                  <Text fontSize='$sm' color='$pink600'>
                    적립/사용 내역
                  </Text>
                </Pressable>
              </HStack>
              <HStack m='$2'>
                <Text _dark={{ color: '$textLight200' }} fontSize='$sm' mr='$1'>
                  ≒ 63 KRW
                </Text>
                <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                  (1 point ≒ 1 KRW)
                </Text>
              </HStack>
              <Button mt='$12' onPress={() => handleQRSheet()}>
                <ButtonText>키오스트에서 사용하기(QR)</ButtonText>
              </Button>
              <Box mt='$4' alignItems='flex-end'>
                <Pressable onPress={() => convertToToken()}>
                  <Text fontSize='$sm' color='$pink600'>
                    > 토근으로 전환하기
                  </Text>
                </Pressable>
              </Box>
            </Box>
          </Box>
        </HStack>
      </VStack>

      <Box>
        <Modal
          isOpen={showModal}
          size='lg'
          onClose={() => {
            setShowModal(false);
          }}>
          <ModalBackdrop />
          <ModalContent maxWidth='$96'>
            <ModalBody p='$5'>
              <VStack space='lg' mb='$4'>
                <Heading>토큰으로 전환하기</Heading>
                <Text size='sm'>
                  포인트를 토큰으로 전환한 후에는 다시 포인트로 전환할 수
                  없으며, 향후 마일리지는 토큰으로 지급됩니다.
                </Text>
                <Text size='sm'>계속 진행하려면 확인을 클릭하세요.</Text>
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
                    취소
                  </ButtonText>
                </Button>
                <Button
                  variant='solid'
                  bg='$success700'
                  borderColor='$success700'
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  <ButtonText fontSize='$sm' fontWeight='$medium'>
                    확인
                  </ButtonText>
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </View>
  );
});

export default Index;

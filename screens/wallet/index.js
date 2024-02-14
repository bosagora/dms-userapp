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
import { getClient } from '../../utils/client';
import { Amount, BOACoin, ContractUtils } from 'dms-sdk-client';
import { convertProperValue } from '../../utils/convert';
import loyaltyStore from '../../stores/loyalty.store';
import {SafeAreaView, StatusBar} from 'react-native';
import { useTranslation } from 'react-i18next';
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Index = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { secretStore, userStore, loyaltyStore } = useStores();
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState();
  const [address, setAddress] = useState('');
  const [payablePoint, setPayablePoint] = useState(new BOACoin(0));
  const [payablePointRate, setPayablePointRate] = useState(new BOACoin(0));
  const [onePointRate, setOnePointRate] = useState(new BOACoin(0));
  const [userTokenBalance, setUserTokenBalance] = useState(new BOACoin(0));
  const [userTokenRate, setUserTokenRate] = useState(new BOACoin(0));
  const [oneTokenRate, setOneTokenRate] = useState(new BOACoin(0));
  const [userLoyaltyType, setUserLoyaltyType] = useState(0);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    console.log('================= userStore', userStore);

    fetchClient().then(() =>
      console.log(
        'end of wallet fetch client > last :',
        loyaltyStore.lastUpdateTime,
      ),
    ).catch(error => {console.log(error)})
  }, []);
  async function fetchClient() {
    try {
      const { client: client1, address: userAddress } = await getClient();
      setClient(client1);
      setAddress(userAddress);

      await setData(client1, userAddress);
      await fetchBalances(client1, userAddress);
    } catch (e) {
      console.log('ee :', e)
    }
  }

  async function fetchBalances(cc, userAddress) {
    if (userStore.walletInterval > 0) clearInterval(userStore.walletInterval);

    const id = setInterval(async () => {
      try {
        await setData(cc, userAddress);
      } catch (e) {
        console.log('setData > e:', e)

      }
    }, 5000);
    userStore.setWalletInterval(id);
  }

  async function setData(cc, userAddress) {
    try {
      const phone = userStore.phone;
      setPhone(phone);
      // console.log('user phone :', phone);

      const loyaltyType = await cc.ledger.getLoyaltyType(userAddress);
      setUserLoyaltyType(loyaltyType);
      // console.log('userLoyaltyType :', loyaltyType);

      const tokenBalance = await cc.ledger.getTokenBalance(userAddress);
      // console.log('tokenBalance :', tokenBalance.toString());
      const tokenBalConv = new BOACoin(tokenBalance);
      // console.log('tokenBalConv :', tokenBalConv.toBOAString());
      setUserTokenBalance(tokenBalConv);

      // const tokenAmount = Amount.make(tokenBalance, 18).value;
      let userTokenCurrencyRate = await cc.currency.tokenToCurrency(
          tokenBalance,
          'krw',
      );
      // console.log('userTokenCurrencyRate :', userTokenCurrencyRate.toString());
      const oneConv = new BOACoin(userTokenCurrencyRate);
      // console.log('oneConv :', oneConv.toBOAString());
      setUserTokenRate(oneConv);

      const oneTokenAmount = BOACoin.make(1, 18).value;
      let oneTokenCurrencyRate = await cc.currency.tokenToCurrency(
          oneTokenAmount,
          'krw',
      );

      // console.log('oneTokenCurrencyRate :', oneTokenCurrencyRate.toString());
      const boaConv = new BOACoin(oneTokenCurrencyRate);
      // console.log('boaBal :', boaConv.toBOAString());
      setOneTokenRate(boaConv);

      const userPoint = await cc.ledger.getPointBalance(userAddress);
      const payableConv = new BOACoin(userPoint);
      // console.log('payableConv :', payableConv.toBOAString());
      setPayablePoint(payableConv);

      let pointCurrencyRate = await cc.currency.pointToCurrency(
          userPoint,
          userStore.currency,
      );
      const pointRateConv = new BOACoin(pointCurrencyRate);
      // console.log('pointRateConv :', pointRateConv.toBOAString());
      setPayablePointRate(pointRateConv);
    } catch (e) {
     console.log('setdata > e:',e)
    }
  }

  // async function fetchBalances() {
  //   const loyaltyType = await client.ledger.getLoyaltyType(address);
  //   console.log('userLoyaltyType :', loyaltyType);
  //   const point = await client.ledger.getPointBalance(address);
  //   console.log('pointBalance :', point.toString());
  //   const tokenBalance = await client.ledger.getTokenBalance(address);
  //   console.log('tokenBalance :', tokenBalance.toString());
  // }
  const handleQRSheet = async () => {
    // await fetchPoints();
    secretStore.setShowQRSheet(!secretStore.showQRSheet);
    console.log('handle QR sheet : ', secretStore.showQRSheet);
  };

  const convertToToken = () => {
    console.log('convert to token');
    setShowModal(true);
  };

  const confirmToToken = async () => {
    console.log('confirm to token');
    let steps = [];
    try {
      for await (const step of client.ledger.changeToLoyaltyToken()) {
        steps.push(step);
        console.log('confirm to token step :', step);
      }
      if (steps.length === 3 && steps[2].key === 'done') {
        setUserLoyaltyType(1);
      }

      alert(t('wallet.alert.convert.done'));
    } catch (e) {
      console.log('error : ', e);
      await Clipboard.setStringAsync(JSON.stringify(e));
      alert(t('wallet.alert.convert.fail') + JSON.stringify(e.message));
    }
    await fetchClient();

    setShowModal(false);
  };


  return (
    <SafeAreaView >
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
              borderColor='$backgroundDark900'
              borderRadius='$xl'
              borderWidth='$1'
              p='$4'
              overflow='hidden'
              sx={{
                '@base': {
                  m: '$3',
                },
                _dark: {
                  bg: '$backgroundDark900',
                  borderColor: '$backgroundDark600',
                },
              }}>
              <Box>
                <Heading _dark={{ color: '$textLight200' }} size='lg'>
                  {t('wallet.heading')} v0.5.7 - {process.env.EXPO_PUBLIC_ENV}
                </Heading>
                <Text
                  _dark={{ color: '$textLight200' }}
                  fontSize='$xs'
                  my='$1.5'>
                  {t('wallet.heading.description')}
                </Text>
              </Box>

              <Divider my='$5' mr='$1' bg='$violet600' />
              {userLoyaltyType === 0 ? (
                <Box>
                  <HStack justifyContent='space-between'>
                    <HStack m='$30'>
                      <Text
                        _dark={{ color: '$textLight200' }}
                        fontSize='$xl'
                        mr='$1'>
                        {convertProperValue(payablePoint.toBOAString())}
                      </Text>
                      <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                        point
                      </Text>
                    </HStack>
                    <Pressable
                      onPress={() => navigation.navigate('MileageHistory')}>
                      <Text fontSize='$sm' color='$violet400'>
                        {t('wallet.link.history')}
                      </Text>
                    </Pressable>
                  </HStack>
                  <HStack m='$2'>
                    <Text
                      _dark={{ color: '$textLight200' }}
                      fontSize='$sm'
                      mr='$1'>
                      ≒ {convertProperValue(payablePointRate.toBOAString())} KRW
                    </Text>
                    <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                      (1 point ≒ 1 {userStore.currency})
                    </Text>
                  </HStack>
                  <Button mt='$12' onPress={() => handleQRSheet()}>
                      <ButtonText>{t('wallet.use.qr')}</ButtonText>
                  </Button>
                  <Box mt='$4' alignItems='flex-end'>
                    <Pressable onPress={() => convertToToken()}>
                      <Text fontSize='$sm' color='$violet400'>
                        {t('wallet.link.convert')}
                      </Text>
                    </Pressable>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <HStack justifyContent='space-between'>
                    <HStack m='$30'>
                      <Text
                        _dark={{ color: '$textLight200' }}
                        fontSize='$xl'
                        mr='$1'>
                        {convertProperValue(userTokenBalance.toBOAString())}
                      </Text>
                      <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                        KIOS
                      </Text>
                    </HStack>
                    <Pressable
                      onPress={() => navigation.navigate('MileageHistory')}>
                      <Text fontSize='$sm' color='$pink600'>
                        {t('wallet.link.history')}
                      </Text>
                    </Pressable>
                  </HStack>
                  <HStack m='$2'>
                    <Text
                      _dark={{ color: '$textLight200' }}
                      fontSize='$sm'
                      mr='$1'>
                      ≒ {convertProperValue(userTokenRate.toBOAString(), 0)} KRW
                    </Text>
                    <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                      (1 KIOS ≒{' '}
                      {convertProperValue(oneTokenRate.toBOAString(), 0, 2)}{' '}
                      KRW)
                    </Text>
                  </HStack>
                  <Button mt='$12' onPress={() => handleQRSheet()}>
                    <ButtonText>
                      {t('wallet.use.qr')}</ButtonText>
                  </Button>
                </Box>
              )}
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
                  <Heading>
                    {t('wallet.link.convert')}</Heading>
                  <Text size='sm'>
                    {t('wallet.modal.heading.description')}
                  </Text>
                  <Text size='sm'>
                    {t('wallet.modal.body.a')}</Text>
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
                      {t('button.press.b')}
                    </ButtonText>
                  </Button>
                  <Button
                    variant='solid'
                    bg='$success700'
                    borderColor='$success700'
                    onPress={() => {
                      confirmToToken();
                    }}>
                    <ButtonText fontSize='$sm' fontWeight='$medium'>
                      {t('button.press.a')}
                    </ButtonText>
                  </Button>
                </ButtonGroup>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
        <StatusBar style="dark-content" backgroundColor="black" />
      </View>
    </SafeAreaView>
  );
});

export default Index;

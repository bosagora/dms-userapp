import { SafeAreaView } from 'react-native';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { CheckIcon } from 'lucide-react-native';
import MobileHeader from '../../components/MobileHeader';
import '@ethersproject/shims';
import { Amount, LoyaltyType, NormalSteps } from 'dms-sdk-client';
import { getClient } from '../../utils/client';
import { convertProperValue } from '../../utils/convert';
import * as Clipboard from 'expo-clipboard';
import {useTranslation} from "react-i18next";

const MileageRedeemNotification = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { loyaltyStore } = useStores();
  const [values, setValues] = useState(['T1', 'T2']);

  const [client, setClient] = useState(null);
  const [address, setAddress] = useState('');

  const [shopName, setShopName] = useState('');
  const [shopId, setShopId] = useState('');
  const [purchaseId, setPurchaseId] = useState('');
  const [amount, setAmount] = useState(new Amount(0, 18));
  const [useAmount, setUseAmount] = useState(new Amount(0, 18));
  const [loyaltyType, setLoyaltyType] = useState(0);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    async function fetchClient() {
      const { client: client1, address } = await getClient();
      setClient(client1);
      setAddress(address);

      const web3Status = await client1.web3.isUp();
      console.log('web3Status :', web3Status);
      const isUp = await client1.ledger.isRelayUp();
      console.log('isUp:', isUp);
      // alert('payment :' + JSON.stringify(loyaltyStore.payment));
      await savePaymnentInfo(client1, loyaltyStore.payment.id);
    }
    fetchClient().then(() => console.log('end of fetchClient')).catch(error => {console.log(error)});

    console.log('loyaltyStore :', loyaltyStore);
    // initiateTimer();
  }, []);
  const saveShopInfo = async (cc, shopId) => {
    // get shop info
    const info = await cc.shop.getShopInfo(shopId);
    console.log('shop info : ', info);
    setShopId(shopId);
    setShopName(info.name);
  };

  const savePaymnentInfo = async (cc, paymentId) => {
    const info = await cc.ledger.getPaymentDetail(paymentId);
    console.log('payment info:', info);
    await Clipboard.setStringAsync(JSON.stringify(info));
    setPurchaseId(info.purchaseId);
    setAmount(new Amount(info.amount, 18));
    setCurrency(info.currency);
    const mm = info.loyaltyType === 0 ? info.paidPoint : info.paidToken;
    setUseAmount(new Amount(mm, 18));
    setLoyaltyType(info.loyaltyType);
    await saveShopInfo(cc, info.shopId);
  };

  async function confirmRedeem() {
    try {
      const steps = [];

      // return;

      for await (const step of client.ledger.approveNewPayment(
        loyaltyStore.payment.id,
        purchaseId,
        amount.value,
        currency.toLowerCase(),
        shopId,
        true,
      )) {
        steps.push(step);
        console.log('confirmRedeem step :', step);
        switch (step.key) {
          case NormalSteps.PREPARED:
            break;
          case NormalSteps.SENT:
            break;
          case NormalSteps.APPROVED:
            break;
          default:
            throw new Error(
              'Unexpected pay point step: ' + JSON.stringify(step, null, 2),
            );
        }
      }
      if (steps.length === 3 && steps[2].key === 'approved') {
        const time = Math.round(+new Date() / 1000);
        loyaltyStore.setLastUpdateTime(time);
        alert(t('wallet.redeem.use.done'));
        navigation.navigate('Wallet');
      }
    } catch (e) {
      console.log('e :', e);
      alert(
          t('wallet.redeem.use.fail') + 'e:' + e.message,
      );
    }
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
        <MobileHeader
          title={t('wallet.redeem.header.title')}
          subTitle={t('wallet.redeem.header.subtitle')}
        />

        <VStack space='lg' pt='$4' m='$7'>
          <HStack>
            <Text w='40%'>{t('shop')} :</Text>
            <Text>{shopName}</Text>
          </HStack>
          <HStack>
            <Text w='40%'>{t('purchase')} ID :</Text>
            <Text>{purchaseId}</Text>
          </HStack>
          <HStack>
            <Text w='40%'>{t('purchase')} {t('amount')} :</Text>
            <Text>
              {convertProperValue(amount.toBOAString())}{' '}
              {currency.toUpperCase()}
            </Text>
          </HStack>
          <HStack>
            <Text w='40%'>{t('wallet.redeem.header.body.a')} :</Text>
            <Text>
              {convertProperValue(useAmount.toBOAString())}{' '}
              {loyaltyType === LoyaltyType.POINT ? 'POINT' : 'TOKEN'}
            </Text>
          </HStack>
          <Box py='$10'>
            <Button py='$2.5' px='$3' onPress={() => confirmRedeem()}>
              <ButtonText>{t('button.press.a')}</ButtonText>
            </Button>
          </Box>
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default MileageRedeemNotification;

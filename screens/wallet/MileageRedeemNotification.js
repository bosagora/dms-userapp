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
import { Amount, NormalSteps } from 'dms-sdk-client';
import { getClient } from '../../utils/client';
import { convertProperValue } from '../../utils/convert';

const MileageRedeemNotification = observer(({ navigation }) => {
  const { loyaltyStore } = useStores();
  const [values, setValues] = useState(['T1', 'T2']);

  const [client, setClient] = useState(null);
  const [address, setAddress] = useState('');

  const [shopName, setShopName] = useState('');
  const [purchaseId, setPurchaseId] = useState('');
  const [amount, setAmount] = useState(new Amount(0, 18));
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
      alert('payment :' + JSON.stringify(loyaltyStore.payment));
      await savePaymnentInfo(client1, loyaltyStore.payment.id);
    }
    fetchClient().then(() => console.log('end of fetchClient'));

    console.log('loyaltyStore :', loyaltyStore);
    // initiateTimer();
  }, []);
  const saveShopInfo = async (cc, shopId) => {
    // get shop info
    const info = await cc.shop.getShopInfo(shopId);
    console.log('shop info : ', info);
    setShopName(info.name);
  };

  const savePaymnentInfo = async (cc, paymentId) => {
    const info = await cc.ledger.getPaymentDetail(paymentId);
    console.log('payment info:', info);
    setPurchaseId(info.purchaseId);
    setAmount(new Amount(info.amount, 18));
    setCurrency(info.currency);
    await saveShopInfo(cc, info.shopId);
  };

  async function confirmRedeem() {
    console.log(
      'confirm Redeem > loyaltyStore.payment :',
      loyaltyStore.payment,
    );
    if (loyaltyStore.payment.id.length < 0) {
      alert('Empty payment Id.');
      return;
    }
    const steps = [];
    const paymentId = loyaltyStore.payment.id;
    let detail = await client.ledger.getPaymentDetail(paymentId);

    console.log('payment detail : ', detail);
    // return;
    // Approve New
    for await (const step of client.ledger.approveNewPayment(
      paymentId,
      detail.purchaseId,
      detail.amount,
      detail.currency.toLowerCase(),
      detail.shopId,
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
      navigation.navigate('Wallet');
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
          title='마일리지 사용 알림'
          subTitle='마일리지로 상품 구매'
        />

        <VStack space='lg' pt='$4' m='$7'>
          <HStack>
            <Text w='40%'>구매 상점 :</Text>
            <Text>{shopName}</Text>
          </HStack>
          <HStack>
            <Text w='40%'>구매 ID :</Text>
            <Text>{purchaseId}</Text>
          </HStack>
          <HStack>
            <Text w='40%'>구매 금액 :</Text>
            <Text>
              {convertProperValue(amount.toBOAString())}{' '}
              {currency.toUpperCase()}
            </Text>
          </HStack>
          <Box py='$10'>
            <Button py='$2.5' px='$3' onPress={() => confirmRedeem()}>
              <ButtonText>확인</ButtonText>
            </Button>
          </Box>
        </VStack>
      </Box>
    </SafeAreaView>
  );
});

export default MileageRedeemNotification;

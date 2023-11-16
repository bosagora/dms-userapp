import { SafeAreaView } from 'react-native';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
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

const MileageRedeemNotification = observer(({ navigation }) => {
  const { noteStore, userStore } = useStores();
  const [values, setValues] = useState(['T1', 'T2']);
  function confirmRedeem() {
    console.log('confirm Redeem.');
    navigation.navigate('Wallet');
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
            <Text>네모 김밥</Text>
          </HStack>
          <HStack>
            <Text w='40%'>구매 금액 :</Text>
            <Text>45800</Text>
          </HStack>
          <HStack>
            <Text w='40%'>사용 금액 :</Text>
            <Text>900</Text>
          </HStack>
          <HStack>
            <Text w='40%'>적립 금액 :</Text>
            <Text>460</Text>
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

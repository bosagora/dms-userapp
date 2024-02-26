import React, { useEffect, useState } from 'react';

import { styled } from '@gluestack-style/react';
import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  VStack,
  Heading,
  ButtonText,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  HStack,
  ActionsheetContent,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputSlot,
  InputIcon,
  InputField,
  Image,
  Text,
} from '@gluestack-ui/themed';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getSecureValue } from '../utils/secure.store';
import QRCode from 'react-native-qrcode-svg';
import { useStores } from '../stores';
import { observer } from 'mobx-react';
import * as Clipboard from 'expo-clipboard';
import { truncateMiddleString } from '../utils/convert';
import { useTranslation } from 'react-i18next';
import { getClient } from '../utils/client';

// export default function QRActionSheet() {
const QRActionSheet = observer(() => {
  const { t } = useTranslation();
  const { secretStore } = useStores();
  const [walletAddress, SetWalletAddress] = useState('');
  useEffect(() => {
    async function fetchWalletAddress() {
      const address = await getSecureValue('address');
      SetWalletAddress(address);
    }
    fetchWalletAddress();
  }, [secretStore.address]);
  const [temporaryAccount, setTemporaryAccount] = useState('00000');
  useEffect(() => {
    try {
      async function fetchTemporaryAccount() {
        const { client: client1, address: userAddress } = await getClient();
        console.log('userAddress >> :', userAddress);
        console.log('client1 >> :', client1);
        const web3Status = await client1.web3.isUp();
        console.log('web3Status :', web3Status);
        const isUp = await client1.ledger.isRelayUp();
        console.log('isUp:', isUp);
        if (isUp) {
          const account = await client1.ledger.getTemporaryAccount();
          console.log('account :', account);
          setTemporaryAccount(account);
        }
      }

      if (secretStore.showQRSheet) fetchTemporaryAccount();
      else setTemporaryAccount('00000');
    } catch (e) {
      console.log('e :', e);
    }
  }, [secretStore.showQRSheet]);
  const handleClose = () =>
    secretStore.setShowQRSheet(!secretStore.showQRSheet);
  return (
    <Box>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Actionsheet
          isOpen={temporaryAccount !== '00000' && secretStore.showQRSheet}
          onClose={handleClose}>
          <ActionsheetBackdrop bg='$borderLight200' />
          <ActionsheetContent maxHeight='75%'>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack w='$full' p={20}>
              <HStack justifyContent='center' alignItems='center' space='md'>
                <Box
                  // maxWidth='$64'
                  borderColor='$borderLight200'
                  borderRadius='$lg'
                  borderWidth='$1'
                  my='$4'
                  overflow='hidden'
                  sx={{
                    '@base': {
                      mx: '$5',
                    },
                    _dark: {
                      bg: '$borderLight0',
                      borderColor: '$borderLight0',
                    },
                  }}>
                  <Box w='$full' p={20}>
                    {walletAddress ? (
                      <QRCode size={250} value={temporaryAccount} />
                    ) : null}
                  </Box>
                  <VStack px='$6' pt='$4' pb='$6'>
                    <Text
                      color='black'
                      _dark={{ color: '$black' }}
                      size='sm'
                      p='$1.5'>
                      {truncateMiddleString(temporaryAccount, 24)}
                    </Text>
                    <Button
                      variant='solid'
                      action='primary'
                      onPress={async () => {
                        await Clipboard.setStringAsync(temporaryAccount);
                        handleClose();
                      }}>
                      <ButtonText fontSize='$sm' fontWeight='$medium'>
                        {t('copy')}
                      </ButtonText>
                    </Button>
                  </VStack>
                </Box>
              </HStack>
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      </KeyboardAvoidingView>
    </Box>
  );
});

export default QRActionSheet;

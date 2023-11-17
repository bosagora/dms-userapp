import React, { useState } from 'react';
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

const Index = observer(({ navigation }) => {
  const { secretStore, userStore } = useStores();
  const [showModal, setShowModal] = useState(false);
  const handleQRSheet = () => {
    secretStore.setShowQRSheet(!secretStore.showQRSheet);
    console.log('handle QR sheet : ', secretStore.showQRSheet);
  };

  const convertToToken = () => {
    console.log('convert to token');
    setShowModal(true);
  };

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
            borderColor='$orange400'
            borderRadius='$xl'
            borderWidth='$5'
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
          size='full'
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

import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import {
  Box,
  Heading,
  VStack,
  Image,
  Text,
  HStack,
  View,
  Divider,
  Button,
  ButtonText,
  ButtonIcon,
  AddIcon,
} from '@gluestack-ui/themed';
import { Link } from 'expo-router';

const Wallet = observer(({ navigation }) => {
  const { userStore } = useStores();
  return (
    <View
      h='$full'
      sx={{
        _dark: {
          bg: '$backgroundDark900',
          borderColor: '$borderDark800',
        },
      }}>
      <VStack justifyContent='center' alignItems='center' p={15}>
        <HStack>
          <Box
            // maxWidth='$64'
            w='$full'
            borderColor='$orange400'
            borderRadius='$xl'
            borderWidth='$5'
            my='$4'
            overflow='hidden'
            sx={{
              '@base': {
                mx: '$5',
              },
              _dark: {
                bg: '$backgroundDark900',
                borderColor: '$orange400',
              },
            }}>
            <Box>
              <Heading _dark={{ color: '$textLight200' }} size='sm'>
                나의 KIOS 마일리지
              </Heading>
              <Text _dark={{ color: '$textLight200' }} fontSize='$xs' my='$1.5'>
                모든 키오스크에서 상품 교환이 가능한 통합 마일리지
              </Text>

              <Divider mt='$1' mb='$1' mr='$1' bg='$darkBlue300' />
            </Box>

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
                <Link href='https://gluestack.io/' isExternal>
                  <Text fontSize='$sm' color='$pink600'>
                    적립/사용 내역
                  </Text>
                </Link>
              </HStack>
              <HStack m='$2'>
                <Text _dark={{ color: '$textLight200' }} fontSize='$sm' mr='$1'>
                  ≒ 63 KRW
                </Text>
                <Text _dark={{ color: '$textLight200' }} fontSize='$sm'>
                  (1 point ≒ 1 KRW)
                </Text>
              </HStack>
              <Button mt='$12' onPress={() => navigation.navigate('Temp')}>
                <ButtonText>키오스트에서 사용하기(QR)</ButtonText>
              </Button>
              <Box mt='$4' alignItems='flex-end'>
                <Link href='https://gluestack.io/' isExternal mr='$2'>
                  <Text fontSize='$sm' color='$pink600'>
                    > 포인트를 토근으로 전환하기
                  </Text>
                </Link>
              </Box>
            </Box>
          </Box>
        </HStack>
      </VStack>
    </View>
  );
});

export default Wallet;

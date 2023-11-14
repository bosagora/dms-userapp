import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Box,
  Heading,
  FlatList,
  HStack,
  Avatar,
  AvatarImage,
  VStack,
  Text,
  Switch,
  FormControlLabelText,
} from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

const Configuration = observer(() => {
  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'PIN 번호 변경',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: '바이오 인증 사용',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: '마일리지 설정',
    },
  ];
  const [nData, setNData] = useState([]);
  return (
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
      <Heading size='xl' p='$4' pb='$3'>
        설정
      </Heading>
      {nData !== null ? (
        <FlatList
          m='$3'
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth='$1'
              borderColor='$trueGray800'
              sx={{
                _dark: {
                  borderColor: '$trueGray100',
                },
                '@base': {
                  pl: 0,
                  pr: 0,
                },
                '@sm': {
                  pl: '$4',
                  pr: '$5',
                },
              }}
              py='$2'>
              <HStack space='md' justifyContent='space-between'>
                <VStack>
                  <Text
                    fontSize='$sm'
                    color='$coolGray600'
                    sx={{
                      _dark: {
                        color: '$warmGray200',
                      },
                    }}>
                    {item.name}
                  </Text>
                </VStack>
                {item.id !== '3ac68afc-c605-48d3-a4f8-fbd91aa97f63' ? (
                  <MaterialIcons
                    name='arrow-forward-ios'
                    size={20}
                    color='white'
                  />
                ) : (
                  <HStack space='sm'>
                    <Switch size='sm' />
                    <FormControlLabelText>Dark Mode</FormControlLabelText>
                  </HStack>
                )}
              </HStack>
            </Box>
          )}
        />
      ) : null}
    </Box>
  );
});

export default Configuration;

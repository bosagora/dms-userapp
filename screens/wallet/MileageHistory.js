import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useStores } from '../../stores';
import { observer } from 'mobx-react';
import { Box, FlatList, HStack, Text, VStack } from '@gluestack-ui/themed';
import MobileHeader from '../../components/MobileHeader';
import { getClient } from '../../utils/client';
import { convertProperValue } from '../../utils/convert';
import { Amount, BOACoin } from 'dms-sdk-client';
import { BigNumber } from '@ethersproject/bignumber';

const MileageHistory = observer(({ navigation }) => {
  const { secretStore, userStore } = useStores();
  const [client, setClient] = useState();
  const [address, setAddress] = useState('');
  const [historyData, setHistoryData] = useState([]);
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }
  console.log(timeConverter(0));
  useEffect(() => {
    const fetchHistory = async () => {
      const { client: client1, address: userAddress } = await getClient();
      console.log('>>>>>>> userAddress :', userAddress);
      setClient(client1);
      setAddress(userAddress);
      //
      // const web3Status = await client1.web3.isUp();
      // console.log('web3Status :', web3Status);
      // const isUp = await client1.ledger.isRelayUp();
      // console.log('isUp:', isUp);

      const res = await client1.ledger.getSaveAndUseHistory(userAddress);
      console.log('res :', res);
      console.log('len :', res.userTradeHistories?.length);
      const history = res.userTradeHistories
        .filter((it) => {
          return it.action === 1 || it.action === 2;
        })
        .map((it) => {
          return {
            id: it.id,
            action: it.action,
            actionName: it.action === 1 ? 'SAVED' : 'USED',
            loyaltyType: it.loyaltyType,
            loyaltyTypeName: it.loyaltyType === 0 ? 'POINT' : 'TOKEN',
            amountPoint: it.amountPoint,
            amountToken: it.amountToken,
            amountValue: it.amountValue,
            blockTimestamp: it.blockTimestamp,
          };
        });
      console.log('history :', history);

      setHistoryData(history);
    };
    fetchHistory();
  }, []);

  const data = [
    {
      id: 'bd7acbea',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: 'PIN 번호 변경',
    },
    {
      id: '3ac68afc',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '바이오 인증 사용',
    },
    {
      id: '58694a0f',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-1',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-2',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-3',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-4',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-5',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-6',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-7',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-8',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-9',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-10',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-11',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-12',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-13',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-14',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-15',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-16',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-17',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-18',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-19',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-20',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
    {
      id: '58694a0f-21',
      type: '적립',
      date: '2023/06/01 15:27:54',
      amount: '5400',
      name: '월렛 설정',
    },
  ];

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
          title='마일리지 적립/사용 내역'
          subTitle='포인트 사용 및 적립 내역'
        />
        <FlatList
          m='$3'
          data={historyData}
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
              <HStack
                space='md'
                alignItems='center'
                justifyContent='space-between'>
                <VStack>
                  <Text
                    fontSize='$sm'
                    color='$coolGray600'
                    sx={{
                      _dark: {
                        color: '$warmGray200',
                      },
                    }}>
                    {item.actionName}
                  </Text>
                  <Text
                    fontSize='$sm'
                    color='$coolGray600'
                    sx={{
                      _dark: {
                        color: '$warmGray200',
                      },
                    }}>
                    {timeConverter(item.blockTimestamp)}
                  </Text>
                </VStack>
                <Box>
                  <Text>
                    {convertProperValue(
                      item.loyaltyType === 1
                        ? new Amount(
                            BigNumber.from(item.amountToken),
                            9,
                          ).toBOAString()
                        : item.amountPoint,
                    )}{' '}
                    {item.loyaltyTypeName}
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}
        />
      </Box>
    </SafeAreaView>
  );
});

export default MileageHistory;

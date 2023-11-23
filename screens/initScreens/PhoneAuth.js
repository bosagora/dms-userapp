import {
  Input,
  InputField,
  Button,
  Heading,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControl,
  ButtonText,
  FormControlError,
  FormControlLabelText,
  FormControlLabel,
  AlertCircleIcon,
  useToast,
  Toast,
  ToastTitle,
  VStack,
  Box,
  InputIcon,
  InputSlot,
  EyeIcon,
  EyeOffIcon,
  HStack,
  Text,
  Icon,
  ArrowLeftIcon,
  Divider,
} from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { config } from '@gluestack-ui/config';
import { observer } from 'mobx-react';
import { AUTH_STATE } from '../../stores/user.store';
import { useStores } from '../../stores';
import '@ethersproject/shims';
import { ContractUtils } from 'dms-sdk-client';

import { getClient } from '../../utils/client';

const registerSchema = yup.object().shape({
  n1: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(2, 'Must be exactly 2 digits')
    .max(2, 'Must be exactly 2 digits'),
  n2: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(2, 'Must be exactly 2 digits')
    .max(2, 'Must be exactly 2 digits'),
  n3: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(2, 'Must be exactly 2 digits')
    .max(2, 'Must be exactly 2 digits'),
});

const registerInitialValues = {
  n1: '00',
  n2: '01',
  n3: '02',
};

const PhoneAuth = observer(({ navigation }) => {
  const [client, setClient] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('08201010002000');
  const [requestId, setRequestId] = useState('');
  // const [authNum, setAuthNum] = useState('000102');
  const toast = useToast();
  const { userStore } = useStores();

  useEffect(() => {
    async function fetchClient() {
      console.log('PhoneAuth > fetchClient');
      const { client, address } = await getClient();
      setClient(client);
      setAddress(address);

      const web3Status = await client.web3.isUp();
      console.log('web3Status :', web3Status);
      const isUp = await client.ledger.isRelayUp();
      console.log('isUp:', isUp);
    }
    fetchClient().then(() => console.log('end of fetchClient'));
  }, []);
  async function registerPhone() {
    const steps = [];
    for await (const step of client.link.register(phone)) {
      console.log('register step :', step);
      steps.push(step);
    }
    if (steps.length === 2 && steps[1].key === 'requested') {
      const requestId = steps[1].requestId;
      setRequestId(requestId);
    }
  }

  async function submitPhone(authNum) {
    const steps = [];
    for await (const step of client.link.submit(requestId, authNum)) {
      steps.push(step);
      console.log('submit step :', step);
    }
    if (steps.length === 2 && steps[1].key === 'accepted') {
      completeAuth();
    }
  }
  function completeAuth() {
    userStore.setPhone(phone);
    userStore.setAuthState(AUTH_STATE.DONE);
  }
  async function changeUnpayableToPayable() {
    const balance = await client.ledger.getPointBalance(address);
    console.log('balance :', balance);

    const phoneHash = ContractUtils.getPhoneHash(phone);
    const unpayablePoint =
      await client.ledger.getUnPayablePointBalance(phoneHash);
    console.log('unpayable point :', unpayablePoint);

    for await (const step of client.ledger.changeToPayablePoint(phone)) {
      console.log('change unpayable to payable step :', step);
    }
    const afterBalance = await client.ledger.getPointBalance(address);
    console.log('afterBalance :', afterBalance);
  }

  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerSchema,

    onSubmit: (values, { resetForm }) => {
      toast.show({
        placement: 'bottom right',
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant='accent' action='success'>
              <ToastTitle>Signed in successfully</ToastTitle>
            </Toast>
          );
        },
      });

      console.log('form values :', values);
      const authNums = values.n1 + values.n2 + values.n3;
      submitPhone(authNums).then((r) => {
        if (r === true) {
          completeAuth();
        }
      });
      // completeAuth();
      resetForm();
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
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
        <MobileHeader />
        <Box
          p='$4'
          flex={1}
          maxWidth='$96'
          alignSelf='center'
          // justifyContent='center'
          w='$full'>
          <Text fontWeight='$bold' fontSize='$md'>
            전화번호
          </Text>
          <HStack my='$3' alignItems='center'>
            <Box flex={4}>
              <Input
                variant='outline'
                mr='$2'
                size='md'
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}>
                <InputField value={phone} />
              </Input>
            </Box>
            <Button
              onPress={() => {
                registerPhone();
              }}
              flex={1}>
              <ButtonText>전송</ButtonText>
            </Button>
          </HStack>
          <Text
            fontSize='$sm'
            fontWeight='normal'
            color='$primary300'
            sx={{
              _dark: { color: '$textDark400' },
            }}>
            전화번호 전송 후에 문자 메세지의 인증 코드 3개를 문자에 표시된
            번호(#1, #2, #3)에 맞추어 입력하고 인증을 진행해 주세요.
          </Text>
          <Divider
            my='$6'
            bg='$backgroundLight200'
            sx={{ _dark: { bg: '$backgroundDark700' } }}
          />
          <VStack>
            <Text
              fontSize='$sm'
              fontWeight='normal'
              color='$primary300'
              alignSelf='flex-end'
              mb='$2'
              sx={{
                _dark: { color: '$textDark400' },
              }}>
              유효시간 : 02:32
            </Text>
            <FormControl
              size='md'
              isRequired={true}
              isInvalid={!!formik.errors.n1}>
              <Input>
                <InputField
                  type='text'
                  placeholder='#1'
                  onChangeText={formik.handleChange('n1')}
                  onBlur={formik.handleBlur('n1')}
                  value={formik.values?.n1}
                />
              </Input>
            </FormControl>
            <FormControl
              size='md'
              isRequired={true}
              isInvalid={!!formik.errors.n2}>
              <Input>
                <InputField
                  placeholder='#2'
                  onChangeText={formik.handleChange('n2')}
                  onBlur={formik.handleBlur('n2')}
                  value={formik.values?.n2}
                />
              </Input>
            </FormControl>
            <FormControl
              size='md'
              isRequired={true}
              isInvalid={!!formik.errors.n3}>
              {/*<FormControlLabel>*/}
              {/*  <FormControlLabelText>#3</FormControlLabelText>*/}
              {/*</FormControlLabel>*/}
              <Input>
                <InputField
                  placeholder='#3'
                  onChangeText={formik.handleChange('n3')}
                  onBlur={formik.handleBlur('n3')}
                  value={formik.values?.n3}
                />
              </Input>
            </FormControl>
            <Button onPress={formik.handleSubmit} my='$4'>
              <ButtonText>인증</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Box>
    </SafeAreaView>
  );
});

function MobileHeader() {
  return (
    <VStack px='$3' mt='$4.5' space='md'>
      {/*<HStack space='md' alignItems='center'>*/}
      {/*  <StyledExpoRouterLink href='..'>*/}
      {/*    <Icon*/}
      {/*      as={ArrowLeftIcon}*/}
      {/*      color='$textLight50'*/}
      {/*      sx={{ _dark: { color: '$textDark50' } }}*/}
      {/*    />*/}
      {/*  </StyledExpoRouterLink>*/}
      {/*  <Text*/}
      {/*    color='$textLight50'*/}
      {/*    sx={{ _dark: { color: '$textDark50' } }}*/}
      {/*    fontSize='$lg'>*/}
      {/*    Sign In*/}
      {/*  </Text>*/}
      {/*</HStack>*/}
      <VStack space='xs' ml='$1' my='$4'>
        <Heading color='$textLight50' sx={{ _dark: { color: '$textDark50' } }}>
          전화번호 인증
        </Heading>
        <Text
          fontSize='$md'
          fontWeight='normal'
          color='$primary300'
          sx={{
            _dark: { color: '$textDark400' },
          }}>
          마일리지 사용을 위한 본인 인증
        </Text>
      </VStack>
    </VStack>
  );
}

export default PhoneAuth;

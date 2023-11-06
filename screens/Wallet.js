import React from 'react';
import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  VStack,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import BiometricAuthScreen from './BiometricAuthScreen';
import HandelAuthentication from './HandelAuthentication';

export default function Wallet({ navigation }) {
  return (
    <Box flex={1} justifyContent='center' bg='$primary950'>
      <VStack space='xl' reversed={false}>
        <Box alignItems='center'>
          <Heading mb='$4' color='white'>
            Sign in form using formik -:
          </Heading>
          <Button
            size='md'
            variant='solid'
            action='primary'
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => navigation.navigate('Detail')}>
            <Text>Go to Detail </Text>
            <ButtonIcon as={AddIcon} />
          </Button>
          <Button
            size='md'
            variant='solid'
            action='primary'
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => navigation.navigate('SignIn')}>
            <Text>Go to SignIn </Text>
            <ButtonIcon as={AddIcon} />
          </Button>
          <Button
            size='md'
            variant='solid'
            action='primary'
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => navigation.navigate('BiometricAuthScreen')}>
            <Text>Go to BiometricAuthScreen </Text>
            <ButtonIcon as={AddIcon} />
          </Button>
          <Button
            size='md'
            variant='solid'
            action='primary'
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => navigation.navigate('HandelAuthentication')}>
            <Text>Go to HandelAuthentication </Text>
            <ButtonIcon as={AddIcon} />
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

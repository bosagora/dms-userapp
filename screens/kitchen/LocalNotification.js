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
import * as Notifications from 'expo-notifications';

async function schedulePushNotification() {
  console.log('dd');
  const hasPushNotificationPermissionGranted =
    await allowsNotificationsAsync2();
  console.log(
    'hasPushNotificationPermissionGranted :',
    hasPushNotificationPermissionGranted,
  );
  if (hasPushNotificationPermissionGranted) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 2 📬",
        body: 'Here is the notification body',
        message: 'mileage-redeem',
      },
      trigger: { seconds: 2 },
    });
  }
}
async function allowsNotificationsAsync2() {
  console.log('allowNotificationAsync');
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export default function LocalNotification({ navigation }) {
  return (
    <Box flex={1} justifyContent='center' bg='$primary950'>
      <VStack space='xl' reversed={false}>
        <Box alignItems='center'>
          <Heading mb='$4' color='white'>
            Schedule Notifications
          </Heading>
          <Button
            size='md'
            variant='solid'
            action='primary'
            isDisabled={false}
            isFocusVisible={false}
            onPress={async () => await schedulePushNotification()}>
            <Text color='white'>Push Notification </Text>
            <ButtonIcon as={AddIcon} />
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

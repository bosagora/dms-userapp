import { Button, View, Text } from 'react-native';

export default function DetailsScreen({ navigation }) {
 return (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
   <Text>Details Screen</Text>
   <Button title='Go to Test' onPress={() => navigation.navigate('Test')} />
   <Button title='Go to Home' onPress={() => navigation.navigate('Wallet')} />
   <Button title='Go back' onPress={() => navigation.goBack()} />
  </View>
 );
}

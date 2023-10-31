import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { observer } from 'mobx-react';
import { useStores } from '../stores';

const About = observer(() => {
 const { noteStore, userStore } = useStores();
 return (
  <View>
   <Link href='/' asChild>
    <Pressable>
     <Text>Home</Text>
    </Pressable>
   </Link>

   <Pressable onPress={() => userStore.setUserName('sony')}>
    <Text>Home {userStore.name}</Text>
   </Pressable>
  </View>
 );
});

export default About;

import { Button, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function Wallet({ navigation }) {
 return (
  <View style={styles.container}>
   <View style={styles.main}>
    <Text style={styles.title}>Wallet</Text>
    <Button
     title='Go to Details... again'
     onPress={() => navigation.navigate('Detail')}
    />
   </View>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  alignItems: 'center',
  padding: 24,
 },
 main: {
  flex: 1,
  justifyContent: 'center',
  maxWidth: 960,
  marginHorizontal: 'auto',
 },
 title: {
  fontSize: 64,
  fontWeight: 'bold',
 },
 subtitle: {
  fontSize: 36,
  color: '#38434D',
 },
});

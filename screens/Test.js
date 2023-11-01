import { Button, View, Text } from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function Test({ navigation }) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title='Snap To 90%' onPress={() => handleSnapPress(2)} />
      <Button title='Snap To 50%' onPress={() => handleSnapPress(1)} />
      <Button title='Snap To 25%' onPress={() => handleSnapPress(0)} />
      <Button title='Close' onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}>
        <BottomSheetView>
          <Text>Awesome 🔥</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

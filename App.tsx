import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CryptoArbitrage from './CryptoArbitrage';
import LoadingScreen from './LoadingScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the duration as needed
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gaptrade</Text>
      <CryptoArbitrage />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default App;

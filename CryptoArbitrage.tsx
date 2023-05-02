import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CryptoArbitrage = () => {
    const [prices, setPrices] = useState<{ [key: string]: number | null }>({
      kucoin: null,
      binance: null,
      coinbase: null,
      kraken: null,
      bitstamp: null,
      gemini: null,
    });
    const [highestExchange, setHighestExchange] = useState<string | null>(null);
    const [lowestExchange, setLowestExchange] = useState<string | null>(null);
    const [percentageDifference, setPercentageDifference] = useState<number | null>(null);
  
    useEffect(() => {
      const fetchCryptoData = async () => {
        try {
          const apiEndpoints = [
            'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT',
            'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
            'https://api.coinbase.com/v2/prices/BTC-USD/spot',
            'https://api.kraken.com/0/public/Ticker?pair=XBTUSD',
            'https://www.bitstamp.net/api/v2/ticker/btcusd/',
            'https://api.gemini.com/v1/pubticker/btcusd',
          ];
          const requests = apiEndpoints.map(endpoint => fetch(endpoint).then(response => response.json()));
          const responses = await Promise.all(requests);
          const currentPrices: { [key: string]: number } = {};
  
          responses.forEach((response, i) => {
            switch (i) {
              case 0:
                currentPrices['KuCoin'] = response.data.bestAsk;
                break;
              case 1:
                currentPrices['Binance'] = parseFloat(response.price);
                break;
              case 2:
                currentPrices['Coinbase'] = parseFloat(response.data.amount);
                break;
              case 3:
                currentPrices['Kraken'] = parseFloat(response.result.XXBTZUSD.a[0]);
                break;
              case 4:
                currentPrices['Bitstamp'] = parseFloat(response.last);
                break;
              case 5:
                currentPrices['Gemini'] = parseFloat(response.last);
                break;
              default:
                break;
            }
          });
  
          setPrices(currentPrices);
  
          const currentPricesArray = Object.values(currentPrices);
          const highestPrice = Math.max(...currentPricesArray);
          const lowestPrice = Math.min(...currentPricesArray);
          const highestExchange = Object.keys(currentPrices).find(key => currentPrices[key] === highestPrice) || null;
          const lowestExchange = Object.keys(currentPrices).find(key => currentPrices[key] === lowestPrice) || null;
          const percentageDifference = ((highestPrice - lowestPrice) / lowestPrice) * 100;
  
          setHighestExchange(highestExchange);
          setLowestExchange(lowestExchange);
          setPercentageDifference(percentageDifference);
        } catch (error) {
          console.log('Error fetching crypto data:', error);
        }
      };
  
      // Fetch data initially and update every 5 seconds
      const interval = setInterval(fetchCryptoData, 5000);
      fetchCryptoData();
  
      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }, []);
  
    return (
        <View>
          <Text style={styles.title}>BTC Arbitrage Opportunities</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Lowest Price</Text>
            <Text style={styles.label}>Highest Price</Text>
            <Text style={styles.label}>Difference</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.heading}>{lowestExchange}</Text>
              <Text style={styles.data}>${lowestExchange && prices[lowestExchange]}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>{highestExchange}</Text>
              <Text style={styles.data}>${highestExchange && prices[highestExchange]}</Text>
            </View>
            <Text style={styles.difference}>{percentageDifference}%</Text>
          </View>
        </View>
    );            
};


const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    column: {
      flex: 1,
    },
    heading: {
      textAlign: 'left',
      marginBottom: 8,
    },
    data: {
      textAlign: 'left',
    },
    difference: {
      flex: 1,
      color: 'green',
      textAlign: 'center',
    },
});
  
  

export default CryptoArbitrage;

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ErrorBannerProps {
  message: string | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = React.memo(({message}) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
});

ErrorBanner.displayName = 'ErrorBanner';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B1B1B',
    borderLeftWidth: 4,
    borderLeftColor: '#F6465D',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    marginHorizontal: 8,
    borderRadius: 6,
  },
  text: {
    color: '#FF9FA3',
    fontSize: 13,
    fontWeight: '500',
  },
});

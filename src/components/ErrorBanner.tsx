import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ErrorBannerProps {
  message: string | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({message}) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  text: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '500',
  },
});

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ConnectionStatus} from '../types';

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({status}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#0ECB81';
      case 'reconnecting':
        return '#F59E0B';
      case 'disconnected':
        return '#F6465D';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.indicator,
          {backgroundColor: getStatusColor()},
        ]}
      />
      <Text style={styles.text}>{getStatusLabel()}</Text>
    </View>
  );
});

StatusIndicator.displayName = 'StatusIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: '#252B34',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B444F',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8E8E8',
  },
});

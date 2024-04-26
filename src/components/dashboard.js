import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text>{item.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ListItem;

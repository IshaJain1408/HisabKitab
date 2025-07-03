import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = (props: any) => {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    props.navigation.replace('WelcomeScreen');
  };

  return (
    <DrawerContentScrollView >
     <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
 
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  logoutButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CustomDrawerContent;

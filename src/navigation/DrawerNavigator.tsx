import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AddCustomerScreen from '../screens/AddCustomerScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="AddCustomerScreen" component={AddCustomerScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

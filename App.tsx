import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import CustomerScreen from './src/screens/CustomerScreen';
import { RootStackParamList } from './src/navigation/types';
import AddCustomerScreen from './src/screens/AddCustomerScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SuccessScreen from './src/screens/SuccessScreen';
import CustomerTransactionScreen from './src/screens/CustomerTransactionScreen';
// import WelcomeScreen from './src/screens/WelcomeScreen';
// import HomeScreen from './src/screens/HomeScreen';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

const Stack = createNativeStackNavigator<RootStackParamList>();

export default class App extends React.Component {
  render() {
    return (
          <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
           <Stack.Screen
            name="CustomerScreen"
            component={CustomerScreen}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="AddCustomerScreen"
            component={AddCustomerScreen}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="SuccessScreen"
            component={SuccessScreen}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="CustomerTransactionScreen"
            component={CustomerTransactionScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        
      </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
}


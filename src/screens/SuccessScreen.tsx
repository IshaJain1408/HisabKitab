import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'SuccessScreen'>;


const SuccessScreen: React.FC<Props> =({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction Saved</Text>
      <Image
        source={require('../assets/Success.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subText}>Email sent</Text>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.doneText} onPress={()=>navigation.navigate('CustomerScreen') }>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subText: { fontSize: 14, color: '#777', marginBottom: 30 },
  image: { width: 200, height: 200, marginBottom: 20 ,marginRight:30},
 doneButton: {
  backgroundColor: '#FFA500',
  paddingVertical: 12,
  width: '80%',             
  alignSelf: 'center',     
  borderRadius: 30,
  alignItems: 'center',    
  justifyContent: 'center', 
},

doneText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',      
},

});

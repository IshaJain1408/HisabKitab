import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, TextInput, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { GoogleAuthService } from '../services/GoogleAuthService';
import { GoogleSheetService } from '../services/GoogleSheetService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerScreen'>;

const CustomerScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<string[][]>([]);

 
  const handleGoogleLogin = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const userInfo = await GoogleAuthService.signIn();
      const idToken = userInfo?.data?.idToken;
      const serverAuthCode = userInfo?.data?.serverAuthCode;

      if (idToken) {
        await AsyncStorage.setItem('google_id_token', idToken);
      }

      if (serverAuthCode) {
        await AsyncStorage.setItem('access_token', serverAuthCode);
        console.log('Access token saved:', serverAuthCode);
      }

      setUser(userInfo);
    } catch (error) {
      console.log('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const fetchCustomerData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const spreadsheetId = await AsyncStorage.getItem('spreadsheetId');
      console.log('Token:', token);
      console.log('Spreadsheet ID:', spreadsheetId);

      if (token && spreadsheetId) {
        const data = await GoogleSheetService.getCustomerData(spreadsheetId, token);
        console.log('Customer Data:', data);
        if (data) {
          setCustomers(data);
        }
      } else {
        console.warn('Missing token or spreadsheet ID');
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await GoogleAuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('User already signed in:', currentUser);
        fetchCustomerData();
      } else {
        await handleGoogleLogin();
        fetchCustomerData();
      }
    } catch (err) {
      console.error('Error checking sign-in status:', err);
    }
  }, [handleGoogleLogin, fetchCustomerData]);

   useFocusEffect(
  useCallback(() => {
    fetchCurrentUser();
    fetchCustomerData();
  }, [fetchCurrentUser, fetchCustomerData])
);


  const handleLogout = async () => {
    try {
      await GoogleAuthService.signOut();
      await AsyncStorage.removeItem('google_id_token');
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('spreadsheet_id');
      setUser(null);
      navigation.replace('WelcomeScreen');
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

     const handleCardPress = () => {
    navigation.navigate('CustomerTransactionScreen')
  };


   return (
    
    <View style={styles.container}>
       
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="black" />
        <View>
          <Text style={styles.userName}>{user?.user?.name}</Text>
          {user?.user?.email && <Text>{user.user.email}</Text>}
        </View>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCustomerScreen')}
      >
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Customers</Text>

      <ScrollView style={{ flex: 1 }}>
        {customers.length > 0 ? (
          customers.map((customer, index) => (
                    <TouchableOpacity
          key={index}
          onPress={() => handleCardPress()}
        >
            <View key={index} style={styles.customerCard}>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.customerName}>{customer[0]}</Text>
                <Text style={styles.customerEmail}>{customer[1]}</Text>
              </View>
              <View style={styles.amountBox}>
                <Text style={styles.amountText}>₹{customer[2]||customer[3]}</Text>
              </View>
            </View>
                    </TouchableOpacity>

          ))
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/empty.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
        <Text style={styles.addButtonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default CustomerScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 12,
    color: '#888',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    marginTop: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 25,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  customerCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 12,
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
},
customerName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},
customerEmail: {
  fontSize: 12,
  color: '#666',
},
amountBox: {
  backgroundColor: '#FFF3E0',
  borderRadius: 12,
  paddingVertical: 5,
  paddingHorizontal: 10,
},
amountText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#FF9800',
},

});

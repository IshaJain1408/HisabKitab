// import React, { Component } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GoogleAuthService } from '../GoogleAuthService';
// import { SignInResponse } from '@react-native-google-signin/google-signin';

// const { width } = Dimensions.get('window');

// interface State {
//   user: SignInResponse | null;
// }

// class WelcomeScreen extends Component<any, State> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       user: null,
//     };
//   }

//   handleGoogleLogin = async () => {
//     try {
//       const userInfo = await GoogleAuthService.signIn();
//       const idToken = userInfo?.data?.idToken;

//       if (idToken) {
//         await AsyncStorage.setItem('google_id_token', idToken);
//         this.setState({ user: userInfo });
//         this.props.navigation.replace('CustomerScreen'); 
//       }
//     } catch (error: any) {
//       console.log('Google Sign-In Error:', error);
//       Alert.alert('Login Failed', error?.message || 'Something went wrong');
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.logoBox}>
//           <Text style={styles.logoText}>
//             <Text style={styles.blackText}>Hisab</Text>
//             <Text style={styles.orangeText}>Kitab</Text>
//           </Text>
//           <Text style={styles.subText}>Budget Better. Live Smarter</Text>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={this.handleGoogleLogin}>
//           <Text style={styles.buttonText}>Sign In With Google</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// export default WelcomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 24,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 80,
//   },
//   logoBox: {
//     alignItems: 'center',
//     marginTop: 100,
//   },
//   logoText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//   },
//   blackText: {
//     color: '#000',
//   },
//   orangeText: {
//     color: '#FFA500',
//   },
//   subText: {
//     color: '#888',
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   button: {
//     backgroundColor: '#FFA500',
//     paddingVertical: 16,
//     width: width * 0.8,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleAuthService } from '../services/GoogleAuthService';
import { SignInResponse } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const [user, setUser] = useState<SignInResponse | null>(null);
  const navigation = useNavigation<any>();

  const handleGoogleLogin = async () => {
    try {
      const userInfo = await GoogleAuthService.signIn();
      const idToken = userInfo?.data?.idToken;

      if (idToken) {
        await AsyncStorage.setItem('google_id_token', idToken);
        const token = await GoogleAuthService.getAccessToken();
    if (token) {
      await AsyncStorage.setItem('access_token', token);
    }

        setUser(userInfo);
        navigation.replace('CustomerScreen');
      }
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      Alert.alert('Login Failed', error?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>
          <Text style={styles.blackText}>Hisab</Text>
          <Text style={styles.orangeText}>Kitab</Text>
        </Text>
        <Text style={styles.subText}>Budget Better. Live Smarter</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Sign In With Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  logoBox: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  blackText: {
    color: '#000',
  },
  orangeText: {
    color: '#FFA500',
  },
  subText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 16,
    width: width * 0.8,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

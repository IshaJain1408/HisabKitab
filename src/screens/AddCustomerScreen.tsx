import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSheetService } from '../services/GoogleSheetService';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  amount: Yup.number().typeError('Amount must be a number')
    .required('Amount is required')
    .min(1, 'Amount must be at least ₹1')
    .max(1000000, 'Amount cannot exceed ₹10,00,000'),
  details: Yup.string().required('Details are required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date cannot be before start date'),
});

const AddCustomerScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [transactionType, setTransactionType] = useState<'Credit' | 'Debit' | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());


  useEffect(() => {
    const initializeSheetData  = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const savedSheetId = await AsyncStorage.getItem('spreadsheetId');

      if (!token) return;

      if (!savedSheetId || !(await GoogleSheetService.sheetExists(savedSheetId, token))) {
        const newSheetId = await GoogleSheetService.createSheet(token);
        if (newSheetId) {
          await AsyncStorage.setItem('spreadsheetId', newSheetId);
          setSpreadsheetId(newSheetId);
        }
      } else {
        setSpreadsheetId(savedSheetId);
      }

      setAccessToken(token);
    };

    initializeSheetData ();
  }, []);

  const formatDate = (date: Date): string =>
    `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()}`;

  const handleSave = async (values: any) => {
    if (!spreadsheetId) return Alert.alert('Google Sheet not found');
    if (!transactionType) return Alert.alert('Please select Credit or Debit');

    const creditAmount = transactionType === 'Credit' ? values.amount : '';
    const debitAmount = transactionType === 'Debit' ? values.amount : '';

    const data = [[
      values.name,
      values.email,
      creditAmount,
      debitAmount,
      values.details,
      formatDate(values.startDate),
      formatDate(values.endDate),
    ]];

    const success = await GoogleSheetService.appendCustomerData(spreadsheetId, accessToken, data);

    success
      ? navigation.replace('SuccessScreen')
      : Alert.alert('Failed to save');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Customer</Text>

      <Formik
        initialValues={{
          name: '',
          email: '',
          amount: '',
          details: '',
          startDate: new Date(),
          endDate: new Date(),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={18} color="#666" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter Name"
                value={values.name}
                onChangeText={handleChange('name')}
              />
            </View>
            {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color="#666" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter Email"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
              />
            </View>
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>₹</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={values.amount}
                onChangeText={handleChange('amount')}
              />
            </View>
            {touched.amount && errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="document-text-outline" size={18} color="#666" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter Details"
                value={values.details}
                onChangeText={handleChange('details')}
              />
            </View>
            {touched.details && errors.details && <Text style={styles.errorText}>{errors.details}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={18} color="#666" style={styles.icon} />

              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateText}>{formatDate(values.startDate)}</Text>
              </TouchableOpacity>

              <Text style={styles.arrow}>→</Text>

              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateText}>{formatDate(values.endDate)}</Text>
              </TouchableOpacity>
            </View>

            {touched.startDate && errors.startDate && (
              <Text style={styles.errorText}>{errors.startDate as string}</Text>
            )}
            {touched.endDate && errors.endDate && (
              <Text style={styles.errorText}>{errors.endDate as string}</Text>
            )}
            {showStartPicker && (
               <DateTimePicker
    value={startDate}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowStartPicker(false);
      if (selectedDate) {
        setStartDate(selectedDate); 
        setFieldValue('startDate', selectedDate); 
      }
    }}
  />
)}
          {showEndPicker && (
            <DateTimePicker
    value={endDate}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowEndPicker(false);
      if (selectedDate) {
        setEndDate(selectedDate); 
        setFieldValue('endDate', selectedDate); 
      }
    }}
  />
          )}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  transactionType === 'Credit' && { backgroundColor: '#008000' },
                ]}
                onPress={() => setTransactionType('Credit')}
              >
                <Text style={styles.footerButtonText}>Credit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.footerButton,
                  transactionType === 'Debit' && { backgroundColor: '#B22222' },
                ]}
                onPress={() => setTransactionType('Debit')}
              >
                <Text style={styles.footerButtonText}>Debit</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default AddCustomerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  headerText: { fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row', backgroundColor: '#f3f3f3', borderRadius: 10,
    paddingHorizontal: 10, alignItems: 'center', marginBottom: 10, height: 50,
  },
  prefix: { color: '#555', fontSize: 16, marginRight: 5 },
  icon: { marginRight: 5 },
  textInput: { flex: 1, fontSize: 16, color: '#000' },
  dateText: { fontSize: 14, color: '#555' },
  arrow: { marginHorizontal: 10, fontSize: 16, color: '#777' },
  saveButton: {
    backgroundColor: '#FFA500', borderRadius: 25, paddingVertical: 15,
    alignItems: 'center', marginTop: 20,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', fontSize: 13, marginBottom: 8, marginLeft: 10 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 20,
  },
  footerButton: {
    backgroundColor: '#FFA500',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

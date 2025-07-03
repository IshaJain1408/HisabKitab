import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Transaction = {
  id: string;
  date: string;
  time: string;
  label: string;
  amount: number;
  type: 'credit' | 'debit';
};

const transactions: Transaction[] = [
  {
    id: '1',
    date: '12 May 2025',
    time: '12:32 PM',
    label: 'Product',
    amount: 5000,
    type: 'credit',
  },
  {
    id: '2',
    date: '14 May 2025',
    time: '12:32 PM',
    label: 'Amount',
    amount: 5000,
    type: 'debit',
  },
];

const CustomerTransactionScreen: React.FC = () => {
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.timeText}>{item.time}</Text>
      <View style={styles.transactionRow}>
        <Text style={styles.label}>{item.label}</Text>
        <Text
          style={
            item.type === 'credit' ? styles.creditAmount : styles.debitAmount
          }
        >
          ₹{item.amount}
        </Text>
        <Ionicons name="person-outline" size={20} color="#444" />
      </View>
    </View>
  );

  const uniqueDates = Array.from(new Set(transactions.map((t) => t.date)));

  return (
    <ScrollView style={styles.container}>
     <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} >
          <Ionicons name="arrow-back" size={20} color="#f89b29" />
        </TouchableOpacity>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.customerName}>Rahul Verma</Text>
          <Text style={styles.customerPhone}>6574643579</Text>
        </View>
      </View>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>You will get</Text>
        <Text style={styles.balanceAmount}>₹5000</Text>
      </View>

      <View style={styles.reportBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.reportText}> Report</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>

      <View style={styles.tabBar}>
        <Text style={styles.activeTab}>ENTRIES</Text>
        <Text style={styles.inactiveTab}>CREDIT</Text>
        <Text style={styles.inactiveTab}>DEBIT</Text>
      </View>

      {uniqueDates.map((date) => (
        <View key={date}>
          <View style={styles.dateChip}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <FlatList
            data={transactions.filter((t) => t.date === date)}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  headerWrapper: {
    backgroundColor: '#f89b29',
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  customerPhone: {
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
  },

  balanceBox: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 1.5,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#000',
  },
  balanceAmount: {
    fontSize: 16,
    color: '#CE91EA',
    fontWeight: 'bold',
  },

  reportBar: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },
 
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap:60,
    paddingHorizontal:20,
    paddingVertical: 12,
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#f89b29',
  },
  inactiveTab: {
    color: '#999',
  },

  dateChip: {
    alignSelf: 'center',
    backgroundColor: '#f1d4a7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  dateText: { fontWeight: '600' },

  transactionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    elevation: 1,
  },
  timeText: { fontSize: 12, color: '#888' },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  label: { fontSize: 16, color: '#333' },
  creditAmount: { fontSize: 16, color: 'green' },
  debitAmount: { fontSize: 16, color: 'red' },
});

export default CustomerTransactionScreen;

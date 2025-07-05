import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const DatePick = ({day, setDay, month, setMonth, year, setYear}) => {
  const currentYear = new Date().getFullYear();
  const [daysInMonth, setDaysInMonth] = useState(31);

  useEffect(() => {
    const daysCount = new Date(year, month, 0).getDate();
    setDaysInMonth(daysCount);
    if (day > daysCount) {
      setDay(daysCount);
    }
  }, [month, year]);

  return (
    <View style={styles.datePickerContainer}>
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Ngày</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={day}
            onValueChange={(val) => setDay(val)}
          >
            {[...Array(daysInMonth)].map((_, index) => {
              const d = index + 1;
              return <Picker.Item key={d} label={`${d}`} value={d} />;
            })}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Tháng</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={month}
            onValueChange={(val) => setMonth(val)}
          >
            {[...Array(12)].map((_, index) => {
              const m = index + 1;
              return <Picker.Item key={m} label={`${m}`} value={m} />;
            })}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Năm</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={year}
            onValueChange={(val) => setYear(val)}
          >
            {[...Array(101)].map((_, index) => {
              const y = currentYear - index;
              return <Picker.Item key={y} label={`${y}`} value={y} />;
            })}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 5,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 0.8,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    width: '100%',
    height: hp(7.2),
    backgroundColor: '#fff',
  },
  picker: {
    width: '110%',
    height: '100%',
  },
});

export default DatePick;

import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import { getToken } from '../helpers/common';
import React from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Loading, ScreenWrapper } from '../components';
import Icon from '../assets/icons'
import { theme } from '../constants/theme';
import { Input } from '../components';
import API from '../API';

export default function AddNguyenLieu({ navigation }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tenNL, setTenNL] = useState('');
  const [calories, setCalories] = useState('');

  const load = async () => {
    setLoading(true);
    const token = await getToken();
    const response = await fetch(`${API}/api/NguyenLieu/getallnguyenlieu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(token)
    });
    const data = await response.json();
    setIngredients((prev) => data);
    setLoading(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await load();
      })();
      return () => { };
    }, [navigation])
  );

  const filteredIngredients = ingredients.filter(item =>
    item.tenNL.toLowerCase().includes(searchText.toLowerCase())
  );


  const handleDelete = async (maNL) => {
    const token = await getToken();
    const respone = await fetch(`${API}/api/NguyenLieu/deleteNguyenLieuForAdmin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, maNL: Number(maNL) })
    })
    if (respone.ok) {
      await load();
    }
  }

  const handleAdd = async () => {
    if (!tenNL || !calories) {
      Alert.alert("Thêm nguyên liệu", "Vui lòng nhập thông tin nguyên liệu!")
    }
    if (!/^\d+$/.test(calories)) {
      Alert.alert("Thêm nguyên liệu", 'Calories chỉ được chứa số!');
      return;
    }
    setLoading(true);
    const token = await getToken();
    const respone = await fetch(`${API}/api/NguyenLieu/addnguyenlieu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, tenNL, calories: Number(calories), anhNL: "string" })
    })
    if (respone.ok) {
      setTenNL('');
      setCalories('');
      await load();
    }
    setLoading(false);
  }

  return (
    <ScreenWrapper>
      {loading ? <Loading /> : (
        <View style={styles.container}>
          <Text style={styles.title}>Quản Lý Nguyên Liệu</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên nguyên liệu"
            value={tenNL}
            onChangeText={setTenNL}
          />
          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={() => handleAdd()}>
            <Text style={styles.buttonText}>Thêm</Text>
          </TouchableOpacity>
          <View style={{ marginVertical: 12 }}>
            <Input
              value={searchText}
              placeholder='Tìm kiếm nguyên liệu'
              onChangeText={value => setSearchText(value)}
            />
          </View>
          <FlatList
            data={filteredIngredients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View >
                  <Text style={styles.name}>{item?.tenNL}</Text>
                  <Text style={styles.calories}>{item?.calories} kcal</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item?.maNL)}>
                  <Icon name='delete' size={20} color={theme.colors.rose} />
                </TouchableOpacity>
              </View >
            )}
          />
        </View>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  calories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

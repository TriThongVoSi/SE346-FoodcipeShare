import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { ScreenWrapper, Header, Input } from '../components'
import { Button } from '../components';
import { getToken, hp } from '../helpers/common';
import API from '../API';
import { useFocusEffect } from '@react-navigation/native';

const Search = ({ navigation }) => {

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minCalo, setMinCalo] = useState();
  const [maxCalo, setMaxCalo] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setLoading(true);
        const token = await getToken();
        const response = await fetch(`${API}/api/NguyenLieu/getallnguyenlieu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        });
        const data = await response.json();
        setIngredients(data)
        setLoading(false);
      })();
      return () => { };
    }, [navigation])
  );

  const filteredIngredients =
    searchQuery === '' ? [] : ingredients.filter(ingredient =>
      ingredient.tenNL.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredients((prevSelected) => {
      const isIngredientSelected = prevSelected.find(item => item.maNL === ingredient.maNL);

      if (isIngredientSelected) {
        return prevSelected.filter(item => item.maNL !== ingredient.maNL)
      } else {
        return [...prevSelected, { ...ingredient, isInputVisible: true, }];
      }
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    if (ingredients.length == 0 || !minCalo || !maxCalo) {
      Alert.alert("Tìm kiếm", "Vui lòng nhập đủ thông tin tìm kiếm!");
      setLoading(false)
      return;
    }

    if (Number(minCalo) > (Number(maxCalo))) {
      Alert.alert("Tìm kiếm", "Calo min không được lớn hơn calo max!");
      setLoading(false)
      return;
    }
    const token = await getToken();
    const list = selectedIngredients.map((item) => Number(item.maNL))
    
    const respone = await fetch(`${API}/api/CongThuc/findPosts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, danhsachNguyenlieu: list, caloMin: Number(minCalo), caloMax: Number(maxCalo) })
    })
    const data = await respone.json();
    setLoading(false);0
    navigation.navigate("SearchResult", data)
  }

  return (
    <ScreenWrapper>
      <View >
        <Header title="Tìm kiếm công thức" navigation={navigation} showBackButton={true} />
      </View>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View style={{ marginTop: 20 }}>
              <Input
                value={selectedIngredients}
                placeholder='Tìm nguyên liệu ...'
                onChangeText={value => setSearchQuery(value)}
              />
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
                <Input
                  value={minCalo}
                  placeholder='Calo min'
                  onChangeText={value => setMinCalo(value)}
                  isSearch={true}
                  keyboardType="numeric"
                  containerStyle={{ width: '45%' }}
                />
                <Text> - </Text>
                <Input
                  value={maxCalo}
                  placeholder='Calo max'
                  onChangeText={value => setMaxCalo(value)}
                  isSearch={true}
                  keyboardType='numeric'
                  containerStyle={{ width: '45%' }}
                />
              </View>

              <View style={styles.selectedIngredientsContainer}>
                <Text style={styles.selectedIngredientsTitle}>Nguyên liệu đã chọn:</Text>
                {selectedIngredients.length > 0 ? (
                  selectedIngredients.map((ingredient, index) => (
                    <View
                      key={index}
                      style={styles.selectedIngredientText}
                    >
                      <Text>{ingredient.tenNL}  </Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {ingredient.isInputVisible && (
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginRight: 24 }}>
                          </View>
                        )}
                        <TouchableOpacity onPress={() => handleSelectIngredient(ingredient)} >
                          <Text>Xóa</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSelection}>Chưa có nguyên liệu nào được chọn</Text>
                )}
              </View>

              <FlatList
                data={filteredIngredients}
                keyExtractor={(item) => item.maNL}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectIngredient(item)}
                    style={[
                      styles.ingredientItem,
                      selectedIngredients.some(ingredient => ingredient.maNL === item.maNL) && styles.selectedItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ingredientText,
                        selectedIngredients.some(ingredient => ingredient.maNL === item.maNL) && styles.selectedText,
                      ]}
                    >
                      {item.tenNL}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        />

      </View>

      <Button
        button={{ height: hp(6.2), marginBottom: 12, width: '80%', margin: 'auto' }}
        title="Tìm kiếm"
        loading={loading}
        shadow={false}
        press={handleSearch}
      />
    </ScreenWrapper>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 8
  },
  selectedItem: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  ingredientItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  selectedIngredientsContainer: {
    marginTop: 20,
  },
  selectedIngredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedIngredientText: {
    paddingHorizontal: 2,
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noSelection: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  }
})
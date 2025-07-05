import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Input from './Input';
import { getToken, hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import Icon from '../assets/icons';
import * as ImagePicker from 'expo-image-picker'
import Button from './Button';
import API from '../API';

const Recipe = ({ ingredients, navigation }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodBio, setFoodBio] = useState('');
  const [img, setImg] = useState(img);
  const [loading, setLoading] = useState(false);

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
        return [...prevSelected, { ...ingredient, isInputVisible: true, quantity: '' }];
      }
    });
  };

  const handleQuantityChange = (ingredientId, quantity) => {
    setSelectedIngredients(prevSelected =>
      prevSelected.map(item =>
        item.maNL === ingredientId ? { ...item, quantity } : item
      )
    );
  };

  const pickImage = async () => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)
    if (!result.canceled) {
      setImg(result.assets[0].uri)
    }
  }

  const uploadImage = async () => {
    const uri = img;
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    const formData = new FormData();
    formData.append('image', { uri, name: filename, type });

    try {
      const res = await fetch(`${API}/api/Image/Upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      alert('Upload thất bại!');
      throw (err);
    }
  }

  const post = async () => {
    setLoading(true);
    try {
      if (!foodName || !foodBio || !img || selectedIngredients.length == 0) {
        Alert.alert("Đăng công thức", "Vui lòng nhập đầy đủ thông tin!")
        setLoading(false);
        return;
      }

      const res = await uploadImage();
      setImg(res.url)

      const token = await getToken();

      const tongCalories = selectedIngredients.reduce((total, ingredient) => {
        return total + ingredient.calories * (ingredient.quantity / 100);
      }, 0);

      const today = new Date();
      const NL = selectedIngredients.map((ingredients) => {
        return {
          maNL: Number(ingredients.maNL),
          dinhLuong: Number(ingredients.quantity),
          donViTinh: "gram"
        }
      })

      const respone = await fetch(`${API}/api/CongThuc/addcongthuc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, tenCT: foodName, moTaCT: foodBio, tongCalories: tongCalories, anhCT: res.url, luotXem: 0, luotLuu: 0, luotThich: 0, ngayCapNhat: today, nguyenLieus: NL })
      })

      if (respone.ok) {
        Alert.alert("Đăng bài", "Đăng thành công!");
        navigation.navigate("Dashboard")
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Đăng bài", "Lỗi đăng bài vui lòng thử lại sau!");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>

      {/* Gioi thieu mon an  */}
      <View style={styles.form}>
        <Input
          value={foodName}
          placeholder='Tên món ăn'
          onChangeText={value => setFoodName(value)}
        />

        <Input
          value={foodBio}
          placeholder='Mô tả món ăn của bạn'
          multiline={true}
          containerStyle={styles.bio}
          onChangeText={value => setFoodBio(value)}
        />

        {
          img && (
            <View style={styles.file}>
              <Image source={{ uri: img }} resizeMode='cover' style={{ flex: 1 }} />
              <Pressable style={styles.closeIcon} onPress={() => setImg(null)}>
                <Icon name='delete' size={20} color='white' />
              </Pressable>
            </View>
          )
        }

        <View style={styles.media}>
          <Text style={styles.addImageText}>Thêm ảnh</Text>
          <View style={styles.mediaIcons}>
            <TouchableOpacity onPress={pickImage}>
              <Icon
                name='image'
                size={30}
                color={theme.colors.dark}
              />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Chon nguyen lieu  */}
      <View style={styles.selectedIngredientsContainer}>
        <Text style={styles.selectedIngredientsTitle}>Nguyên liệu đã chọn:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm nguyên liệu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
                    <TextInput
                      style={styles.quantityInput}
                      placeholder="gram"
                      value={ingredient.quantity}
                      onChangeText={(value) => handleQuantityChange(ingredient.maNL, value)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => handleSelectIngredient(ingredient)}
                >
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
              {item.tenNL} - {item.calories} calo/100 gram
            </Text>
          </Pressable>
        )}
      />

      <Button
        button={{ height: hp(6.2), marginBottom: 12, width: '100%', margin: 'auto' }}
        title="Đăng"
        loading={loading}
        shadow={false}
        press={post}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  form: {
    gap: 12,
    marginTop: 20,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: theme.colors.text,
    borderWidth: 0.8,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  ingredientItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
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
    alignItems: 'center',
  },
  quantityInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: 60
  },
  noSelection: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  header: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(255,0,0,0.6)'
  }
});

export default Recipe;

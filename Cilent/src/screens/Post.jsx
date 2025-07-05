import { ScrollView, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Button, Header, Recipe, ScreenWrapper } from '../components'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../helpers/common'
import API from '../API'
import { Loading } from '../components'

const Post = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [userInfo, setUserInfo] = useState({
    anhDaiDien: "",
    tenND: "",
  })

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

        const responseUser = await fetch(`${API}/api/Account/getuserinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        });
        const userInfo = await responseUser.json();
        setUserInfo(userInfo);

        setLoading(false);
      })();
      return () => { };
    }, [navigation])
  );

  return (
    <ScreenWrapper bg="white">
      <Header title="Đăng công thức" showBackButton={true} navigation={navigation} />
      {loading ? (<Loading />) : (
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={{ marginTop: 20 }}>
                <View style={styles.header}>
                  <Avatar
                    uri={(userInfo.anhDaiDien == "image" || userInfo.anhDaiDien == "") ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : userInfo.anhDaiDien}
                    size={hp(6.5)}
                    rounded={theme.radius.xl}
                  />

                  <View style={{ gap: 2 }}>
                    <Text style={styles.username}>{userInfo.tenND}</Text>
                    <Text style={styles.publicText}>Đăng công khai</Text>
                  </View>
                </View>
                <Recipe ingredients={ingredients} navigation={navigation}/>
              </View>
            }
          />
        </View>
      )}

    </ScreenWrapper>
  )
}

export default Post

const styles = StyleSheet.create({
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  imageIcon: {
    borderRadius: theme.radius.md
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 6
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  }
})


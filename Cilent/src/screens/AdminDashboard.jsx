import { View, StyleSheet, Text, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Loading, ScreenWrapper } from '../components'
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import Icon from '../assets/icons'
import API from '../API';
import { getToken, deleteToken } from '../helpers/common';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image'
import { Button } from '../components';

const Dashboard = ({ navigation }) => {

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [needLoad, setNeedLoad] = useState(true);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setRefreshing(true);

    const token = await getToken();

    const postRespone = await fetch(`${API}/api/CongThuc/getAll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNumber: 1, pageSize: 1, token })
    });

    const postData = await postRespone.json();

    setPosts(postData);
    setPage(2);
    setRefreshing(false);
  };


  const load = async (pageNumber = page) => {
    const token = await getToken();
    const postRespone = await fetch(`${API}/api/CongThuc/getAll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNumber: pageNumber, pageSize: 1, token: token })
    });
    const postData = await postRespone.json();
    if (postData.length == 0) {
      setNeedLoad(false);
    }
    setPosts((prev) => [...prev, ...postData]);
  }

  const handleDelete = async (maCT) => {
    setLoading(true);
    const token = await getToken();
    const respone = await fetch(`${API}/api/CongThuc/deletecongthuc`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token, idCongThuc: maCT })
    })
    if (respone.ok) {
      await reload();
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await deleteToken();
    navigation.navigate("Home")
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header  */}
        <View style={styles.header}>
          <Text style={styles.title}>Foodcipe Admin</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => { navigation.navigate('AddNL') }} >
              <Icon name='plus' size={hp(4)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => handleLogout()} >
              <Icon name='logout' size={hp(4)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Post  */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) =>
            <View style={[cardStyles.container, { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 }]}>
              <View style={cardStyles.header}>
                {/* User and Time  */}
                <Pressable style={cardStyles.userInfo} >
                  <Avatar
                    size={hp(4.5)}
                    uri={item?.tacGia?.anhDaiDien == "image" ? "https://www.htgtrading.co.uk/wp-content/uploads/2016/03/no-user-image-square-250x250.jpg" : item?.tacGia?.anhDaiDien}
                    rounded={theme.radius.md}
                  />
                  <View style={{ gap: 2 }}>
                    <Text style={cardStyles.username}>{item?.tacGia?.tenND}</Text>
                    <Text style={cardStyles.postTime}>{item?.tacGia?.luotTheoDoi} người theo dõi</Text>
                  </View>
                </Pressable>
              </View >

              {/* Body  */}
              <View style={cardStyles.content}>
                <View style={cardStyles.postBody}>
                  {/* Tên món ăn */}
                  <Text style={{ fontWeight: '700', fontSize: hp(1.8), marginBottom: hp(0.5) }}>
                    {item?.tenCT} - {item?.luotToCao} lượt tố cáo
                  </Text>

                  {/* Mô tả */}
                  <Text style={{ fontSize: hp(1.8), color: theme.colors.textDark }}>
                    {item?.moTaCT}
                  </Text>

                  {/* Calo */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: hp(1.8), color: theme.colors.textDark }}>
                      Tổng: {item?.tongCalories} kcal
                    </Text>
                  </View>

                  {/* Danh sách nguyên liệu */}
                  <View style={{ marginTop: hp(1) }}>
                    <Text style={{ fontWeight: '700', fontSize: hp(1.8), marginBottom: hp(0.5) }}>
                      Nguyên liệu:
                    </Text>
                    {item?.nguyenLieus?.map((nguyenLieu, index) => (
                      <View
                        key={index}
                        style={{ flexDirection: 'row', alignItems: 'center', color: theme.colors.textDark }}
                      >
                        <FontAwesome5 name="leaf" size={14} color="#4caf50" />
                        <Text style={{ marginLeft: 8, fontSize: hp(1.8), color: '#444' }}>
                          {nguyenLieu?.tenNL}: {nguyenLieu?.dinhLuong} gram
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Image  */}
              <Image
                source={item?.anhCT}
                transition={100}
                style={cardStyles.postMedia}
                contentFit='cover'
              />

              <Button
                button={{ height: hp(6.2), width: '100%', margin: 'auto' }}
                title="Xóa công thức"
                loading={loading}
                shadow={false}
                press={() => handleDelete(item?.maCT)}
              />

            </View >
          }
          ListFooterComponent={(
            <View style={{ marginVertical: posts.length == 0 ? 200 : 25 }}>
              {needLoad && <Loading />}
            </View>
          )}
          onEndReached={async () => {
            setPage((prev) => prev + 1)
            await load();
          }}
          onRefresh={reload}
          refreshing={refreshing}
          onEndReachedThreshold={0.3}
        />

      </View>
    </ScreenWrapper>
  )
}

export default Dashboard


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.0),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },
  listStyle: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
  }
})

const cardStyles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8)
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  postBody: {
    marginLeft: 5
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous'
  },
  content: {
    gap: 10,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000',
  }
})

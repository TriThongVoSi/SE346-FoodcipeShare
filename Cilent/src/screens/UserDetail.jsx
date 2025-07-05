import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Avatar, ScreenWrapper, Loading, PostCard } from '../components'
import Icon from '../assets/icons'
import Header from '../components/Header'
import { theme } from '../constants/theme'
import { deleteToken, wp, hp } from '../helpers/common'
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../helpers/common'
import API from '../API'



const UserDetail = ({ navigation, route }) => {

  const [userInfo, setUserInfo] = useState({
    maTK: 0,
    anhDaiDien: "",
    diaChi: "",
    gioiTinh: true,
    luotTheoDoi: 0,
    ngaySinh: "",
    sdt: "",
    tenND: "",
    tieuSu: "",
    email: "",
    isFollowed: false
  })

  const [isMe, setIsMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setIsLoading(true);
        const token = await getToken();

        const response = await fetch(`${API}/api/NguoiDung/getoneuserinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, idUser: route.params })
        });
        const userInfo = await response.json();

        const checkIsMe = await fetch(`${API}/api/Account/login/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ AccessToken: token, RefreshToken: token })
        });
        const checkIsMeInfo = await checkIsMe.json();

        if (checkIsMeInfo.email != userInfo.email) {
          const postsRespone = await fetch(`${API}/api/CongThuc/getOneUserAndSharedPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, idUser: route.params })
          })
          const data = await postsRespone.json();
          console.log("POST", data);
          setIsMe(false);
          setPosts(data);
        } else {
          const postsRespone = await fetch(`${API}/api/CongThuc/getallPostandSharedPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(token)
          })
          const data = await postsRespone.json();
          setPosts(data);
        }

        setUserInfo(userInfo);
        setIsLoading(false);
      })();
      return () => { };
    }, [navigation])
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear()
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  const handleFollow = async () => {
    setUserInfo((prev) => { return { ...prev, isFollowed: !prev.isFollowed } });
    const token = await getToken();
    const respone = await fetch(`${API}/api/NguoiDung/followUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, idTaiKhoan: route.params })
    })
  }

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{ marginBottom: 6, marginTop: 4 }}>
          <Header title="Trang cá nhân" navigation={navigation} showBackButton={true} />
        </View>

        {isLoading ? <Loading /> : (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => <PostCard
              key={index}
              item={item}
            />}
            ListHeaderComponent={(
              <View style={styles.container}>
                <View style={{ gap: 15 }}>
                  <View style={styles.avatarContainer}>
                    <Avatar
                      uri={(userInfo.anhDaiDien == "image" || userInfo.anhDaiDien == "") ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : userInfo.anhDaiDien}
                      size={hp(12)}
                      rounded={theme.radius.xxl * 1.4}
                    />
                    {!isMe && (
                      <Pressable style={styles.editIcon} onPress={() => handleFollow()}>
                        <Icon
                          name='heart'
                          strokeWidth={2.5}
                          size={20}
                          fill={userInfo.isFollowed ? theme.colors.rose : 'transparent'}
                          color={userInfo.isFollowed ? theme.colors.rose : theme.colors.textLight}
                        />
                      </Pressable>
                    )}
                  </View>

                  <View style={{ alignItems: 'center', gap: 4 }}>
                    <Text style={styles.userName}>{userInfo.tenND}</Text>
                    <Text style={styles.infoText}>{userInfo.tieuSu}</Text>
                  </View>

                  <View style={{ gap: 10, paddingHorizontal: 30, marginTop: 12 }}>
                    <View style={styles.info}>
                      <Ionicons name="calendar" size={20} color="#666" style={styles.icon} />
                      <Text style={styles.infoText}>
                        {formatDate(userInfo.ngaySinh)}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Icon name='user' size={20} color={theme.colors.textLight} />
                      <Text style={styles.infoText}>
                        {userInfo.gioiTinh ? "Nam" : "Nữ"}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Icon name='mail' size={20} color={theme.colors.textLight} />
                      <Text style={styles.infoText}>
                        {userInfo.email}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Icon name='call' size={20} color={theme.colors.textLight} />
                      <Text style={styles.infoText}>
                        {userInfo.sdt}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Icon name='location' size={20} color={theme.colors.textLight} />
                      <Text style={styles.infoText}>
                        {userInfo.diaChi}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Icon name='share' size={20} color={theme.colors.textLight} />
                      <Text style={styles.infoText}>
                        {userInfo.luotTheoDoi} người theo dõi
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        )}


      </View>
    </ScreenWrapper>
  )
}

export default UserDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    marginBottom: 12
  },
  logoutButton: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    padding: 16,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    right: 22,
    top: -2.5,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  headerShape: {
    width: wp(100),
    height: hp(20)
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 4
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  }
})
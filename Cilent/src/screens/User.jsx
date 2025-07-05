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



const User = ({ navigation }) => {

  const [userInfo, setUserInfo] = useState({
    anhDaiDien: "",
    diaChi: "",
    gioiTinh: true,
    luotTheoDoi: 0,
    ngaySinh: "",
    sdt: "",
    tenND: "",
    tieuSu: "",
    email: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  const handleLogout = async () => {
    deleteToken();
    navigation.navigate('Home')
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${API}/api/Account/getuserinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        });
        const userInfo = await response.json();

        const postsRespone = await fetch(`${API}/api/CongThuc/getallPostandSharedPost`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        })
        const data = await postsRespone.json();
        setPosts(data);

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

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{ marginBottom: 6, marginTop: 4 }}>
          <Header title="Trang cá nhân" navigation={navigation} showBackButton={true} />
          <TouchableOpacity onPress={() => handleLogout()} style={[styles.logoutButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)', position: 'absolute', right: 20, top: -3 }]}>
            <Icon name='logout' strokeWidth={2.5} size={24} color={theme.colors.rose} />
          </TouchableOpacity>
        </View>

        {isLoading ? <Loading /> : (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <PostCard
              key={item.id}
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
                    <Pressable style={styles.editIcon} onPress={() => { navigation.navigate('EditProfile') }}>
                      <Icon
                        name='edit'
                        strokeWidth={2.5}
                        size={20}
                      />
                    </Pressable>
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

export default User

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
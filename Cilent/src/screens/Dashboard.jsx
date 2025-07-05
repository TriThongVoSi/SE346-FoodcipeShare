import { View, StyleSheet, Text, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Loading, ScreenWrapper } from '../components'
import { useFocusEffect } from '@react-navigation/native';
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import Icon from '../assets/icons'
import PostCard from '../components/PostCard';
import API from '../API';
import { getToken } from '../helpers/common';


const Dashboard = ({ navigation }) => {


  const [user, setUser] = useState({
    anhDaiDien: ""
  });
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [needLoad, setNeedLoad] = useState(true);

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

  const getUserInfo = async () => {
    const token = await getToken();
    const response = await fetch(`${API}/api/Account/getuserinfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(token)
    });
    const userInfo = await response.json();
    setUser(userInfo);
  }

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

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await getUserInfo();
      })();
      return () => { };
    }, [navigation])
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header  */}
        <View style={styles.header}>
          <Text style={styles.title}>Foodcipe</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => { navigation.navigate('Search') }} >
              <Icon name='search' size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Notification') }} >
              <Icon name='heart' size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Post') }}>
              <Icon name='plus' size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('User') }}>
              <Avatar
                uri={(user.anhDaiDien == "image" || user.anhDaiDien == "") ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : user.anhDaiDien}
                size={hp(3.1)}
                rounded={theme.radius.xs}
                styles={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Post  */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => <PostCard
            key={index}
            item={item}
          />}
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

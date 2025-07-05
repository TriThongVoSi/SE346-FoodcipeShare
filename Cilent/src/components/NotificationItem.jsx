import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Avatar from './Avatar'
import API from '../API'
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../helpers/common'

const NotificationItem = ({ item, navigation }) => {

  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [postData, setPostData] = useState();

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const token = await getToken();
        if (item?.maCT != 0) {
          const response = await fetch(`${API}/api/CongThuc/getDetailedPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, idCongThuc: item?.maBaiViet })
          });
          const data = await response.json();
          setPostData(data.post)
          setImg(data.post.anhCT);
          setTitle(data.post.tenCT);
        }
      })();
      return () => { };
    }, [navigation])
  );

  const openPost = async () => {
    const token = await getToken();
    const response = fetch(`${API}/api/NguoiDung/seenOnePost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, idNoti: item?.maTB })
    })
      navigation.navigate('PostDetail', postData)
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => openPost()}>

      <Avatar
        uri={img}
        size={hp(5)}
      />

      <View style={styles.nameTitle}>
        <Text style={styles.text}>
          {
            title
          }
        </Text>
        <Text style={[styles.text, { color: item?.daXem ? theme.colors.textLight : theme.colors.textDark }]}>
          {
            item?.noiDung
          }
        </Text>
      </View>

      <Text style={[styles.text, { color: theme.colors.textLight }]}>
        {
          item?.createAt
        }
      </Text>

    </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous'
  },
  nameTitle: {
    flex: 1,
    gap: 2
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  }
})
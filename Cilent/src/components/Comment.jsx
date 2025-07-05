import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import { getToken, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import Icon from '../assets/icons'
import API from '../API'

const Comment = ({ item, canDelete = true, reload }) => {

  function formatDay(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleDelete = async () => {
    Alert.alert(
      'Xóa bình luận',
      'Xác nhận xóa bình luận?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const token = await getToken();
            const respone = await fetch(`${API}/api/CongThuc/deleteComment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: token, maComment: item?.maComment, canDelete: item?.canDeleted })
            })
            if (respone.ok) {
              await reload();
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Avatar
        size={hp(4.5)}
        uri={item?.tacgia?.anhDaiDien == "image" ? "https://www.htgtrading.co.uk/wp-content/uploads/2016/03/no-user-image-square-250x250.jpg" : item?.tacgia?.anhDaiDien}
        rounded={theme.radius.md}
      />
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.tacgia?.tenND}</Text>
            <Text> • </Text>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>{formatDay(item?.ngayBinhLuan)}</Text>
          </View>

          {item?.canDeleted && (
            <TouchableOpacity onPress={() => handleDelete()}>
              <Icon name='delete' size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}

        </View>
        <Text style={[styles.text, { fontWeight: 'normal' }]}>{item?.noiDung}</Text>
      </View>
    </View>
  )
}

export default Comment

const styles = StyleSheet.create({
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  highLight: {
    borderWidth: 0.2,
    backgroundColor: 'white',
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 7
  }
})
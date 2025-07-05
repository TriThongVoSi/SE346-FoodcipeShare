import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { Header, Loading, NotificationItem, ScreenWrapper } from '../components'
import API from '../API'
import { useFocusEffect } from '@react-navigation/native';
import { getToken } from '../helpers/common'

const Notification = ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${API}/api/NguoiDung/getAllThongBao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token)
        });
        const data = await response.json();

        setNotification(data);
        setIsLoading(false);
      })();
      return () => { };
    }, [navigation])
  );

  return (
    <ScreenWrapper>
      <Header showBackButton={true} navigation={navigation} title="Thông báo" />
      {loading ? (<Loading />) : (<View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {
            notification.map((item, index) => (
              <NotificationItem
                item={item}
                key={index}
                navigation={navigation}
              />
            ))
          }
          {
            notification.length == 0 && (
              <Text style={styles.noData}> Chưa có thông báo.</Text>
            )
          }
        </ScrollView>
      </View>)}
    </ScreenWrapper>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center'
  }
})
import React from 'react';
import { Image, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import { Button, ScreenWrapper } from '../components';
import { getToken } from '../helpers/common';
import API from '../API';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const token = await getToken();
        const response = await fetch(`${API}/api/Account/login/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ AccessToken: token, RefreshToken: token })
        });
        if (response.status === 200) {
          const decoded = parseJwt(token);
          const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          console.log(role);
          
          if (role == "Admin") {
            navigation.navigate('Admin')
          } else {
            navigation.navigate('Dashboard')
          }
        }
      })();
      return () => { };
    }, [navigation])
  );

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Ảnh chào mừng */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require('../assets/images/welcome.png')}
        />
        {/* Tiêu đề chào mừng */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Foodcipe</Text>
          <Text style={styles.subtitleText}>
            Nơi khám phá và chia sẻ những công thức món ăn tuyệt vời. Với các gợi ý món ăn, chúng tôi giúp bạn tìm kiếm những món ăn mới dựa trên sở thích của bạn.
          </Text>
        </View>

        {/* Phần chân trang */}
        <View style={styles.footer}>
          <Button
            button={{ marginHorizontal: wp(3) }}
            text={{ marginHorizontal: wp(3) }}
            title="Bắt đầu ngay"
            press={() => navigation.navigate('SignUp')}
            loading={false}
            shadow={true}
          />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Bạn đã có tài khoản?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  welcomeImage: {
    height: hp(40),
    width: wp(90),
    alignSelf: 'center'
  },
  titleContainer: {
    alignItems: 'center'
  },
  titleText: {
    color: theme.colors.text,
    fontSize: hp(4),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp(1)
  },
  subtitleText: {
    color: theme.colors.text,
    paddingHorizontal: wp(6),
    fontSize: hp(1.8),
    textAlign: 'center'
  },
  footer: {
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1.5)
  },
  loginText: {
    color: theme.colors.text,
    fontSize: hp(1.7),
    textAlign: 'center'
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: hp(1.7),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: wp(5)
  }
});

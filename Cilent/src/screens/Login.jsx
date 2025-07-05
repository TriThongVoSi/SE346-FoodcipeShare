import { Alert, View, Text, Pressable, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Button, ScreenWrapper } from '../components'
import { theme } from '../constants/theme'
import { deleteToken, hp, wp } from '../helpers/common'
import API from '../API'

import React, { useState } from 'react'
import Icon from '../assets/icons'
import Input from '../components/Input'
import { saveToken } from '../helpers/common'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleLogin = async () => {
    setLoading(true)
    if (!email || !password) {
      Alert.alert('Đăng nhập', 'Vui lòng điền đầy đủ thông tin!')
      setLoading(false)
      return
    }
    try {
      const respone = await fetch(`${API}/api/Account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      if (respone.status !== 200) throw new Error('Đăng nhập thất bại!');
      const data = await respone.text();
      await deleteToken();
      await saveToken(data)
      const decoded = parseJwt(data);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role == "Admin") {
        navigation.navigate('Admin')
      } else {
        navigation.navigate('Dashboard')
      }
    } catch (error) {
      Alert.alert('Đăng nhập', error.message)
    }
    setLoading(false);
  }

  return (
    <ScreenWrapper bg="white">
      <StatusBar style='dark' />
      <Pressable onPress={() => navigation.navigate('Home')} style={[styles.backButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)' }]}>
        <Icon name='arrowLeft' strokeWidth={2.5} size={22} color={theme.colors.text} />
      </Pressable>
      <View style={styles.container}>
        {/* Chào mừng */}
        <View >
          <Text style={styles.welcomeText} >Chào mừng trở lại</Text>
          <Text style={styles.welcomeText} >Đăng nhập</Text>
        </View>

        {/* Form đăng nhập */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Vui lòng điền thông tin để đăng nhập
          </Text>
          <Input
            icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
            placeholder="Nhập email của bạn"
            onChangeText={(text) => setEmail(text)}
            keyboardType='email-address'
          />
          <Input
            icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
            placeholder="Nhập mật khẩu của bạn"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text onPress={() => navigation.navigate('ForgotPass')} style={styles.forgotPassword} >Quên mật khẩu?</Text>
          </View>
          <Button loading={loading} title={'Đăng nhập'} press={handleLogin} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bạn chưa có tài khoản?
          </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Đăng ký</Text>
          </Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    padding: 16,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
    marginTop: hp(5)
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text
  },
  form: {
    gap: 25
  },
  forgotPassword: {
    textAlign: 'right',
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
    paddingHorizontal: 4
  }
});

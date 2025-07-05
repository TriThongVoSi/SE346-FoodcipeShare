import React, { useState } from 'react';
import { Alert, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, ScreenWrapper } from '../components';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Icon from '../assets/icons';
import Input from '../components/Input';

export default function ForgotPass({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            Alert.alert('Đổi mật khẩu', 'Vui lòng điền email!');
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            Alert.alert('Đổi mật khẩu', 'Email không hợp lệ!');
            setLoading(false);
            return;
        }

        navigation.navigate('ChangePass', { email });
    };


    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <Pressable onPress={() => navigation.navigate('Home')} style={[styles.backButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                <Icon name="arrowLeft" strokeWidth={2.5} size={22} color={theme.colors.text} />
            </Pressable>
            <View style={styles.container}>
                {/* Chào mừng */}
                <View>
                    <Text style={styles.welcomeText}>Quên mật khẩu</Text>
                </View>

                {/* Form đăng ký */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Vui lòng điền email của bạn
                    </Text>
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Nhập email của bạn"
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <Button loading={loading} title={'Tiếp tục'} press={handleLogin} />
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
        marginTop: hp(5),
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: 24,
        padding: 16,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
        paddingHorizontal: 4,
    },
});

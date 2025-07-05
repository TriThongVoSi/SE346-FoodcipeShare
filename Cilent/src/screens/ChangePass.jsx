import React, { useState, useEffect, use } from 'react';
import { Alert, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, ScreenWrapper } from '../components';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Icon from '../assets/icons';
import Input from '../components/Input';
import API from '../API';
import { useFocusEffect } from '@react-navigation/native';

export default function ChangePass({ route, navigation }) {
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMail = async () => {
        const response = await fetch(`${API}/api/Account/forgotPass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            Alert.alert('Thông báo', 'Email chưa được đăng ký');
            return;
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            sendMail();
            return () => {
                console.log('Clean up when screen is unfocused');
            };
        }, [])
    )

    const handleOTP = async () => {
        setLoading(true);
        if (!code || !password || !confirmPassword) {
            Alert.alert('Đổi mật khẩu', 'Vui lòng điền đầy đủ thông tin!');
            setLoading(false);
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            Alert.alert('Đổi mật khẩu', 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!');
            setLoading(false);
            return;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Đổi mật khẩu', 'Mật khẩu không khớp!');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API}/api/Account/forgotPass/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, resetCode: code, newPassword: password })
            });
            if (response.status !== 200) throw new Error('Mã OTP không chính xác');
            Alert.alert('Đổi mật khẩu', 'Đổi mật khẩu thành công');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Đổi mật khẩu', error.message);
        }
        setLoading(false);
    }

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <Pressable onPress={() => navigation.navigate('Home')} style={[styles.backButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                <Icon name="arrowLeft" strokeWidth={2.5} size={22} color={theme.colors.text} />
            </Pressable>
            <View style={styles.container}>
                <View>
                    <Text style={styles.welcomeText}>Quên mật khẩu</Text>
                </View>

                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Xác nhận OTP đã gởi về email và nhập mật khẩu mới
                    </Text>
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Nhập mã OTP"
                        onChangeText={(text) => setCode(text)}
                    />
                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Nhập mật khẩu của bạn"
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />
                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Xác nhận mật khẩu"
                        onChangeText={(text) => setConfirmPassword(text)}
                        secureTextEntry={true}
                    />
                    <Button loading={loading} title={'Xác nhận'} press={handleOTP} />
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

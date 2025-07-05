import React, { useState } from 'react';
import { Alert, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, ScreenWrapper } from '../components';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Icon from '../assets/icons';
import Input from '../components/Input';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!email || !password || !confirmPassword) {
            Alert.alert('Đăng ký', 'Vui lòng điền đầy đủ các trường thông tin!');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Đăng ký', 'Mật khẩu không khớp!');
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            Alert.alert('Đăng ký', 'Email không hợp lệ!');
            setLoading(false);
            return;
        }

        if (!passwordRegex.test(password)) {
            Alert.alert(
                'Đăng ký',
                'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!'
            );
            setLoading(false);
            return;
        }
        
        navigation.navigate('OTP', { email, password, confirmPassword });
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
                    <Text style={styles.welcomeText}>Chào mừng</Text>
                    <Text style={styles.welcomeText}>Bắt đầu ngay</Text>
                </View>

                {/* Form đăng ký */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Vui lòng điền đầy đủ thông tin để tạo tài khoản
                    </Text>
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Nhập email của bạn"
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
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
                    <Button loading={loading} title={'Đăng ký'} press={handleLogin} />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bạn đã có tài khoản?</Text>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Đăng nhập</Text>
                    </Pressable>
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

import React, { useEffect, useState } from 'react';
import { Alert, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, ScreenWrapper } from '../components';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Icon from '../assets/icons';
import Input from '../components/Input';
import { useFocusEffect } from '@react-navigation/native';

export default function OTP({ navigation, route }) {
    const { email, password, confirmPassword } = route.params;
    const [OTP, setOTP] = useState('');
    const [loading, setLoading] = useState(false);

    const sendOTP = async () => {
        const response = await fetch(`${API}/api/Account/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, confirmPassword })
        });
        if (!response.ok) {
            Alert.alert('Xác thực OTP', 'Email đã được đăng kí vui lòng đăng nhập!');
            navigation.navigate('Login');
            return;
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            sendOTP();
            return () => {
                console.log('Clean up when screen is unfocused');
            };
        }, [])
    )

    const handleCheckOTP = async () => {
        setLoading(true);
        if (!OTP) {
            Alert.alert('Xác thực OTP', 'Vui lòng nhập mã OTP!');
            setLoading(false);
            return;
        }

        const response = await fetch(`${API}/api/Account/signup/otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: OTP })
        });

        console.log(response);
        setLoading(false);

        if (response.ok) {
            Alert.alert('Xác thực OTP', 'Xác thực thành công, đăng nhập để tiếp tục!');
            navigation.navigate('Login');
        } else {
            Alert.alert('Xác thực OTP', data.message || 'Sai OTP!');
        }
    }

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <Pressable onPress={() => navigation.navigate('Home')} style={[styles.backButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                <Icon name="arrowLeft" strokeWidth={2.5} size={22} color={theme.colors.text} />
            </Pressable>
            <View style={styles.container}>
                <View>
                    <Text style={styles.welcomeText}>Xác thực OTP</Text>
                </View>

                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Nhập mã OTP được gởi đến email của bạn
                    </Text>
                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Mã OTP"
                        onChangeText={(text) => setOTP(text)}
                    />
                    <Button loading={loading} title={'Xác nhận'} press={handleCheckOTP} />
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

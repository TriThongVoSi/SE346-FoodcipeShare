import { StyleSheet, Text, TouchableOpacity, View, Alert, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react'
import { theme } from '../constants/theme'
import { getToken, hp } from '../helpers/common'
import Avatar from './Avatar'
import Icon from '../assets/icons'
import { useNavigation } from '@react-navigation/native';
import API from '../API'
import Feather from '@expo/vector-icons/Feather';

const PostCard = ({ item, hasShadow = true }) => {
    const navigation = useNavigation();

    const [liked, setLiked] = useState(item?.isLiked);
    const [luotLike, setLuotLike] = useState(item?.luotThich)
    const [luotShare, setLuotShare] = useState(item?.luotShare)
    const [reported, setReported] = useState(item?.isReported);
    const [luotToCao, setLuotToCao] = useState(item?.luotToCao)

    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }

    const openPost = async () => {
        navigation.navigate('PostDetail', item)
    }

    const handleLike = async () => {
        const token = await getToken();
        if (!liked) {
            setLuotLike((prev) => prev + 1);
        } else {
            setLuotLike((prev) => prev - 1);
        }
        setLiked(!liked);
        const respone = await fetch(`${API}/api/CongThuc/LikePost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, idCongThuc: item?.maCT })
        })
    }

    const handleShare = async () => {
        Alert.alert(
            'Chia sẻ',
            'Bạn có muốn chia sẻ nội dung này lên trang cá nhân không?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const token = await getToken();
                        const respone = await fetch(`${API}/api/CongThuc/ShareCongthuc`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: token, idCongThuc: item?.maCT })
                        })
                        if (respone.ok) {
                            setLuotShare((prev) => prev + 1)
                        }
                    },
                },
            ]
        );
    }

    const handleReport = async () => {
        const token = await getToken();
        if (reported) {
            setLuotToCao((prev) => prev - 1)
        } else {
            setLuotToCao((prev) => prev + 1)
        }
        setReported(!reported);
        const respone = await fetch(`${API}/api/CongThuc/reportCongthuc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, idCongThuc: item?.maCT })
        })
    }

    return (
        <View style={[styles.container, hasShadow && shadowStyles]}>
            <View style={styles.header}>
                {/* User and Time  */}
                <Pressable style={styles.userInfo} onPress={() => navigation.navigate("UserDetail", item?.tacGia?.maTK)} >
                    <Avatar
                        size={hp(4.5)}
                        uri={item?.tacGia?.anhDaiDien == "image" ? "https://www.htgtrading.co.uk/wp-content/uploads/2016/03/no-user-image-square-250x250.jpg" : item?.tacGia?.anhDaiDien}
                        rounded={theme.radius.md}
                    />
                    <View style={{ gap: 2 }}>
                        <Text style={styles.username}>{item?.tacGia?.tenND}</Text>
                        <Text style={styles.postTime}>{item?.tacGia?.luotTheoDoi} người theo dõi</Text>
                    </View>
                </Pressable>

                <TouchableOpacity onPress={openPost}>
                    <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            </View >

            {/* Body  */}
            <View style={styles.content}>
                <View style={styles.postBody}>
                    {/* Tên món ăn */}
                    <Text style={{ fontWeight: '700', fontSize: hp(1.8), marginBottom: hp(0.5) }}>
                        {item?.tenCT}
                    </Text>

                    {/* Mô tả */}
                    <Text style={{ fontSize: hp(1.8), color: theme.colors.textDark }}>
                        {item?.moTaCT}
                    </Text>

                    {/* Calo */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: hp(1.8), color: theme.colors.textDark }}>
                            Tổng: {item?.tongCalories} kcal
                        </Text>
                    </View>

                    {/* Danh sách nguyên liệu */}
                    <View style={{ marginTop: hp(1) }}>
                        <Text style={{ fontWeight: '700', fontSize: hp(1.8), marginBottom: hp(0.5) }}>
                            Nguyên liệu:
                        </Text>
                        {item?.nguyenLieus?.map((nguyenLieu, index) => (
                            <View
                                key={index}
                                style={{ flexDirection: 'row', alignItems: 'center', color: theme.colors.textDark }}
                            >
                                <FontAwesome5 name="leaf" size={14} color="#4caf50" />
                                <Text style={{ marginLeft: 8, fontSize: hp(1.8), color: '#444' }}>
                                    {nguyenLieu?.tenNL}: {nguyenLieu?.dinhLuong} gram
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Image  */}
            <Image
                source={item?.anhCT}
                transition={100}
                style={styles.postMedia}
                contentFit='cover'
            />

            {/* Like comment share  */}
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={() => handleLike()}>
                        <Icon name='heart' size={24} fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{luotLike}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={openPost}>
                        <Icon name='comment' size={24} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{item.luotComment}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={() => handleShare()}>
                        <Icon name='share' size={24} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{luotShare}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={() => handleReport()}>
                        <Feather name='alert-triangle' size={24} color={reported ? "red" : theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{luotToCao}</Text>
                </View>
            </View>
        </View >
    )
}

export default PostCard

const styles = StyleSheet.create({
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    postBody: {
        marginLeft: 5
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous'
    },
    content: {
        gap: 10,
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    }
})
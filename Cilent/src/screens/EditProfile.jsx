import { FlatList, StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { getToken, hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { Button, DatePick, ScreenWrapper } from '../components'
import Header from '../components/Header'
import Avatar from '../components/Avatar'
import Icon from '../assets/icons'
import Input from '../components/Input'
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker'
import API from '../API'
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../components'

const currentYear = new Date().getFullYear();

const EditProfile = ({ navigation }) => {

    const [profile, setProfile] = useState({
        img: null,
        name: "",
        date: 1,
        month: 1,
        year: currentYear,
        phone: "",
        address: "",
        bio: ""
    });
    const [isLoading, setIsLoading] = useState(false)



    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Nam', value: true },
        { label: 'Nữ', value: false },
    ]);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setIsLoading(true);
                const token = await getToken();
                const response = await fetch(`${API}/api/Account/getuserinfo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(token)
                });
                const userInfo = await response.json();
                const date = new Date(userInfo.ngaySinh);

                setProfile({
                    img: userInfo.anhDaiDien,
                    name: userInfo.tenND,
                    date: date.getDate() - 1,
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    phone: userInfo.sdt,
                    address: userInfo.diaChi,
                    bio: userInfo.tieuSu
                })
                const gioiTinh = (userInfo.gioiTinh == true) ? true : false;
                setGender(gioiTinh);
                setIsLoading(false);
            })();
            return () => { };
        }, [navigation])
    );

    const pickImage = async () => {
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.7,
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
        if (!result.canceled) {
            setProfile(prevProfile => ({ ...prevProfile, img: result.assets[0].uri }))
        }
    }

    const uploadImage = async () => {
        const uri = profile.img;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        const formData = new FormData();
        formData.append('image', { uri, name: filename, type });

        try {
            const res = await fetch(`${API}/api/Image/Upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const json = await res.json();
            return json;
        } catch (err) {
            console.error(err);
            alert('Upload thất bại!');
        }
    }

    function checkAgeAndUpdate(year, month, date) {
        const birthday = new Date(year, month - 1, date);

        const currentDate = new Date();

        let age = currentDate.getFullYear() - birthday.getFullYear();
        const monthDifference = currentDate.getMonth() - birthday.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthday.getDate())) {
            age--;
        }

        if (age < 16) {
            return false;
        } else {
            return true;
        }
    }

    const onSubmit = async () => {
        setLoading(true);
        try {

            const token = await getToken();
            const { name, date, month, year, phone, address, bio, img } = profile;

            if (!name || !phone || !address || !bio || !img ) {
                Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
                setLoading(false);
                return;
            }

            const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

            if (!phoneRegex.test(phone)) {
                Alert.alert("Thông báo", "Số điện thoại không hợp lệ!");
                setLoading(false);
                return;
            }

            if (!checkAgeAndUpdate(year, month, date)) {
                Alert.alert("Thông báo", "Bạn chưa đủ 16 tuổi, không thể sử dụng app.");
                setLoading(false);
                return;
            }

            const birthday = new Date(year, month - 1, date + 1);
            
            if (profile.img) {
                const res = await uploadImage();
                setProfile(prevProfile => ({ ...prevProfile, img: res.url }))
                const respone = await fetch(`${API}/api/Account/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token, avatar: res.url, tenND: name, ngaySinh: birthday, sdt: phone, diaChi: address, tieuSu: bio, gioiTinh: gender })
                })

                if (respone.ok) {
                    Alert.alert("Cập nhật", "Cập nhật thành công!");
                }
            } else {
                setProfile(prevProfile => ({ ...prevProfile, img: "" }))
                const respone = await fetch(`${API}/api/Account/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token, avatar: profile.img, tenND: name, ngaySinh: birthday, sdt: phone, diaChi: address, tieuSu: bio, gioiTinh: gender })
                })

                if (respone.ok) {
                    Alert.alert("Cập nhật", "Cập nhật thành công!");
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Thông báo", "Cập nhật thất bại!");
        }
        setLoading(false);
    }

    return (
        <ScreenWrapper bg="white">
            <View style={{ marginTop: 4 }} >
                <Header title="Cập nhật hồ sơ" navigation={navigation} showBackButton={true} />
            </View>
            {!isLoading && (
                <FlatList
                    data={[{ key: 'form' }]}
                    keyExtractor={(item) => item.key}
                    renderItem={() => (
                        <View style={styles.form}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    uri={profile.img ? profile.img : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    size={hp(12)}
                                    rounded={theme.radius.xxl * 1.4}
                                />
                                <Pressable style={styles.editIcon} onPress={pickImage}>
                                    <Icon name='camera' strokeWidth={2.5} size={20} />
                                </Pressable>
                            </View>

                            <Text style={{ fontSize: hp(1.5), color: theme.colors.text, textAlign: 'center' }}>
                                Please fill your profile details
                            </Text>

                            <Input
                                icon={<Icon name='user' />}
                                placeholder='Enter your name'
                                value={profile.name}
                                onChangeText={value => setProfile(prevProfile => ({ ...prevProfile, name: value }))}
                            />

                            <DatePick
                                day={profile.date}
                                month={profile.month}
                                year={profile.year}
                                setDay={(value) => setProfile(prevProfile => ({ ...prevProfile, date: value }))}
                                setMonth={(value) => setProfile(prevProfile => ({ ...prevProfile, month: value }))}
                                setYear={(value) => setProfile(prevProfile => ({ ...prevProfile, year: value }))}
                            />

                            <DropDownPicker
                                multiple={false}
                                open={open}
                                value={gender}
                                items={items}
                                setOpen={setOpen}
                                setValue={setGender}
                                setItems={setItems}
                                style={styles.dateInput}
                                textStyle={{ marginLeft: 8 }}
                                placeholder='Select your gender'
                                placeholderStyle={{ color: theme.colors.textLight, marginLeft: 8 }}
                            />

                            <Input
                                icon={<Icon name='call' />}
                                placeholder='Enter your phone number'
                                value={profile.phone}
                                onChangeText={value => setProfile(prevProfile => ({ ...prevProfile, phone: value }))}
                            />

                            <Input
                                icon={<Icon name='location' />}
                                placeholder='Enter your address'
                                value={profile.address}
                                onChangeText={value => setProfile(prevProfile => ({ ...prevProfile, address: value }))}
                            />

                            <Input
                                placeholder='Enter your bio'
                                value={profile.bio}
                                multiline={true}
                                containerStyle={styles.bio}
                                onChangeText={value => setProfile(prevProfile => ({ ...prevProfile, bio: value }))}
                            />

                            <Button title={"Cập nhật"} loading={loading} press={onSubmit} />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

        </ScreenWrapper>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    bio: {
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15
    },
    input: {
        gap: 10,
        marginTop: 20
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 0,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    container: {
        flex: 1,
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center'
    },
    form: {
        gap: 12,
        marginTop: 20,
        paddingHorizontal: wp(4),
        paddingBottom: 12
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    dateInput: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 12,
        gap: 12,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        marginLeft: 6
    },
    icon: {
        marginLeft: 8,
    },
})
import { Dimensions } from "react-native";
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
import * as SecureStore from 'expo-secure-store';

export const hp = (percent) => {
    return percent * deviceHeight / 100;
}

export const wp = (percent) => {
    return percent * deviceWidth / 100;
}

export const saveToken = async (token) => {
    try {
        await SecureStore.setItemAsync('jwtToken', token);
    } catch (error) {
        console.error('Lỗi khi lưu token:', error);
    }
};

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('jwtToken');
        return token;
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
    }
};

export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync('jwtToken');
    } catch (error) {
        console.error('Lỗi khi xóa token:', error);
    }
};

export const formatDate = (date) => {
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
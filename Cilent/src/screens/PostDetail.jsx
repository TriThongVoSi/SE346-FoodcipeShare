import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { getToken, hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import { Comment, Loading, ScreenWrapper } from '../components';
import Input from '../components/Input';
import Icon from '../assets/icons'
import { Avatar } from '../components';
import { useFocusEffect } from '@react-navigation/native';
import API from '../API';
import { FontAwesome5 } from '@expo/vector-icons';
import { GoogleGenAI } from "@google/genai";
//AI kiểm duyệt bình luận
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const PostDetail = ({ route, navigation }) => {
  const item = route.params;

  const [comments, setComment] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadComment = async () => {
    const token = await getToken();

    const respone = await fetch(`${API}/api/CongThuc/getComment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, idCongThuc: item?.maCT })
    })
    const data = await respone.json();

    setComment(data);
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await loadComment();
      })();
      return () => { };
    }, [navigation])
  );

  const sendComment = async () => {
    setIsLoading(true);
    const token = await getToken();
    if (commentContent == "") {
      Alert.alert("Bình luận", "Vui lòng nhập nội dung bình luận");
      setIsLoading(false);
      return;
    }

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Bạn là một hệ thống kiểm duyệt nội dung bình luận. Nhiệm vụ của bạn là phân tích đoạn văn bản sau và cho biết liệu nội dung đó có phù hợp để hiển thị công khai hay không.

**Tiêu chí kiểm duyệt:**
1. Không chứa từ ngữ thô tục, chửi bậy, tục tĩu.
2. Không xúc phạm, miệt thị cá nhân, tổ chức, dân tộc, giới tính, tôn giáo,...
3. Không liên quan đến các vấn đề nhạy cảm như chính trị, phân biệt chủng tộc, kỳ thị giới tính, bạo lực, tự tử,...
4. Không vi phạm thuần phong mỹ tục, đạo đức xã hội hoặc khuyến khích hành vi lệch chuẩn.
5. Không có nội dung mang tính khiêu dâm, phản cảm.

**Yêu cầu phản hồi:**
- Nếu **bình luận hợp lệ**, hãy trả lời: 1
- Nếu **bình luận vi phạm**, hãy trả lời: 0

**Nội dung cần kiểm duyệt:**
${commentContent}
`,
    });
    if (Number(geminiResponse.text) == 1) {
      const respone = await fetch(`${API}/api/CongThuc/CommentPost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ like_share: { token: token, idCongThuc: item?.maCT }, comment: commentContent })
      })

      if (respone.ok) {
        await loadComment();
        setCommentContent("");
        setIsLoading(false);
      }
    } else {
      Alert.alert("Bình luận", "Bình luận vi phạm tiêu chuẩn cộng đồng!");
      setCommentContent("");
      setIsLoading(false);
    }

  }

  return (
    <ScreenWrapper >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <View style={[styles.container]}>
          <View style={styles.header}>
            {/* User and Time  */}
            <View style={styles.userInfo}>
              <Avatar
                size={hp(4.5)}
                uri={item?.tacGia?.anhDaiDien == "image" ? "https://www.htgtrading.co.uk/wp-content/uploads/2016/03/no-user-image-square-250x250.jpg" : item?.tacGia?.anhDaiDien}
                rounded={theme.radius.md}
              />
              <View style={{ gap: 2 }}>
                <Text style={styles.username}>{item?.tacGia?.tenND}</Text>
                <Text style={styles.postTime}>{item?.tacGia?.luotTheoDoi} người theo dõi</Text>
              </View>
            </View>
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

        </View >

        <View style={styles.inputContainer}>
          <Input
            placeholder="Type comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl, borderWidth: 0.75 }}
            value={commentContent}
            onChangeText={(value) => setCommentContent(value)}
          />
          {isLoading ? <Loading /> :
            (<TouchableOpacity style={styles.sendIcon} onPress={sendComment}>
              <Icon name='send' color={theme.colors.primaryDark} />
            </TouchableOpacity>)}
        </View>

        {/* Comment List  */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {
            comments?.map((comment, index) => <Comment key={index} item={comment} reload={() => loadComment()} />)
          }
          {
            comments.length == 0 &&
            (
              <Text style={{ color: theme.colors.text, marginTop: 15, textAlign: 'center' }}>
                Hãy là người bình luận đầu tiên !
              </Text>
            )
          }
        </View>
      </ScrollView>
    </ScreenWrapper >
  )
}

export default PostDetail

const styles = StyleSheet.create({
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }],
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8)
  },
  list: {
    paddingHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(10),
    marginTop: 30
  },
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
    gap: 15
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
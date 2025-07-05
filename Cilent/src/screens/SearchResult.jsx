import { StyleSheet, FlatList, View, Text } from 'react-native'
import React from 'react'
import { ScreenWrapper, Header, Loading, PostCard } from '../components'
import { hp, wp } from '../helpers/common'



const SearchResult = ({ route, navigation }) => {
  const item = route.params;

  return (
    <ScreenWrapper>
      <View >
        <Header title="Kết quả tìm kiếm" navigation={navigation} showBackButton={true} />
      </View>
      {item?.length == 0 ? (<Text>Không tìm thấy công thức</Text>) : (
        <FlatList
          data={item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => <PostCard
            item={item}
          />}
        />)}
    </ScreenWrapper>
  )
}

export default SearchResult

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
})

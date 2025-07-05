import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ScreenWrapper = ({ children, bg }) => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bg, height: '100%', paddingTop: 12 }}>
            {
                children
            }
        </SafeAreaView>
    )
}

export default ScreenWrapper
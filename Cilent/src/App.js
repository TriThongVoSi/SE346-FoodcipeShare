import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, SignUp, Login, Dashboard, User, Notification, Post, EditProfile, PostDetail, Search, SearchResult, ForgotPass, OTP, ChangePass, UserDetail, AdminDashboard, AddNguyenLieu } from './screens';

const Stack = createNativeStackNavigator();

const Welcome = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{ presentation: "modal", headerShown: false }} >
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminDashboard} options={{ headerShown: false }} />
          <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
          <Stack.Screen name="Post" component={Post} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
          <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }} />
          <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePass" component={ChangePass} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: false }} />
          <Stack.Screen name="AddNL" component={AddNguyenLieu} options={{ headerShown: false }} />
          <Stack.Screen
            name="PostDetail"
            component={PostDetail}
            options={{
              presentation: 'modal', 
              headerShown: false, 
              fullScreenGestureEnabled: true, 
              gestureDirection: 'vertical', 
              animation: 'slide_from_bottom', 
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Welcome;

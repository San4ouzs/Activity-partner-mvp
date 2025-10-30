
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import ActivityScreen from "./src/screens/ActivityScreen";
import MatchScreen from "./src/screens/MatchScreen";
import ChatScreen from "./src/screens/ChatScreen";

export type RootStackParamList = {
  Login: undefined;
  Activities: undefined;
  Matches: undefined;
  Chat: { conversationId: string; peerName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Sign in" }} />
        <Stack.Screen name="Activities" component={ActivityScreen} options={{ title: "Your Profile" }} />
        <Stack.Screen name="Matches" component={MatchScreen} options={{ title: "Nearby Partners" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.peerName })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api, setToken } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<"login"|"register">("login");

  const onSubmit = async () => {
    try {
      let resp;
      if (mode === "login") {
        resp = await api.login(email, password);
      } else {
        if (!displayName) return Alert.alert("Please enter a display name");
        resp = await api.register(email, password, displayName);
      }
      setToken(resp.token);
      navigation.replace("Activities");
    } catch (e:any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Welcome</Text>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      {mode === "register" && (<>
        <Text>Display name</Text>
        <TextInput value={displayName} onChangeText={setDisplayName} style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      </>)}
      <Button title={mode === "login" ? "Sign in" : "Create account"} onPress={onSubmit} />
      <View style={{ height: 8 }} />
      <Button title={mode === "login" ? "Need an account? Register" : "Have an account? Sign in"} onPress={()=>setMode(mode==="login"?"register":"login")} />
    </View>
  );
}


import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Matches">;

export default function MatchScreen({ navigation }: Props) {
  const [partners, setPartners] = useState<any[]>([]);
  useEffect(() => { (async () => setPartners(await api.partners()))(); }, []);

  const startChat = async (userId: string, displayName: string) => {
    const convo = await api.conversationCreate(userId);
    navigation.navigate("Chat", { conversationId: convo.id, peerName: displayName });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Nearby partners</Text>
      <FlatList data={partners} keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth:1, borderRadius:8, marginVertical:6 }}>
            <Text style={{ fontWeight: "600" }}>{item.displayName}</Text>
            <Text>{item.activities.map((ua:any)=>ua.activity.label).join(", ")}</Text>
            <Text>{item.distanceKm.toFixed(1)} km away</Text>
            <View style={{ height: 6 }} />
            <Button title="Chat" onPress={() => startChat(item.id, item.displayName)} />
          </View>
        )}
      />
    </View>
  );
}

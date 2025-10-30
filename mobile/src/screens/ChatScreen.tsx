
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api";
import { socket } from "../socket";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route }: Props) {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const initial = await api.messages(conversationId);
      setMessages(initial);
    })();
    socket.emit("join", { conversationId });
    const handler = (msg:any) => {
      if (msg.conversationId === conversationId) setMessages((prev)=>[...prev, msg]);
    };
    socket.on("message", handler);
    return () => { socket.off("message", handler); };
  }, [conversationId]);

  const send = () => {
    // In a real app we would provide the senderId from auth; for MVP let server echo messages to all, including sender
    socket.emit("message", { conversationId, senderId: "me", body: text });
    setText("");
  };

  return (
    <View style={{ flex:1, padding: 12 }}>
      <FlatList data={messages} keyExtractor={(i)=>i.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6 }}>
            <Text>{item.body}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput value={text} onChangeText={setText} style={{ flex:1, borderWidth:1, borderRadius:8, padding:8 }} />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}

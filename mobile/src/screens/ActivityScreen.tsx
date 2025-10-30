
import React, { useEffect, useState } from "react";
import { View, Text, Switch, Button, Alert, TextInput } from "react-native";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Activities">;

export default function ActivityScreen({ navigation }: Props) {
  const [activities, setActivities] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [radius, setRadius] = useState<string>("5");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    (async () => {
      const acts = await api.activities();
      setActivities(acts);
      try {
        const prof = await api.getProfile();
        if (prof) {
          setDisplayName(prof.displayName || "");
          setRadius(String(prof.radiusKm ?? 5));
          setSelected(prof.activities?.map((a:any)=>a.activity.key) || []);
        }
      } catch {}
    })();
  }, []);

  const toggle = (key:string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k=>k!==key) : [...prev, key]);
  };

  const save = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "We need location to find nearby partners.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      await api.saveProfile({
        displayName: displayName || "User",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        radiusKm: Number(radius),
        activityKeys: selected
      });
      navigation.navigate("Matches");
    } catch (e:any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Your display name</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Choose activities</Text>
      {activities.map(a => (
        <View key={a.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
          <Text>{a.label}</Text>
          <Switch value={selected.includes(a.key)} onValueChange={()=>toggle(a.key)} />
        </View>
      ))}
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Search radius (km)</Text>
      <TextInput value={radius} onChangeText={setRadius} keyboardType="numeric" style={{ borderWidth:1, padding:8, borderRadius:8 }} />
      <Button title="Save & Find partners" onPress={save} />
    </View>
  );
}

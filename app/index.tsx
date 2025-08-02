import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Home = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof isSignedIn === "boolean") {
      if (isSignedIn) {
        router.replace('/(auth)');  
      } else {
        router.replace("/(auth)/welcome"); 
      }
    }
  }, [isSignedIn, router]);

  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#346DEE" />
      <Text>Cargando...</Text>
    </View>
  );
};

export default Home;

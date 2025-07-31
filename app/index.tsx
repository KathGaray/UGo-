import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

const Home = () => {
  //Redirijimos a la página de bienvenida
  return <Redirect href="/(auth)/welcome" />;
};

export default Home;

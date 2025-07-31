import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { login } from "@/auth.js";
import { cls } from "nativewind";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getUserSession();
      if (session) {
        const role = session.user?.role;
        if (role === "conductor") {
          navigation.reset({
            index: 0,
            routes: [{ name: "ConductorScreen" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)", params: { screen: "index" } }],
          });
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    const user = await login(username, password);

    if (user) {
      const role = user.user?.role;

      if (role === "conductor") {
        navigation.reset({
          index: 0,
          routes: [{ name: "ConductorScreen" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "(tabs)",
              params: { screen: "index", user: JSON.stringify(user.user) },
            },
          ],
        });
      }
    } else {
      setErrorMessage("Credenciales incorrectas");
    }
  };

  const handleRegister = () => {
    navigation.navigate("SignupScreen");
  };

  return (
    <View style={cls`bg-F5F5F5 flex-1 relative pb-160`}>
      <TouchableOpacity
        style={cls`absolute top-50 left-20 z-10`}
        //onPress={() => navigation.navigate("(tabs)", { screen: "index" })}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
      </TouchableOpacity>

      <View style={cls`topImageContainer`}>
        <Image
          source={require("../../assets/topVector.png")}
          style={cls`w-full h-160`}
        />
      </View>

      <Text style={cls`text-center text-70 font-500 text-262626`}>Hello</Text>
      <Text style={cls`text-center text-262626`}>Inicia Sesión</Text>

      <View style={cls`inputContainer mx-40 my-50`}>
        <FontAwesome
          name="user"
          size={24}
          color="#9A9A9A"
          style={cls`ml-15 mr-5`}
        />
        <TextInput
          style={cls`flex-1 px-10 font-16`}
          placeholder="Usuario"
          placeholderTextColor="#9A9A9A"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={cls`inputContainer1 mx-40 my-20`}>
        <Fontisto
          name="locked"
          size={24}
          color="#9A9A9A"
          style={cls`ml-15 mr-5`}
        />
        <TextInput
          style={cls`flex-1 px-10 font-16`}
          placeholder="Contraseña"
          placeholderTextColor="#9A9A9A"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {errorMessage ? (
        <Text style={cls`text-center text-red mt-10`}>{errorMessage}</Text>
      ) : null}

      <View style={cls`flex-row mt-90 w-90 justify-end`}>
        <LinearGradient
          colors={["#346DEE", "#5666F7"]}
          style={cls`h-34 w-56 rounded-17 justify-center items-center mx-10`}
        >
          <TouchableOpacity onPress={handleLogin}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={cls`text-center text-262626 text-18 mt-70`}>
          ¿No tienes cuenta? <Text style={cls`underline`}>Regístrate</Text>
        </Text>
      </TouchableOpacity>

      <View style={cls`flex-row justify-center mt-20`}>
        <AntDesign
          name="apple1"
          size={30}
          color="black"
          style={cls`socialIcon`}
        />
        <AntDesign
          name="github"
          size={30}
          color="black"
          style={cls`socialIcon`}
        />
        <AntDesign
          name="google"
          size={30}
          color="black"
          style={cls`socialIcon`}
        />
      </View>

      <View style={cls`leftVectorContainer mt-n250 bottom-0 left-0`}>
        <Image
          source={require("../../assets/leftVector.png")}
          style={cls`h-90 w-150`}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

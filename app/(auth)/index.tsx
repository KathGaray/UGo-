import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { logout, getCurrentUser } from '../../auth';

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-screenWidth))[0];
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Cargar usuario al entrar
  useEffect(() => {
     const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);
  
  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout(); 
          setUser(null);
          router.replace("welcome"); 
        },
      },
    ]);
  };


  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Inicio</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={{ fontSize: 24 }}>Bienvenido</Text>
      </View>

      {/* Menú lateral */}
      {menuOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
      <Animated.View
        style={[
          styles.sideMenu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <Text style={styles.menuTitle}>Menú</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            toggleMenu();
            router.replace('SettingsScreen');
          }}
        >
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5666F7",
    padding: 15,
    paddingTop: 70,
  },
  headerText: {
    fontSize: 20,
    color: "white",
    marginLeft: 15,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: screenWidth * 0.6,
    backgroundColor: "#fff",
    paddingTop: 90,
    paddingHorizontal: 20,
    elevation: 10,
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
  },
});

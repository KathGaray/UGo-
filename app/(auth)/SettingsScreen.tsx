import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";

const AccountSettingsScreen = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  // Estados para editar info
  const [username, setUsername] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");

  // Para cambiar contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Actualizar nombre y email en Clerk
  const handleUpdateInfo = async () => {
    if (!isLoaded) return;
    try {
      await user.update({ fullName: username });
      await user.primaryEmailAddress.update({ emailAddress: email });
      Alert.alert("Éxito", "Información actualizada");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la información");
    }
  };

  // Cambiar contraseña usando Clerk
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden");
      return;
    }
    try {
      await user.updatePassword({
        currentPassword,
        password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      Alert.alert("Éxito", "Contraseña actualizada");
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.longMessage || "No se pudo cambiar la contraseña");
    }
  };

  // Eliminar cuenta con Clerk
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Seguro que quieres eliminar tu cuenta? Esto no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await user.delete();
              await signOut();
              Alert.alert("Cuenta eliminada");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cuenta");
            }
          },
        },
      ]
    );
  };

  if (!isLoaded) return <Text>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar perfil</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre completo"
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Actualizar información" onPress={handleUpdateInfo} />

      <Text style={[styles.title, { marginTop: 30 }]}>Cambiar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña actual"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nueva contraseña"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      <Button title="Actualizar contraseña" onPress={handleChangePassword} color="#346DEE" />

      <View style={{ marginTop: 40 }}>
        <Button title="Eliminar cuenta" color="#d9534f" onPress={handleDeleteAccount} />
      </View>
    </ScrollView>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ccc",
  },
});

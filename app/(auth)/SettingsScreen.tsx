import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'; // ← Importación para navegación
import { Ionicons } from '@expo/vector-icons'; // ← Ícono de flecha
import { getCurrentUser, updateUserInfo, changePassword, deleteAccount } from '../../auth';

const AccountSettingsScreen = () => {
  const navigation = useNavigation(); // ← Hook para navegación

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
      }
    })();

    getCurrentUser().then((userData) => {
      setUser(userData);
      setUsername(userData?.username || '');
      setEmail(userData?.email || '');
      setImageUri(userData?.profile_image_url || null);
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await uploadProfileImage(uri);
    }
  };

  const uploadProfileImage = async (uri) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch('http://192.168.0.6:8000/api/user/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Imagen actualizada');
      } else {
        Alert.alert('Error', 'No se pudo subir la imagen');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al subir la imagen');
    }
  };

  const handleUpdateInfo = async () => {
    const result = await updateUserInfo({ username, email });
    if (result) Alert.alert('Éxito', 'Información actualizada');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      return Alert.alert('Campos incompletos', 'Por favor, llena todos los campos de contraseña.');
    }

    if (newPassword !== newPasswordConfirmation) {
      return Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
    }

    try {
      const result = await changePassword(currentPassword, newPassword, newPasswordConfirmation);

      if (result?.error === 'incorrect_password') {
        return Alert.alert('Error', 'La contraseña actual no es correcta');
      }

      if (result?.success) {
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
        return Alert.alert('Éxito', 'Contraseña actualizada');
      }

      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al cambiar la contraseña');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAccount();
            if (result) {
              Alert.alert('Cuenta eliminada', 'Tu cuenta fue eliminada correctamente');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Flechita para volver */}
        <TouchableOpacity onPress={() => navigation.navigate('index')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Image
            source={imageUri ? { uri: imageUri } : require('./assets/default-avatar.png')}
            style={styles.profileImage}
          />
          <Text style={styles.editText}>Toca para cambiar imagen</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Editar perfil</Text>

        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        <Button title="Actualizar información" onPress={handleUpdateInfo} />

        <Text style={styles.heading}>Cambiar contraseña</Text>

        <Text style={styles.label}>Contraseña actual</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Confirmar nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          value={newPasswordConfirmation}
          onChangeText={setNewPasswordConfirmation}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Button title="Actualizar contraseña" onPress={handleChangePassword} />

        <View style={styles.deleteSection}>
          <Button title="Eliminar cuenta" color="#d9534f" onPress={handleDeleteAccount} />
        </View>
      </View>
    </ScrollView>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 30,
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  editText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  deleteSection: {
    marginTop: 40,
  },
});

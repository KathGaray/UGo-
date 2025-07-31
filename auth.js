import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para iniciar sesión
export async function login(username, password) {
  try {
    const response = await api.post('login', { username, password });

    const { token, user } = response.data;

    if (token && user) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('Login exitoso:', user);
      return response.data;
    } else {
      throw new Error('Datos incompletos recibidos del servidor');
    }
  } catch (error) {
    console.error('Error al hacer login:', error.response?.data || error.message);
    return null;
  }
}

// Función para registrar nuevo usuario
export async function register(username, email, password, password_confirmation) {
  try {
    const response = await api.post('register', {
      username,
      email,
      password,
      password_confirmation,
    });

    const { token, user } = response.data;

    if (token && user) {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('Registro exitoso:', user);
      return response.data;
    } else {
      throw new Error('Datos incompletos recibidos del servidor');
    }
  } catch (error) {
    console.error('Error al registrarse:', error.response?.data || error.message);
    return null;
  }
}

// Obtener usuario actual desde AsyncStorage
export async function getCurrentUser() {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    return null;
  }
}

// Cerrar sesión
export async function logout() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
}




//  Actualizacion de los datos información del usuario
export async function updateUserInfo(updates) {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.put('updateUser', updates, {
      headers: {
        Authorization: Bearer ${token},
      },
    });

    // Actualizamos también en AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    console.log('Usuario actualizado:', response.data.user);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error.response?.data || error.message);
    return null;
  }
}

// Para Cambiar contraseña del usuario
export async function changePassword(current_password, new_password, new_password_confirmation) {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.put(
      'updatePassword',
      {
        current_password,
        new_password,
        new_password_confirmation,
      },
      {
        headers: {
          Authorization: Bearer ${token},
        },
      }
    );

    console.log('Contraseña actualizada correctamente');
    return response.data;
  } catch (error) {
    console.error('Error al cambiar contraseña:', error.response?.data || error.message);
    return null;
  }
}

// Aqui para Eliminar la cuenta del usuario
export async function deleteAccount() {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.delete('deleteAccount', {
      headers: {
        Authorization: Bearer ${token},
      },
    });

    // Limpiar datos locales
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    console.log('Cuenta eliminada');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error.response?.data || error.message);
    return null;
  }
}
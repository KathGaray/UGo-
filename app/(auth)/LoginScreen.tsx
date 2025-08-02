import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import ModalMessage from '../../components/ModalMessage'; 

const LoginScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para manejar modal de error
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    if (user) {
      router.replace('/');
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        showErrorModal('Debes completar pasos adicionales para iniciar sesión.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.errors && err.errors[0]?.code === 'form_password_incorrect') {
        showErrorModal('Contraseña incorrecta. Intenta de nuevo.');
      } else {
        showErrorModal('Error al iniciar sesión. Revisa tus datos.');
      }
    }
  }, [isLoaded, email, password, user]);

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata?.role;

      if (role === 'conductor') {
        router.replace('/ConductorScreen');
      } else {
        router.replace('/');
      }
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.BackArrow} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.topImageContainer}>
        <Image source={require('./assets/topVector.png')} style={styles.topImage} />
      </View>

      <Text style={styles.helloText}>Hello</Text>
      <Text style={styles.signInText}>Inicia Sesión</Text>

      <View style={styles.inputContainer}>
        <Entypo name="email" size={24} color="#9A9A9A" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#9A9A9A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer1}>
        <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          placeholderTextColor="#9A9A9A"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.signButtonContainer}>
        <LinearGradient colors={['#346DEE', '#5666F7']} style={styles.linearGradient}>
          <TouchableOpacity onPress={onSignInPress}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <TouchableOpacity onPress={() => router.push('/SignupScreen')}>
        <Text style={styles.footerText}>
          ¿No tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.socialMediaContainer}>
        <AntDesign name="apple1" size={30} color="black" style={styles.socialIcon} />
        <AntDesign name="github" size={30} color="black" style={styles.socialIcon} />
        <AntDesign name="google" size={30} color="black" style={styles.socialIcon} />
      </View>

      <View style={styles.leftVectorContainer}>
        <Image source={require('./assets/leftVector.png')} style={styles.leftVectorImage} />
      </View>

      {/* Modal de error */}
      <ModalMessage
        visible={modalVisible}
        title="Error"
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    position: 'relative',
    paddingBottom: 160,
  },
  topImage: {
    width: '100%',
    height: 160,
  },
  helloText: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: '500',
    color: '#262626',
  },
  signInText: {
    textAlign: 'center',
    color: '#262626',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    alignItems: 'center',
    height: 50,
    marginTop: 50,
  },
  inputContainer1: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    alignItems: 'center',
    height: 50,
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  signButtonContainer: {
    flexDirection: 'row',
    marginTop: 90,
    width: '90%',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: 34,
    width: 56,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  footerText: {
    color: '#262626',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 70,
  },
  socialIcon: {
    backgroundColor: 'white',
    elevation: 10,
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  leftVectorContainer: {
    marginTop: -250,
    bottom: 0,
    left: 0,
  },
  leftVectorImage: {
    height: '90%',
    width: 150,
  },
  BackArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});

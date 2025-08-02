import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';

import CustomButton from '@/components/CustomButton';
import InputField from '../../components/InputField';
import ModalMessage from '@/components/ModalMessage'; 
import { icons } from '@/constants';

const SignupScreen = () => {
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  useEffect(() => {
    if (verification.state === 'success') {
      const timer = setTimeout(() => {
        setVerification({ state: 'default', code: '', error: '' });
        navigation.navigate('LoginScreen');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verification.state]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleError = (msg: string) => {
    setErrorMessage(msg);
    setShowErrorModal(true);
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!username || !email || !password || !confirmPassword) {
      return handleError('Completa todos los campos');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError('Correo inválido');
    }

    if (password.length < 6) {
      return handleError('La contraseña debe tener al menos 6 caracteres');
    }

    if (password !== confirmPassword) {
      return handleError('Las contraseñas no coinciden');
    }

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({
        state: 'verification',
        error: '',
        code: '',
      });
    } catch (err: any) {
      console.error('Error en signUp:', JSON.stringify(err, null, 2));
      const errorMsg =
        err?.errors?.[0]?.longMessage || err.message || 'Error desconocido';
      handleError(errorMsg);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!verification.code) {
      return handleError('Por favor ingresa el código de verificación');
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          state: 'success',
          error: '',
          code: '',
        });
      } else {
        setVerification({
          state: 'failed',
          error: 'La verificación falló. Intenta nuevamente.',
          code: verification.code,
        });
      }
    } catch (err: any) {
      const errorMsg =
        err?.errors?.[0]?.longMessage || err.message || 'Error desconocido';
      setVerification({
        state: 'failed',
        error: errorMsg,
        code: verification.code,
      });
      handleError(errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.BackArrow}
        onPress={() => navigation.navigate('welcome')}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.topImageContainer}>
        <Image source={require('./assets/topVector.png')} style={styles.topImage} />
      </View>

      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Registrate</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={24} color="#9A9A9A" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Usuario"
          placeholderTextColor="#9A9A9A"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer1}>
        <Entypo name="email" size={24} color="#9A9A9A" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#9A9A9A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

      <View style={styles.inputContainer1}>
        <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#9A9A9A"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.signButtonContainer}>
        <LinearGradient colors={['#346DEE', '#5666F7']} style={styles.linearGradient}>
          <TouchableOpacity onPress={onSignUpPress}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ReactNativeModal
        isVisible={verification.state === 'verification'}
        onModalHide={() => {
          if (verification.state === 'success') setShowSuccessModal(true);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Verifica tu Email</Text>
          <Text style={styles.modalSubtitle}>
            Hemos enviado un código de verificación a tu email.
          </Text>

          <InputField
            label="Código"
            icon={icons.lock}
            placeholder="12345"
            value={verification.code}
            keyboardType="numeric"
            onChangeText={(code) => setVerification({ ...verification, code })}
          />

          <CustomButton
            title="Verificar Email"
            onPress={onVerifyPress}
            className="mt-5 bg-success-500"
          />
        </View>
      </ReactNativeModal>

      <ReactNativeModal isVisible={showSuccessModal}>
        <View style={styles.modalContentSuccess}>
          <Image
            source={require('./assets/check.png')}
            style={{ width: 110, height: 110, marginVertical: 20 }}
            resizeMode="contain"
          />
          <Text style={styles.successTitle}>Verificado</Text>
          <Text style={styles.modalSubtitle}>Tu verificación ha sido exitosa</Text>
        </View>
      </ReactNativeModal>

      <ModalMessage
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.footerText}>
            Ya tienes una cuenta?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Inicia Sesión</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.socialMediaContainer}>
          <AntDesign name="apple1" size={30} color="black" style={styles.socialIcon} />
          <AntDesign name="github" size={30} color="black" style={styles.socialIcon} />
          <AntDesign name="google" size={30} color="black" style={styles.socialIcon} />
        </View>
      </View>

      <View style={styles.leftVectorContainer}>
        <ImageBackground
          source={require('./assets/leftVector.png')}
          style={styles.leftVectorImage}
        />
      </View>
    </View>
  );
};

export default SignupScreen;


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
    fontSize: 50,
    fontWeight: '500',
    color: '#262626',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 15,
    alignItems: 'center',
    height: 50,
    marginTop: 25,
  },
  inputContainer1: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 15,
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
    marginTop: 50,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 10,
    fontWeight: '500',
  },
  footerText: {
    color: '#262626',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
  },
  footerContainer: {
    marginTop: 20,
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
  modalContent: {
    backgroundColor: 'white',
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderRadius: 24,
    minHeight: 300,
  },
  modalContentSuccess: {
    backgroundColor: 'white',
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderRadius: 24,
    minHeight: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  leftVectorContainer: {
    marginTop: -200,
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

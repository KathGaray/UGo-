import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { register } from '../../auth'; 

const SignupScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const response = await register(username, email, password, confirmPassword);
    
    if (response) {
      Alert.alert('Éxito', 'Registro exitoso');
      navigation.navigate('LoginScreen'); 
    } else {
      Alert.alert('Error', 'No se pudo registrar. Verifica los datos.');
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.BackArrow} onPress={() => navigation.navigate('welcome')}>
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
        />
      </View>

      <View style={styles.signButtonContainer}>
        <LinearGradient
          colors={['#346DEE', '#5666F7']}
          style={styles.linearGradient}>
          <TouchableOpacity onPress={handleRegister}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.footerText}>
            Ya tienes una cuenta?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>
              Inicia Sesion
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.socialMediaContainer}>
          <AntDesign name="apple1" size={30} color="black" style={styles.socialIcon} />
          <AntDesign name="github" size={30} color="black" style={styles.socialIcon} />
          <AntDesign name="google" size={30} color="black" style={styles.socialIcon} />
        </View>
      </View>

      <View style={styles.leftVectorContainer}>
        <ImageBackground source={require('./assets/leftVector.png')} style={styles.leftVectorImage} />
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
  topImageContainer: {},
  topImage: {
    width: '100%',
    height: 160,
  },
  helloContainer: {},
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
  footerText: {
    color: '#262626',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  BackArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },  
});

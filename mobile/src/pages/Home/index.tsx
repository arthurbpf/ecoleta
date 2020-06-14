import React, { useState, useEffect } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { ImageBackground, View, Image, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from "react-native-gesture-handler";
import { AppLoading } from "expo";
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

import { useFonts, Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Ubuntu_700Bold } from "@expo-google-fonts/ubuntu";

const logo = require('../../assets/logo.png');
const backgroundImage = require('../../assets/home-background.png');

interface IBGEUFResponse {
  sigla: string,
}

interface IBGECityResponse {
  nome: string,
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  const [fontsloaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold,
  });

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
    });
  }, [selectedUf]);

  if (!fontsloaded) {
    return <AppLoading />
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={backgroundImage}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo}></Image>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          
          <Picker
            selectedValue={selectedUf}
            style={styles.input}
            itemStyle={styles.inputItem}
            onValueChange={(value, index) => {
              setSelectedUf(String(value));
            }}
          >
            <Picker.Item label="Selecione uma UF" value="" />
            
            {ufs.map(uf => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedCity}
            style={styles.input}
            itemStyle={styles.inputItem}
            onValueChange={(value, index) => {
              setSelectedCity(String(value));
            }}
          >
            <Picker.Item label="Selecione uma Cidade" value="" />
            
            {cities.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFFFFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputItem: {
    color: '#322153'
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});
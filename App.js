import { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import PickerItem from './src/Picker';
import { api } from './src/services/api';

export default function conversor() {
  const [loading, setLoading] = useState(true)
  const [moedas, setMoedas] = useState([])
  const [moedaSelecionada, setMoedaSelecionada] = useState(null)

  //  USESTATE DO TOUCHABLEOPACITY PÓS CONVERSÃO. 
  const [moedaBValor, setMoedaBValor] = useState('')
  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConvertido, setValorConvertido] = useState(0)


  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get('all')
      let arrayMoedas = [];
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        })
      })

      setMoedas(arrayMoedas)
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false)
    }

    loadMoedas();
  }, [])

  async function converter() {
    if(moedaBValor === 0 || moedaBValor === "" || moedaSelecionada === null){
      return;
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor))

    setValorConvertido(`${resultado}`)
    setValorMoeda(moedaBValor)

  }

  if (loading) {
    return (
      <View style={styles.load}>
        <ActivityIndicator color='#FFF' size='large' />
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>
          Selecione sua moeda
        </Text>
        <PickerItem
          moedas={moedas}
          moedaSelecionada={moedaSelecionada}
          onChange={(moeda) => { setMoedaSelecionada(moeda) }}

        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}>
          Digite um valor para converser em (R$)
        </Text>
        <TextInput
          placeholder='EX: 5.50'
          style={styles.input}
          keyboardType='numeric'
          value={moedaBValor}
          onChangeText={(valor) => setMoedaBValor(valor)}
        />
      </View>
      <TouchableOpacity style={styles.areaBtn} onPress={converter}>
        <Text style={styles.btnText}> CONVERTER </Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>
            {valorMoeda} {moedaSelecionada}
          </Text>

          <Text style={styles.titulo}>
            corresponde a
          </Text>

          <Text style={styles.valorConvertido}>
            {valorConvertido}
          </Text>

        </View>)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center'
  },

  areaMoeda: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 8,
    marginBottom: 1,
  },

  titulo: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    padding: 5,
  },

  load: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101215'
  },

  areaValor: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop: 8,
    paddingBottom: 8,
  },

  input: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000'
  },

  areaBtn: {
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  btnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },

  areaResultado: {
    width: '90%',
    backgroundColor: '#fff',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  valorConvertido: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  }
})
import React, { Component } from 'react';
import { Platform, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight } from 'react-native';

import { ListItem, Header, Input, FormInput, Button, Card, Image, ActivityIndicator } from 'react-native-elements';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, AppNavigator } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

import { ContactListItem } from './ContactListItem';

const contactList = [
  { key: '1', name: 'Juan Lopez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '2', name: 'José Perez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '3', name: 'David Rodriguez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '4', name: 'Alberto Rojo', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '5', name: 'Alejandra Gonzalez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '6', name: 'Luis Peña', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '7', name: 'Martin Salcido', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '8', name: 'Gerardo Ruiz', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '9', name: 'Estefania Lopez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '10', name: 'Sandra Gomez', phone: '6681732104', email: 'email@hotmail.com' },
  { key: '11', name: 'Yahir Diaz', phone: '6681732104', email: 'email@hotmail.com' },
];


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Contactos',
  };
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container} style={{ flex: 1 }}>
        <FlatList style={{ flex: 1 }}
          data={contactList}
          renderItem={
            ({ item }) =>
              <Text>Texto</Text>
          }
          ItemSeparatorComponent={
            () => <View style={{ height: 1, width: '100%', backgroundColor: "#EFEFEF" }}></View>
          }
        />
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => { navigate('Contact') }}
        />

      </View>
    );
  }
}

class ContactScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  handlerEditButton() {
    this.setState(p => (
      { editing: 'true' }
    ));
  }

  static navigationOptions = {
    title: "Contacto",
    headerRight: (
      <Button
        onPress={() => alert('Guardando...')}
        title="Guardar"
        color="#000"
        type="clear"
      />
    ),
  };
  render() {
    const { navigate } = this.props.navigation;
    var contact = this.props.navigation.getParam('contact', null);

    return (
      <View style={styles.container} style={{ flex: 1, backgroundColor: '#DDD' }}>
        <Card image={{ uri: 'http://lorempixel.com/400/200/nature' + '?rand=' + Math.random() }}>
          <Input placeholder='Nombre' editable={this.state.editing}>{contact ? contact.name : ''}</Input>
          <Input placeholder='Teléfono' editable={this.state.editing}>{contact ? contact.phone : ''}</Input>
          <Input placeholder='E-mail' editable={this.state.editing}>{contact ? contact.email : ''}</Input>
          <View style={{ flexDirection: 'row', marginTop: 40 }}>

            {/* Botón para llamar */}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button
                type="solid"
                icon={
                  <Icon
                    name="call"
                    size={28}
                    color="white" />
                }
                titleStyle={{ marginLeft: 10, fontSize: 18 }}
                buttonStyle={{ backgroundColor: 'green' }}
              />
            </View>

            {/* Botón para editar */}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button
                type="outline"
                icon={
                  <Icon
                    name="create"
                    size={28}
                    color='white'
                  />
                }
                titleStyle={{ marginLeft: 10, fontSize: 18 }}
                buttonStyle={{ backgroundColor: 'gray', borderWidth: 0 }}
                onPress={() => {
                  this.setState(p => (
                    { editing: true }
                  ));
                }}
              />
            </View>

          </View>
        </Card>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Contact: { screen: ContactScreen },
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => (
  <MenuProvider>
    <AppContainer />
  </MenuProvider>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

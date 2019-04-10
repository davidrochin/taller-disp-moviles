import React, { Component } from 'react';
import { Platform, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight, Linking } from 'react-native';

import { ListItem, Header, Input, FormInput, Button, Card, Image, ActivityIndicator } from 'react-native-elements';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, AppNavigator } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

import SQLite from "react-native-sqlite-storage";

import ContactListItem from './ContactListItem';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Contactos',
  };

  render() {
    const { navigate } = this.props.navigation;
    contactList = new Array(0);

    console.log('Actualizando lista de contactos');

    Helper.db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM contacts',
        [], 
        function (tx, res) {

          console.log(res.rows);
          for(i = 0; i < res.rows.length; i++){
            contactList.push(res.rows.item(i));
          }

        }
      );
    });

    
    /*Helper.db.transaction(function(txn) {
      txn.executeSql(
        'SELECT * FROM contacts',
        function(tx, res) {
          console.log('Imprimiendo Res');
          console.log(res);
        }
      );
    });*/

    console.log('Rendering with: ' + contactList);

    return (
      <View style={styles.container} style={{ flex: 1 }}>

        <FlatList style={{ flex: 1 }}
          data={contactList}
          renderItem={
            ({ item }) =>
              <ContactListItem
                item={item}
                onOpen={() => {
                  navigate('Contact', { contact: item });
                }}
                onCall={() => {
                  Linking.openURL('tel:${' + item.phone + '}')
                }}
              />
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

  contact;

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }

    contact = this.props.navigation.getParam('contact', null);
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
        onPress={() => {
          SQLite.openDatabase({
            name: "app.db",
            location: "default",
          }).then((db) => {
            console.log("Database open!");
            db.executeSql('INSERT INTO contacts (id, name, phone, email) VALUES (?, ?, ?, ?)', [contact.id, contact.name, contact.phone, contact.email]);
          }).catch(e => {
            console.log('There has been a problem with your operation: ' + e.message);
          });
        }}
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
                onPress={() => {
                  Linking.openURL('tel:${' + contact.phone + '}')
                }}
              />
            </View>

            {/* Botón para enviar SMS */}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Button
                type="outline"
                icon={
                  <Icon
                    name="sms"
                    size={28}
                    color='white'
                  />
                }
                titleStyle={{ marginLeft: 10, fontSize: 18 }}
                buttonStyle={{ backgroundColor: 'orange', borderWidth: 0 }}
                onPress={() => {
                  this.setState(p => (
                    { editing: true }
                  ));
                  Linking.openURL('sms:' + contact.phone + '?body=')
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

const Helper = {
  db: null
}

class App extends React.Component {
  constructor() {
    super();
    SQLite.DEBUG(true);
    SQLite.enablePromise(false);

    console.log('Abriendo base de datos ----------------');

    Helper.db = SQLite.openDatabase({ name: 'app.db', location: 'default' });
    Helper.db.executeSql('CREATE TABLE IF NOT EXISTS contacts ('
      + 'id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,'
      + 'name	TEXT,'
      + 'phone	TEXT,'
      + 'email	TEXT'
      + ');');
  }

  render() {
    return <AppContainer />;
  }

  componentDidMount() {
    /*SQLite.DEBUG(true);
    SQLite.enablePromise(false);

    console.log('Abriendo base de datos ----------------');

    Helper.db = SQLite.openDatabase({ name: 'app.db', location: 'default' });
    Helper.db.executeSql('CREATE TABLE IF NOT EXISTS contacts ('
      + 'id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,'
      + 'name	TEXT,'
      + 'phone	TEXT,'
      + 'email	TEXT'
      + ');');*/

    /*SQLite.openDatabase({
      name: "app.db",
      location: "default",

    }).then((db) => {
      console.log("Database open!");
      db.executeSql('CREATE TABLE IF NOT EXISTS contacts ('
        + 'id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,'
        + 'name	TEXT,'
        + 'phone	TEXT,'
        + 'email	TEXT'
        + ');');
    }).catch(e => {
      console.log('There has been a problem with your operation: ' + e.message);
    });*/
  }
}

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

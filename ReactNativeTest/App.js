import React, { Component } from 'react';
import {
  Platform, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert,
  TouchableHighlight, Linking, KeyboardAvoidingView, ScrollView, DeviceEventEmitter
} from 'react-native';

import { ListItem, Header, Input, FormInput, Button, Card, Image, ActivityIndicator } from 'react-native-elements';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, AppNavigator } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

import SQLite from "react-native-sqlite-storage";

import ImagePicker from 'react-native-image-picker';

import ContactListItem from './ContactListItem';

const imagePickerOptions = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  quality: 0.3,
  maxWidth: 500,
  maxHeight: 500,
  //allowsEditing: true,
  //noData: true,
};

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contacts: new Array(0),
    }

    this.updateContacts();
  }

  updateContacts() {
    console.log('Actualizando lista de contactos');

    Helper.db.transaction(function (txn) {
      txn.executeSql(
        'SELECT * FROM contacts ORDER BY name',
        [],
        function (tx, res) {

          contactList = new Array(0);

          console.log("Result:");
          console.log(res.rows);

          for (i = 0; i < res.rows.length; i++) {

            console.log(res.rows.item(i));

            // Para evitar el bug raro
            if (res.rows.item(i).key = res.rows.item(i).id != null) {
              res.rows.item(i).key = res.rows.item(i).id.toString();
              contactList.push(res.rows.item(i));
            }
          }
          console.log('Lista de contactos:');
          console.log(contactList);

          this.setState(p => ({
            contacts: contactList
          }));

        }.bind(this)
      );
    }.bind(this));
  }

  static navigationOptions = {
    title: 'Contactos',
  };

  componentWillMount() {
    DeviceEventEmitter.addListener('CONTACTS_UPDATED', (e) => {
      this.updateContacts();
    })
  }

  render() {
    const { navigate } = this.props.navigation;

    console.log('Rendering list item with: ')
    console.log(this.state.contacts);

    return (
      <View style={styles.container} style={{ flex: 1 }}>

        <FlatList style={{ flex: 1 }}
          data={this.state.contacts}
          renderItem={
            ({ item }) =>
              <ContactListItem
                item={item}
                onOpen={() => {
                  navigate('Contact', { contact: item, edit: false });
                }}
                onEdit={() => {
                  navigate('Contact', { contact: item, edit: true });
                }}
                onCall={() => {
                  Linking.openURL('tel:${' + item.phone + '}')
                }}
                onSMS={() => {
                  Linking.openURL('sms:' + item.phone)
                }}
                onDelete={() => {
                  Helper.db.executeSql('DELETE FROM contacts WHERE id == ?', [item.id]);
                  DeviceEventEmitter.emit('CONTACTS_UPDATED', {});
                }}
                onPress={() => {
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
          onPress={() => { navigate('Contact', { edit: true }) }}
        />

      </View>
    );
  }
}

class ContactScreen extends React.Component {

  contact;
  edit;

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      image: require('./img/avatar-placeholder.png'),
      name: '',
      phone: '',
      email: '',
    }

    this.contact = this.props.navigation.getParam('contact', null);
    this.edit = this.props.navigation.getParam('edit', null);

    // Cargar los datos del contacto en los params
    if (this.contact != null) {
      this.props.navigation.setParams({ id: this.contact.id });
      this.props.navigation.setParams({ name: this.contact.name });
      this.props.navigation.setParams({ phone: this.contact.phone });
      this.props.navigation.setParams({ email: this.contact.email });
      this.props.navigation.setParams({ image: this.contact.image });
    } else {
      this.props.navigation.setParams({ name: '' });
      this.props.navigation.setParams({ phone: '' });
      this.props.navigation.setParams({ email: '' });
      this.props.navigation.setParams({ image: '' });
    }

  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Contacto",
      headerRight: navigation.getParam('edit') ? (
        <Button
          title="Guardar" color="#000" type="clear"
          onPress={() => {
            console.log(navigation.state);
            if (navigation.getParam('contact') == null) {

              // Guardar el contacto
              console.log(navigation.getParam('name'));
              console.log(navigation.getParam('phone'));
              console.log(navigation.getParam('email'));
              console.log(navigation.getParam('image'));

              if (navigation.getParam('image') == null || navigation.getParam('image') == undefined) {
                Helper.db.executeSql('INSERT INTO contacts (name, phone, email) VALUES (? ,? , ?)', [navigation.getParam('name'), navigation.getParam('phone'), navigation.getParam('email')]);
              } else {
                Helper.db.executeSql('INSERT INTO contacts (name, phone, email, image) VALUES (?, ?, ?, ?)', [navigation.getParam('name'), navigation.getParam('phone'), navigation.getParam('email'), navigation.getParam('image')]);
              }
            } else {

              console.log("Actualizando el contacto ---------------------");
              console.log([navigation.getParam('id'), navigation.getParam('name'), navigation.getParam('phone'), navigation.getParam('email'), navigation.getParam('image')]);

              // Actualizar el contacto
              if (navigation.getParam('image') == null || navigation.getParam('image') == undefined) {
                Helper.db.executeSql('UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ' + navigation.getParam('contact').id, [navigation.getParam('name'), navigation.getParam('phone'), navigation.getParam('email')]);
              } else {
                Helper.db.executeSql('UPDATE contacts SET name = ?, phone = ?, email = ?, image = ? WHERE id = ' + navigation.getParam('contact').id, [navigation.getParam('name'), navigation.getParam('phone'), navigation.getParam('email'), navigation.getParam('image')]);
              }

            }

            alert('El contacto ha sido guardado con éxito');

            DeviceEventEmitter.emit('CONTACTS_UPDATED', {});
          }}
        />) : <Text></Text>,
    }
  };

  componentWillMount() {
    DeviceEventEmitter.addListener('CONTACTS_UPDATED', (e) => {
      this.props.navigation.goBack();
    });

    if (this.contact != null && this.contact.image != null && this.contact.image.length > 0) {
      const source = { uri: 'data:image/jpeg;base64,' + this.contact.image };
      console.log(source);
      this.setState({
        image: source
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    this.contact = this.props.navigation.getParam('contact', null);
    this.edit = this.props.navigation.getParam('edit', null);

    return (
      <ScrollView style={styles.container} style={{ flex: 1, backgroundColor: '#DDD' }}>

        {/* Tarjeta del contacto */}
        <Card>

          {/* Imagen */}
          <TouchableOpacity onPress={(p) => {

            // Mostrar el selector de imagen
            if (this.state.editing || this.edit) {
              ImagePicker.showImagePicker(imagePickerOptions, (response) => {
                //console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.error) {
                  console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                  console.log('User tapped custom button: ', response.customButton);
                } else {
                  //const source = { uri: response.uri };



                  const source = { uri: 'data:image/jpeg;base64,' + response.data };
                  this.props.navigation.setParams({ image: response.data })

                  this.setState({
                    avatarSource: source,
                    image: source,
                  });
                }
              })
            }
          }}>
            <Image
              source={this.state.image}
              style={{ width: "100%", height: 200 }}
            />
          </TouchableOpacity>

          {/* Nombre */}
          <Input
            placeholder='Nombre'
            editable={this.state.editing || this.edit}
            onChangeText={(text) => { this.props.navigation.setParams({ name: text }) }}
          >
            {this.contact ? this.contact.name : ''}
          </Input>

          {/* Teléfono */}
          <Input
            placeholder='Teléfono'
            keyboardType = 'numeric'
            editable={this.state.editing || this.edit}
            onChangeText={(text) => { this.props.navigation.setParams({ phone: text }) }}
          >
            {this.contact ? this.contact.phone : ''}
          </Input>

          {/* Correo */}
          <Input
            placeholder='E-mail'
            editable={this.state.editing || this.edit}
            onChangeText={(text) => { this.props.navigation.setParams({ email: text }) }}
          >
            {this.contact ? this.contact.email : ''}
          </Input>

          <View style={this.contact ? {display: "flex", flexDirection: 'row', marginTop: 20} : {display: "none"} }>

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
                  Linking.openURL('tel:${' + this.contact.phone + '}')
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
                  Linking.openURL('sms:' + this.contact.phone + '?body=')
                }}
              />
            </View>

          </View>
        </Card>
      </ScrollView>
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
      + 'phone TEXT,'
      + 'email TEXT,'
      + 'image TEXT'
      + ');');

  }

  render() {
    return <AppContainer />;
  }

  componentDidMount() {
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

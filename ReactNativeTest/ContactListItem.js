import React, { Component } from 'react';
import { Platform, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight } from 'react-native';

import { ListItem, Header, Input, FormInput, Button, Card, Image, ActivityIndicator } from 'react-native-elements';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, AppNavigator } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';

import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

export default class ContactListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        <TouchableOpacity>
            <Text>Hola!</Text>
            <ListItem
                title={item.name}
                titleStyle={{ color: 'black' }}
                subtitle='6681732104'
                leftAvatar={{ source: { uri: 'http://lorempixel.com/256/256/people' + '?rand=' + Math.random() } }}
                chevron
                rightElement={
                    <Menu>
                        <MenuTrigger text='' />
                        <MenuOptions>
                            <MenuOption onSelect={() => alert(`Save`)} text='Abrir' />
                            <MenuOption onSelect={() => alert(`Save`)} text='Editar' />
                            <MenuOption onSelect={() => alert(`Save`)} text='Eliminar' />
                            <MenuOption onSelect={() => alert(`Save`)} text='Llamar' />
                            <MenuOption onSelect={() => alert(`Save`)} text='SMS' />
                        </MenuOptions>
                    </Menu>
                }
            />
        </TouchableOpacity>
    }
}
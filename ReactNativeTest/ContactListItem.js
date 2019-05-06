import React, { Component } from 'react';
import { Platform, FlatList, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, TouchableHighlight } from 'react-native';

import { ListItem, Header, Input, FormInput, Button, Card, Image, ActivityIndicator } from 'react-native-elements';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, AppNavigator } from 'react-navigation';
import { TextInput, ScrollView } from 'react-native-gesture-handler';

import {Linking} from 'react-native'

import {
    MaterialDialog,
    MultiPickerMaterialDialog,
    SinglePickerMaterialDialog,
} from 'react-native-material-dialog';

import { material } from 'react-native-typography';

import { Helper } from './App';

export default class ContactListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }
    }

    render() {
        return (<TouchableOpacity>
            <ListItem
                title={this.props.item.name}
                titleStyle={{ color: 'black' }}
                subtitle={this.props.item.phone}
                leftAvatar={{ source: { uri: 'http://lorempixel.com/256/256/people' + '?rand=' + Math.random() } }}
                chevron
                onPress={this.props.onPress}
                rightElement={
                    <MaterialDialog
                        title={'Acción'}
                        visible={this.state.opened}
                        onCancel={() => {
                            this.setState({ opened: false });
                        }}>
                        <ScrollView>

                            {/* Abrir */}
                            <TouchableOpacity
                                style={styles.listElement}
                                onPress={() => {
                                    this.setState({ opened: false });
                                    this.props.onOpen();
                                }}>
                                <Text style={material.subheading}>Abrir</Text>
                            </TouchableOpacity>

                            {/* Editar */}
                            <TouchableOpacity
                                style={styles.listElement}
                                onPress={() => {
                                    this.setState({ opened: false });
                                    this.props.onEdit();
                                }}>
                                <Text style={material.subheading}>Editar</Text>
                            </TouchableOpacity>

                            {/* Eliminar */}
                            <TouchableOpacity
                                style={styles.listElement}
                                onPress={() => {
                                    this.setState({ opened: false });
                                    this.props.onDelete();
                                }}>
                                <Text style={material.subheading}>Eliminar</Text>
                            </TouchableOpacity>

                            {/* Llamar */}
                            <TouchableOpacity
                                style={styles.listElement}
                                onPress={() => {
                                    this.setState({ opened: false });
                                    this.props.onCall();
                                }}>
                                <Text style={material.subheading}>Llamar</Text>
                            </TouchableOpacity>

                            {/* SMS */}
                            <TouchableOpacity
                                style={styles.listElement}
                                onPress={() => {
                                    this.setState({ opened: false });
                                    this.props.onSMS();
                                }}>
                                <Text style={material.subheading}>SMS</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </MaterialDialog>
                }
                onLongPress={() => {
                    this.setState(previous => ({ opened: true }));
                }}
            />
        </TouchableOpacity>);
    }
}

const styles = StyleSheet.create({
    listElement: {
        height: 40
    }
});
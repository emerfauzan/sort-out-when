import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux'

const Footer = ({onCapture, onReload}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onCapture} style={styles.button}>
                <Icon name="mobile" size={25} color="#007AFF"  style={styles.iconButton}/>
                <Text>Snap</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReload} style={styles.button}>
                <Icon name="spinner" size={25} color="#007AFF"  style={styles.iconButton}/>
                <Text>Reload</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Actions.text()} style={styles.button}>
                <Icon name="list" size={25} color="#007AFF"  style={styles.iconButton}/>
                <Text>Text</Text>
            </TouchableOpacity>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        bottom: 0, width: '100%', 
        height: 70, 
        backgroundColor: '#FFFFFF', 
        flexDirection: 'row', 
        justifyContent: 'space-around'
    },
    button: {
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    iconButton: {
        margin: 5
    }
})

export default Footer
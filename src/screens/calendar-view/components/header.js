import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux'

const header = ({month, year, goToSetting}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{month} {year}</Text>
            <TouchableOpacity onPress={goToSetting} style={styles.buttonRight}>
                <Icon name='bars' size={25} color="#007AFF"  style={styles.iconButtonRight} />
            </TouchableOpacity>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        padding: 15, 
        alignItems: 'center', 
        justifyContent: 'center' ,
        backgroundColor: '#FFFFFF'
    },
    title: {
        fontSize: 20
    },
    buttonRight: {
        position: 'absolute', 
        right: 10
    },
    iconButtonRight: {
        margin: 5
    }
})

export default header
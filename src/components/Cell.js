import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

const Cell = () => {
    return (
        <View style={styles.container}>
            <Text>AA</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        borderTopColor: '#000000',
        borderTopWidth: 1,
    }
})

export default Cell
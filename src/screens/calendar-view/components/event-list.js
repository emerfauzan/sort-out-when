import React, {useState} from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'

const EventList = ({data}) => {
    return (
        <FlatList
            data={data}
            renderItem={({item}) => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 30, alignItems: 'center'}}>
                        <Text>{item.label}</Text>
                    </View>
                    <View style={{flex: 1, height: 1, backgroundColor: 'red'}}></View>
                </View>
            )}
        />
        
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 30,
        alignItems: 'center'
    },
    list: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

export default EventList
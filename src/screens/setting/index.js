import React, {useState, useEffect, useRef} from 'react'
import { Modal, View, Text, Switch, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import {setSourceData} from '../../redux/sources'
import {setEventData} from '../../redux/events'
import _ from 'lodash'
import RNCalendarEvents from "react-native-calendar-events";


const Setting = () => {
    const source = useSelector((state) => state.sourcesReducer)
    const dispatch = useDispatch()

    useEffect(() => {

    }, [source])

    const toggleSwitch = async (id) => {
        let newSource = await source.data
        console.log(id)
        for(let i=0;i<newSource.length;i++){
            for(let j=0;j<newSource[i].items.length;j++){
                if(newSource[i].items[j].id == id){
                    newSource[i].items[j].selected = !newSource[i].items[j].selected
                }
            }
        }
        await dispatch(setSourceData(newSource))
    }

    return(
        <View style={styles.container}>
            <FlatList
                data={source.data}
                extraData={source.data}
                keyExtractor={(item) => item.source}
                renderItem={({item}) => {
                    return item.items.length > 0 &&
                     (
                        <View style={{marginVertical: 5}}>
                            <Text style={{marginLeft: 10, marginBottom: 5, fontSize: 16, fontWeight: 'bold'}}>{item.source}</Text>
                            <FlatList
                                data={item.items}
                                extraData={item.items}
                                keyExtractor={(item, index) => index}
                                renderItem={({item}) => (
                                    <View style={{backgroundColor: '#FFFFFF', padding: 15, borderColor: 'grey', borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{fontSize: 16}}>{item.title}</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#007AFF" }}
                                            thumbColor={"#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => toggleSwitch(item.id)}
                                            value={item.selected}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})
export default Setting
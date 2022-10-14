import React, { useEffect } from 'react'
import {View, Text, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'
import RNCalendarEvents from "react-native-calendar-events";

const Splash = () => {
    useEffect(() => {
        init()
    })

    init = async () => {
        await RNCalendarEvents.requestPermissions();
        setTimeout(() => {
            Actions.home()
        }, 3000)
    }
    return (
        <View style={{flex: 1, alignItems:'center', justifyContent: 'center', backgroundColor: '#3498DB'}}>
            <Image source={require("../../assets/icon-pin.png")} resizeMode="contain" style={{height: 150}} />
        </View>
    )
}

export default Splash
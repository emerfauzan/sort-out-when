import React, {useState, useEffect, useRef} from 'react'
import { Modal, View, Text, Switch, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'

const text = () => {
    const events = useSelector((state) => state.eventReducer)

    const [data, setData] = useState([])
    const [text, setText] = useState("")

    useEffect(() => {
        getData()
    }, [events])

    const getData = () => {
        let a = events.data.filter(item => item.type === "PREFERRED")
        let b = "";
        console.log(a)
        a.forEach((item, index) => {
            let c = `${index+1}. ${moment(item.start).format("HH:mm")} - ${moment(item.end).format("HH:mm")} ${moment(item.start).format("DD MMMM")} ${moment(item.start).format("dddd")} \n`
            b = b+c
        })
        setData(a)
        setText(b)
    }

    return(
        <View style={{padding: 20}}>
            <TextInput 
                style={{backgroundColor: '#FFFFFF', width: '100%', paddingVertical: 20, paddingHorizontal: 10}}
                multiline={true}
                value={text}
                editable={false}
            />
            <Text style={{marginTop: 10, color:'grey'}}>
                *Hold the text to select and copy
            </Text>
        </View>
    )
}

export default text
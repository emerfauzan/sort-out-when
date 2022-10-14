import React, {useEffect} from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Cell } from 'react-native-table-component'


const Column = ({cells}) => {
    var cellArray = []

    useEffect(() => {
        for(let i=0; i<cells; i++){
            console.log(cellArray)
            cellArray.push(
                <Cell/>
            )
        }
    })

    return (
        <View style={styles.container}>
            <Cell/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Column
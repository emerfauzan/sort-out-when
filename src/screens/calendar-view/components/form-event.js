import React from 'react'
import DatePicker from 'react-native-date-picker'
import RadioGroup from 'react-native-radio-buttons-group';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

const FormEvent = ({setOpen, onDateSelected, setModalShow, onDelete, 
    setIsStart, isEdit, onSave, open, isStart, startDate, endDate, radioButtons,
    onPressRadioButton, starts, ends
}) => {
    return (
        <View style={styles.container}>
            <DatePicker
                modal
                open={open}
                date={isStart ? startDate : endDate}
                onConfirm={(date) => {
                    setOpen(false)
                    onDateSelected(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />

            <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{isEdit ? "Edit" : "Add"} Event</Text>
                </View>

                <View style={styles.formContentContainer}>
                    <RadioGroup 
                        radioButtons={radioButtons} 
                        onPress={onPressRadioButton} 
                        containerStyle={styles.radioGroup}
                    />

                    {/* <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, padding: 10, marginTop: 10}}>
                        <Text style={{fontWeight:'500'}}>All Day</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View> */}

                    <TouchableOpacity onPress={() => { setOpen(true); setIsStart(true) }} style={styles.contentContainer}>
                        <Text style={{fontWeight:'500'}}>Starts</Text>
                        <Text style={{color: 'grey'}}>{starts}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setOpen(true); setIsStart(false) }} style={styles.contentContainer}>
                        <Text style={{fontWeight:'500'}}>Ends</Text>
                        <Text style={{color: 'grey'}}>{ends}</Text>
                    </TouchableOpacity>

                    <View style={{width: '100%', alignItems: 'center', marginVertical: 30}}>
                        <TouchableOpacity onPress={() => onSave()} style={styles.contentContainer}>
                            <Text style={{color: '#FFFFFF'}}>Save</Text>
                        </TouchableOpacity>
                        {
                            isEdit &&
                            (
                                <TouchableOpacity onPress={() => onDelete()} style={styles.contentContainer}>
                                    <Text style={{color: '#FFFFFF'}}>Delete</Text>
                                </TouchableOpacity>
                            )
                        }
                        
                        <TouchableOpacity onPress={() => setModalShow(false)} style={styles.contentContainer}>
                            <Text style={{color: '#FFFFFF'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30},
    formContainer: {paddingVertical: 10, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 10},
    titleContainer: {paddingVertical:20, alignItems: 'center'},
    title: {fontSize: 20},
    formContentContainer: {marginTop: 15, marginHorizontal: 15, borderColor: 'grey'},
    radioGroup: {flexDirection: 'row', justifyContent: 'space-around'},
    contentContainer: {width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, padding: 10, marginTop: 10}
})

export default FormEvent
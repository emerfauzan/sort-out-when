import React, {useState, useEffect, useRef} from 'react'
import { Modal, View, Text, Switch, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-big-calendar'
import RadioGroup from 'react-native-radio-buttons-group';
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import {removeEventData, resetEventData, setEventData, addEventData} from "../../redux/events"
import {resetSourceData, setSourceData} from "../../redux/sources"
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot, { captureRef } from "react-native-view-shot";
import RNCalendarEvents from "react-native-calendar-events";
import {Actions} from 'react-native-router-flux'
import uuid from 'react-native-uuid';
import _, { now } from 'lodash';
import RNFS from "react-native-fs"
import Share from "react-native-share"
import Header from "./components/header"
import Footer from "./components/footer"
import styles from './styles';
import CameraRoll from "@react-native-community/cameraroll";


const radioButtonsData = [{
    id: 'BUSY',
    label: 'BUSY',
    value: 'BUSY',
    selected: true
}, {
    id: 'PREFERRED',
    label: 'PREFERRED',
    value: 'PREFERRED'
}]

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

const index = () => {
    const events = useSelector((state) => state.eventReducer)
    const sources = useSelector((state) => state.sourcesReducer)

    const dispatch = useDispatch();

    const [isEnabled, setIsEnabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData);
    const [eventId, setEventId] = useState("");
    const [eventSource, setEventSource] = useState(null);
    const [title, setTitle] = useState("BUSY");
    const [starts, setStarts] = useState(moment().format("DD MMMM YYYY HH:mm"))
    const [ends, setEnds] = useState(moment().format("DD MMMM YYYY HH:mm"))
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [eventsLocal, setEventsLocal] = useState([])
    const [monthYear, setMonthYear] = useState("")
    const [isFetchEvent, setIsFetchEvent] = useState(false)
    const [isFetchSources, setIsFetchSources] = useState(false)
    const [isInitiated, setIsInitiated] = useState(true)
    const [isReloadingData, setIsReloadingData] = useState(false)

    const ref = useRef();

    const onPressRadioButton = (radioButtonsArray) => {
        setRadioButtons(radioButtonsArray);
        const selectedTitle = radioButtonsArray.filter((a) => {
            return a.selected == true
        })
        setTitle(selectedTitle[0].label)
        console.log(selectedTitle)
    }

    useEffect(() => {
        console.log("FIRST INIT == ", events.data)
        sources.data.length == 0 && !isFetchSources && getSources()
    }, [])

    useEffect(() => {
        !isFetchEvent && !isReloadingData && getEvents()
    }, [sources, isReloadingData])

    useEffect(() => {
        showEvent()
    }, [events])

    const showEvent = () => {
        let calendars = [null]

        setEventsLocal([])

        sources.data.forEach(source => {
            source.items.forEach(item => {
                if(item.selected){
                    calendars.push(item.id)
                }
            })
        });

        let newData = []

        calendars.forEach(calendar => {
            let a = _.filter(events.data, {source: calendar})
            a.forEach(b => {
                let exist = _.find(newData, b)
                if(exist == undefined){
                    if(!b.isDeleted){
                        newData.push(b)
                    }
                }
            })

            
        })

        setEventsLocal(newData)
        console.log("SHOWING EVENT == ", newData)
        
    }

    const getSources = async () => {
        setIsFetchSources(true)
        const data = await RNCalendarEvents.findCalendars()
        let sources = []
        for(let i=0;i<data.length;i++){

            if(index == 0){
                let sourceData = {
                    source: data[i].source,
                    items: []
                }

                sources.push(sourceData)
            } else {
                let exist = _.find(sources, {source: data[i].source})

                if(!exist){
                    let sourceData = {
                        source: data[i].source,
                        items: []
                    }
    
                    sources.push(sourceData)
                }
            }

        }

        for(let i=0;i<sources.length;i++){
            let items = []
            for(let j=0;j<data.length;j++){
                if(data[j].source == sources[i].source){
                    if(data[j].allowsModifications){
                        let item = {
                            title: data[j].title,
                            id: data[j].id,
                            selected: true
                        }
    
                        items.push(item)
                    }
                }
            }

            sources[i].items = items
        }

        await dispatch(setSourceData(sources))
        setIsFetchSources(false)

    }

    const getEvents = async () => {
        let calendars = []
        setIsFetchEvent(true)

        // let eventCalendars = await RNCalendarEvents.fetchAllEvents(new Date(2022, 4, 1, 7, 0),new Date(2022, 4, 30, 7, 0), calendars)
        // startRange = moment().startOf('week').add(1,'days').format("YYYY-MM-DD[T]HH:mm:ss.sss[Z]");
        startRange = moment().startOf('week').add(-7,'days').format("YYYY-MM-DD[T]HH:mm:ss.sss[Z]");
        endRange = moment().startOf('week').add(13,'days').format("YYYY-MM-DD[T]HH:mm:ss.sss[Z]");
        let eventCalendars = await RNCalendarEvents.fetchAllEvents(startRange,endRange, calendars)

        console.log("=== EVENT Cal ===", eventCalendars)
        console.log("=== EVENT ===", events.data)
        let newEvents = events.data
        for(let i=0;i<eventCalendars.length;i++){
            let exist = await _.find(events.data, {id: eventCalendars[i].id})
            if(exist === undefined){
                let newEvent = {
                    id: eventCalendars[i].id,
                    title: "Busy Time",
                    start: eventCalendars[i].startDate,
                    end: eventCalendars[i].endDate,
                    type: "BUSY",
                    source: eventCalendars[i].calendar.id,
                    isDeleted: false,
                    eventDetail: eventCalendars[i]
                }

                newEvents.push(newEvent)
            }

            // if(i == eventCalendars.length - 1){
            //     setIsFetchEvent(false)
            // }
        }
        await dispatch(setEventData(newEvents))

        setIsFetchEvent(false)
    }

    const onPressCell = (datetime) => {
        // newdate = moment(datetime).add(7, 'hours')
        let start = new Date(datetime)
        let end = new Date(datetime).addHours(1)
        
        setIsEdit(false)
        setStarts(moment(start).format("DD MMMM YYYY HH:mm"))
        setStartDate(start)

        setEnds(moment(end).format("DD MMMM YYYY HH:mm"))
        setEndDate(end)

        setModalShow(true)
    }

    const onPressEvent = (event) => {
        setIsEdit(true)
        let newdatestart = moment(event.start)
        let newdateend = moment(event.end)
        var newDatetimeStart = event.start
        var newDatetimeEnd = event.end
        setStarts(newdatestart.format("DD MMMM YYYY HH:mm"))

        setStartDate(newDatetimeStart)
        setEnds(newdateend.format("DD MMMM YYYY HH:mm"))

        setEndDate(newDatetimeEnd)

        setEventId(event.id)
        setEventSource(event.source)
        setTitle(event.type)

        console.log(event.type)

        if(event.type == "PREFERRED"){
            radioButtons[1].selected = true
            radioButtons[0].selected = false
        } else {
            radioButtons[0].selected = true
            radioButtons[1].selected = false
        }

        setModalShow(true)
    }

    const onDateSelected = (datetime) => {
        let newdate = moment(datetime)
        if(isStart){
            setStarts(newdate.format("DD MMMM YYYY HH:mm"))
            setStartDate(datetime)
        } else {
            setEnds(newdate.format("DD MMMM YYYY HH:mm"))
            setEndDate(datetime)
        }
        
    }

    const onSave = () => {
        let newEvent = {
            id: uuid.v4(),
            title: title == "BUSY" ? "Busy Time" : "Preferred Time",
            start: startDate,
            end: endDate,
            type: title,
            source: null,
            isDeleted: false,
            eventDetail: null
        }
        dispatch(addEventData(newEvent))
        setModalShow(false)
    }

    const onUpdate = () => {
        dispatch(removeEventData(eventId))
        let newEvent = {
            id: eventId,
            title: title == "BUSY" ? "Busy Time" : "Preferred Time",
            start: startDate,
            end: endDate,
            type: title,
            source: eventSource
        }
        dispatch(addEventData(newEvent))
        setModalShow(false)
    }

    const captureAndShareScreenshot = () => {
        ref.current.capture().then((uri) => {
            console.log(uri)
            // CameraRoll.saveToCameraRoll(uri, "photo")
            RNFS.readFile(uri, 'base64').then((res) => {
                let urlString = 'data:image/jpeg;base64,' + res;
                let options = {
                    title: 'Share Image',
                    // message: 'Share Image',
                    url: urlString,
                    type: 'image/jpeg',
                };
                Share.open(options)
                    .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
            });
        });
    };

    const reloadEvents = async () => {
        setIsReloadingData(true)
        // await dispatch(resetSourceData())
        await dispatch(resetEventData())
        setIsReloadingData(false)

    }

    const onDelete = async () => {
        // dispatch(removeEventData(eventId))
        // let event = events.data
        let event = await events.data.map(item => {
            if(item.id === eventId){
                return {...item, isDeleted: true}
            }
            return item
        })
        console.log(event)
        await dispatch(setEventData(event))
        setModalShow(false)
    }

    return (
        <View style={styles.container}>
            {/* <View style={{height: '100%', width: '100%', zIndex: 9999, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5'}}>
                <Text>TES</Text>
            </View> */}
            <ViewShot style={styles.containerShot} ref={ref} >
                <Header month={monthYear} goToSetting={() => Actions.setting()} />
                <View style={{backgroundColor: '#FFFFF1', width: '100%', alignItems: 'center', paddingVertical:7, flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{height: 5, width: 30, backgroundColor: "#36C9E3", marginRight: 5, marginLeft: 10}}></View>
                    <Text>Preferred</Text>
                    <View style={{height: 5, width: 30, backgroundColor: "#AFA9A9", marginRight: 5, marginLeft: 10}}></View>
                    <Text>Busy</Text>
                </View>
                
                <Calendar 
                    events={eventsLocal} 
                    height={600} 
                    weekStartsOn={1}
                    weekEndsOn={5}
                    mode="custom"
                    onPressCell={(datetime) => onPressCell(datetime)}
                    onPressEvent={(event) => onPressEvent(event)}
                    style={styles.calendar}
                    eventCellStyle={(a) => a.type != "PREFERRED" ? {backgroundColor: '#AFA9A9'} : {backgroundColor: '#36C9E3'} }
                    onChangeDate={(a) => {
                        b = moment(a[0]).format("MMMM YYYY")
                        setMonthYear(b)
                    }}
                    headerContainerStyle={{backgroundColor: '#FCFCFC', height: 60}}
                    bodyContainerStyle={{backgroundColor: '#FCFCFC'}}
                    renderEvent={(event, a) => {
                        return event.type == "PREFERRED" ?
                        (
                            <TouchableOpacity style={[...a.style, {borderRadius: 0, marginTop: -1}]} onPress={a.onPress}>
                            </TouchableOpacity>
                        ) 
                        : (
                            <View style={[...a.style, {borderRadius: 0, marginTop: -1}]}>
                                <TouchableOpacity onPress={a.onPress} style={{width: '100%', height: 15}}>
                                    <View style={{height: 8, width: 8, marginTop: -2, borderRadius: 4, backgroundColor: '#FFFFFF', borderColor: 'grey', borderWidth: 1}}></View>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />


                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalShow}
                    onRequestClose={() => setModalShow(false)}
                    style={{height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}
                >
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
                    <View style={{height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
                        <View style={{paddingVertical: 10, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 10}}>
                            <View style={{paddingVertical:20, alignItems: 'center'}}>
                                <Text style={{fontSize: 20}}>{isEdit ? "Edit" : "Add"} Event</Text>
                            </View>
                            <View style={{marginTop: 15, marginHorizontal: 15, borderColor: 'grey'}}>
                                <RadioGroup 
                                    radioButtons={radioButtons} 
                                    onPress={onPressRadioButton} 
                                    containerStyle={{flexDirection: 'row', justifyContent: 'space-around'}}
                                />

                                <TouchableOpacity onPress={() => { setOpen(true); setIsStart(true) }} style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, padding: 10, marginTop: 10}}>
                                    <Text style={{fontWeight:'500'}}>Starts</Text>
                                    <Text style={{color: 'grey'}}>{starts}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setOpen(true); setIsStart(false) }} style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.3, padding: 10, marginTop: 10}}>
                                    <Text style={{fontWeight:'500'}}>Ends</Text>
                                    <Text style={{color: 'grey'}}>{ends}</Text>
                                </TouchableOpacity>

                                <View style={{width: '100%', alignItems: 'center', marginVertical: 30}}>
                                    <TouchableOpacity onPress={() => {
                                        isEdit ? onUpdate() : onSave()
                                    }} style={{width: '70%', backgroundColor: '#39B0E1', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10}}>
                                        <Text style={{color: '#FFFFFF'}}>Save</Text>
                                    </TouchableOpacity>
                                    {
                                        isEdit &&
                                        (
                                            <TouchableOpacity onPress={() => onDelete()} style={{width: '70%', backgroundColor: '#C70039', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10, marginTop: 10}}>
                                                <Text style={{color: '#FFFFFF'}}>Delete</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                    
                                    <TouchableOpacity onPress={() => setModalShow(false)} style={{width: '70%', backgroundColor: '#FFC300', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10, marginVertical: 10}}>
                                        <Text style={{color: '#FFFFFF'}}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>

                            
                        </View>
                    </View>

                </Modal>
            </ViewShot>
            <Footer onCapture={captureAndShareScreenshot} onReload={reloadEvents} />
            
        </View>
        
    )
}

export default index
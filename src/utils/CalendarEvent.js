import React, {useEffect} from 'react';
import RNCalendarEvents from "react-native-calendar-events";
import { useSelector, useDispatch } from 'react-redux';

export const authorize = async () => {
    const request = await RNCalendarEvents.requestPermissions((readOnly = false));
    return request;
}

export const getCalendar = async () => {
    // const events = useSelector((state) => state.eventReducer)

    const data = await RNCalendarEvents.findCalendars();

    return data

}

export const setSource = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const calendars = getCalendar()
        console.log(calendars)
    }, [])

}
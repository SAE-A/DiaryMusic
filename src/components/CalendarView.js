import React from 'react';
import { Calendar } from 'react-native-calendars';

const CalendarView = ({ selectedDate, onDayPress }) => (
    <Calendar
        style={{ marginTop: 10, height: 320 }}
        onDayPress={onDayPress}
        markedDates={{
            [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: '#e74c3c',
            },
        }}
        theme={{
            selectedDayBackgroundColor: '#e74c3c',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#e74c3c',
            arrowColor: '#e74c3c',
            textDayFontSize: 14,
            textMonthFontSize: 16,
        }}
    />
);

export default CalendarView;
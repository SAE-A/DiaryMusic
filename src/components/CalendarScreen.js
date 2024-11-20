import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CalendarView from '../components/CalendarView';
import DateInfo from '../components/DateInfo';
import EmojiModal from '../components/EmojiModal';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [emojiData, setEmojiData] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    const emojiList = ['😊', '😎', '😴', '😂', '😍', '🥳', '🤔', '😅'];

    // 날짜를 선택할 때 호출
    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    // 이모티콘을 선택했을 때 호출
    const selectEmoji = (selectedEmoji) => {
        setEmojiData((prevData) => ({
            ...prevData,
            [selectedDate]: selectedEmoji,  // 선택한 날짜에 이모티콘 저장
        }));
        setIsModalVisible(false);  // 모달 닫기
    };

    // 선택된 날짜에 대한 정보 구성
    const getDateInfo = () => {
        const emoji = emojiData[selectedDate] || '이모티콘 없음';  // 선택된 날짜에 대한 이모티콘
        return {
            date: selectedDate || '날짜 없음',  // 날짜
            title: '제목 없음',  // 제목
            keywords: '키워드 없음',  // 키워드
            song: '추천곡 없음',  // 추천곡
            emoji,  // 이모티콘
        };
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <CalendarView selectedDate={selectedDate} onDayPress={onDayPress} />

                {/* 선택된 날짜에 대한 정보 표시 */}
                {selectedDate && (
                    <DateInfo
                        dateInfo={getDateInfo()}  // 날짜 정보 전달
                        onEmojiPress={() => setIsModalVisible(true)}  // 이모티콘 선택 모달 열기
                    />
                )}
            </ScrollView>

            <EmojiModal
                isVisible={isModalVisible}  // 모달 가시성 상태
                onClose={() => setIsModalVisible(false)}  // 모달 닫기
                onSelect={selectEmoji}  // 이모티콘 선택 함수
                emojiList={emojiList}  // 이모티콘 리스트
            />
        </View>
    );
};

export default CalendarScreen;

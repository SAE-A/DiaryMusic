import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import CalendarView from '../components/CalendarView';
import DateInfo from '../components/DateInfo';
import EmojiModal from '../components/EmojiModal';
import { ref, onValue, set } from 'firebase/database'; // Firebase 관련 함수 임포트
import { db } from './firebase'; // Firebase 설정 파일에서 db 가져오기

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [dateInfo, setDateInfo] = useState({
        date: '날짜 없음',
        title: '제목 없음',
        keywords: '키워드 없음',
        song: '추천곡 없음',
        emoji: '이모티콘 없음',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const emojiList = ['😊', '😎', '😴', '😂', '😍', '🥳', '🤔', '😅'];

    // 모든 날짜 데이터 불러오기
    useEffect(() => {
        const storiesRef = ref(db, 'dateData');
        const unsubscribe = onValue(storiesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const markedDatesData = {};

                // 데이터를 가져와 markedDates 형식으로 변환
                Object.keys(data).forEach((key) => {
                    markedDatesData[key] = {
                        marked: true,
                        dotColor: '#e74c3c', // 마킹된 날짜에 표시될 점의 색상
                    };
                });

                setMarkedDates(markedDatesData); // markedDates 업데이트
            } else {
                setMarkedDates({}); // 데이터가 없는 경우 빈 객체로 설정
            }
        });

        // 컴포넌트가 언마운트될 때 Firebase 구독 해제
        return () => unsubscribe();
    }, []);

    const onDayPress = (day) => {
        const date = day.dateString;
        setSelectedDate(date);

        // Firebase에서 해당 날짜의 데이터 불러오기
        const dbRef = ref(db, `dateData/${date}`);
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('불러온 데이터:', data); // 불러온 데이터를 콘솔에 출력해 확인
                setDateInfo({
                    date: date,
                    title: data.title || '제목 없음',        // Firebase의 title 필드 사용
                    keywords: data.tag || '키워드 없음',     // Firebase의 tag 필드를 keywords로 매칭
                    song: data.song || '추천곡 없음',    // Firebase의 content 필드를 song으로 매칭
                    emoji: data.emoji || '이모티콘 없음',    // Firebase에 emoji 필드가 없다면 기본값 설정
                });
            } else {
                console.log('해당 날짜의 데이터가 없습니다.');
                setDateInfo({
                    date: date,
                    title: '제목 없음',
                    keywords: '키워드 없음',
                    song: '추천곡 없음',
                    emoji: '이모티콘 없음',
                });
            }
        });
    };


    // 이모티콘을 선택했을 때 호출
    const selectEmoji = (selectedEmoji) => {
        if (selectedDate) {
            // Firebase에서 현재 날짜 데이터 가져오기
            const dbRef = ref(db, `dateData/${selectedDate}`);
            onValue(dbRef, (snapshot) => {
                if (snapshot.exists()) {
                    const currentData = snapshot.val();

                    // 기존 데이터를 유지하며 이모티콘만 업데이트
                    set(dbRef, {
                        ...currentData, // 기존 정보 유지
                        emoji: selectedEmoji, // 선택한 이모티콘 업데이트
                    })
                        .then(() => {
                            setDateInfo((prevInfo) => ({
                                ...prevInfo,
                                emoji: selectedEmoji,
                            }));
                            setIsModalVisible(false);
                        })
                        .catch((error) => {
                            console.error('이모티콘 저장 중 오류:', error);
                        });
                } else {
                    console.error('해당 날짜의 데이터가 없습니다.');
                }
            }, {
                onlyOnce: true,
            });
        } else {
            console.error('선택된 날짜가 없습니다.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <CalendarView
                    selectedDate={selectedDate}
                    onDayPress={onDayPress}
                    markedDates={markedDates} // Firebase에 데이터가 있는 날짜 마킹
                />

                {/* 선택된 날짜에 대한 정보 표시 */}
                {selectedDate && (
                    <DateInfo
                        dateInfo={dateInfo}  // 날짜 정보 전달
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

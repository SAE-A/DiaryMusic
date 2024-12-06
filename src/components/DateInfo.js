import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DateInfo = ({ dateInfo, onEmojiPress }) => (
    <View style={styles.infoContainer}>
        <View style={styles.dateRow}>
            <Text style={styles.dateText}>선택한 날짜: {dateInfo.date}</Text>
            <TouchableOpacity style={styles.emojiButton} onPress={onEmojiPress}>
                <Text style={styles.emojiButtonText}>Add Emoji</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>제목</Text>
            <Text style={styles.infoContent}>{dateInfo.title}</Text>
        </View>
        <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>입력한 감정</Text>
            <Text style={styles.infoContent}>{dateInfo.keywords}</Text>
        </View>
        <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>추천곡</Text>
            <Text style={styles.infoContent}>{dateInfo.song}</Text>
        </View>
        <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>선택된 이모티콘</Text>
            <Text style={styles.emojiText}>
                {dateInfo.emoji}  {/* 이모티콘이 없으면 "이모티콘 없음" 표시 */}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#ffe6f2',
        borderRadius: 10,
        marginHorizontal: 10,
    },
    dateRow: {
        flexDirection: 'row',  // 날짜와 버튼을 가로로 배치
        alignItems: 'center',  // 세로 중앙 정렬
        justifyContent: 'space-between',  // 양옆으로 공간 분배
        marginBottom: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    infoBox: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    infoLabel: {
        fontSize: 14,
        color: '#555',
    },
    infoContent: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333',
    },
    emojiText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333',
    },
    emojiButton: {
        backgroundColor: '#D10000',  // 버튼 배경색
        paddingVertical: 8,  // 세로 padding
        paddingHorizontal: 10,  // 가로 padding
        borderRadius: 8,  // 버튼 테두리 둥글게
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',  // 텍스트 색상 흰색
    },
});

export default DateInfo;

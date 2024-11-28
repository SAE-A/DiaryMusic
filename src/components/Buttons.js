import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Buttons = ({ navigation, favorites, setFavorites }) => {
    const handleButtonClick = (buttonIndex) => {
        if (buttonIndex === 1) {
            navigation.navigate('Chart', { favorites, setFavorites });
        } else if (buttonIndex === 2) {
            navigation.navigate('Story', { favorites, setFavorites });
        } else if (buttonIndex === 3) {
            navigation.navigate('Write', { favorites, setFavorites });
        } else if (buttonIndex === 4) {
            navigation.navigate('CalendarScreen', { favorites, setFavorites });
        } else if (buttonIndex === 5) {
            navigation.navigate('Inform', { favorites, setFavorites });
        } else {
            console.log(`버튼 ${buttonIndex} 클릭`);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            {["B1", "B2", "B3", "B4", "B5"].map((label, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleButtonClick(index + 1)}
                >
                    <Text style={styles.buttonText}>{label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',  // 버튼 간 간격을 일정하게 분배
        padding: 20,
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        zIndex: 100,  // 버튼이 다른 UI 요소 위에 오도록 설정
        flexWrap: 'wrap',  // 버튼들이 화면을 넘지 않도록 자동으로 줄바꿈
    },
    button: {
        backgroundColor: '#D10000',  // 어두운 빨간색
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,  // 버튼 크기를 자동으로 분배
        alignItems: 'center',
        justifyContent: 'center', // 텍스트를 가운데 정렬
        height: 50,  // 버튼 높이
        marginBottom: 5, // 버튼 간격 추가
        marginHorizontal: 2.5,  // 버튼 간 가로 간격을 10px로 설정 (왼쪽, 오른쪽 각각 5px씩)
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Buttons;
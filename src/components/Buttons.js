import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Buttons = ({ navigation, favorites }) => {
    const handleButtonClick = (buttonIndex) => {
        if (buttonIndex === 1) {
            // 버튼 1 클릭: Chart 화면으로 이동 (favorites 상태 유지)
            navigation.navigate('Chart', { favorites });
        } else if (buttonIndex === 5) {
            // 버튼 5 클릭: Inform 화면으로 이동 (favorites 상태 유지)
            navigation.navigate('Inform', { favorites });
        } else {
            console.log(`버튼 ${buttonIndex} 클릭`);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleButtonClick(index + 1)}
                >
                    <Text style={styles.buttonText}>{`B${index + 1}`}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        zIndex: 100,  // 버튼이 다른 UI 요소 위에 오도록 설정
    },
    button: {
        backgroundColor: '#D10000',  // 어두운 빨간색
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '18%', // 각 버튼의 너비
        alignItems: 'center',
        justifyContent: 'center', // 텍스트를 가운데 정렬
        height: 50,  // 버튼 높이
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Buttons;

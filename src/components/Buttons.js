import React from 'react';
<<<<<<< HEAD
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
=======
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e

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

<<<<<<< HEAD
    const images = [
        require('../../assets/icon01.png'),
        require('../../assets/icon02.png'),
        require('../../assets/icon03.png'),
        require('../../assets/icon04.png'),
        require('../../assets/icon05.png')
    ];
    const labels = ["chart", "story", "write", "diary", "inform"]; // 버튼 라벨

    return (
        <View style={styles.buttonContainer}>
            {images.map((imageSrc, index) => (
=======
    return (
        <View style={styles.buttonContainer}>
            {["B1", "B2", "B3", "B4", "B5"].map((label, index) => (
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleButtonClick(index + 1)}
                >
<<<<<<< HEAD
                    <View style={styles.buttonContent}>
                        <Image
                            source={imageSrc}
                            style={styles.buttonImage}
                        />
                        <Text style={styles.buttonLabel}>{labels[index]}</Text>
                    </View>
=======
                    <Text style={styles.buttonText}>{label}</Text>
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
<<<<<<< HEAD
        justifyContent: 'space-evenly',
        padding: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        backgroundColor: 'white',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50, // 버튼 높이
        marginBottom: 5,
        marginHorizontal: 2.5,
    },
    buttonContent: {
        alignItems: 'center',
    },
    buttonImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    buttonLabel: {
        marginTop: 5, // 이미지와 텍스트 사이 간격
=======
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
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Buttons;

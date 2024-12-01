import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

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
                <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handleButtonClick(index + 1)}
                >
                    <View style={styles.buttonContent}>
                        <Image
                            source={imageSrc}
                            style={styles.buttonImage}
                        />
                        <Text style={styles.buttonLabel}>{labels[index]}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
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
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Buttons;

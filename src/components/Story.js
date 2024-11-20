import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// 예시 데이터
const samplePosts = [
    {
        id: '1',
        title: '일상의 소소한 행복',
        content: '오늘은 노을이 정말 예뻤던 하루, 선선한 가을 날씨에 기분이 좋아졌다~',
        tag: '#행복',
        date: '2024-11-20',
        image: require('../../assets/logo.png'),
    },
    {
        id: '2',
        title: '우리 집 강아지와 함께',
        content: '오늘은 집에서 책을 읽으며 조용히 보냈다. 마음이 차분해진다.',
        tag: '#평온',
        date: '2024-11-19',
        image: require('../../assets/logo.png'),
    },
];

const Story = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : samplePosts.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < samplePosts.length - 1 ? prevIndex + 1 : 0
        );
    };

    const currentPost = samplePosts[currentIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Story</Text>

            <View style={styles.postContainer}>
                {/* 이미지와 날짜 표시 */}
                <View style={styles.imageWrapper}>
                    <Text style={styles.dateText}>{currentPost.date}</Text>
                    <Image source={currentPost.image} style={styles.postImage} />
                </View>

                {/* 텍스트 데이터 표시 */}
                <View style={styles.textContainer}>
                    <Text style={styles.postTitle}>{currentPost.title}</Text>
                    <Text style={styles.postContent}>{currentPost.content}</Text>
                    <Text style={styles.postTag}>{currentPost.tag}</Text>
                </View>
            </View>

            {/* 이전 및 다음 버튼 */}
            <View style={styles.navigation}>
                <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                    <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 35,
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
    },
    postContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom : 10,
        backgroundColor: '#ffe6f2',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
    },
    postImage: {
        width: width * 0.8,
        height: width * 0.8,
        aspectRatio: 1,
        //borderRadius: 10,
    },
    dateText: {
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'white',
        paddingVertical: 5,
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    textContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    postTag: {
        fontSize: 12,
        color: '#888',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 50,
        marginBottom: 20,
    },
    navButton: {
        backgroundColor: '#D10000',
        borderRadius: 50,
        padding: 10,
    },
});

export default Story;
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ref, set, push, onValue } from 'firebase/database';
import { db } from './firebase'; // Firebase 설정 파일 임포트

const { width } = Dimensions.get('window');

const Story = () => {
    const [posts, setPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Firebase에서 스토리 데이터 불러오기
        const storiesRef = ref(db, 'dateData');
        const unsubscribe = onValue(storiesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const loadedPosts = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setPosts(loadedPosts);
            } else {
                setPosts([]);
            }
        });

        return () => unsubscribe();
    }, []);


    const currentPost = posts[currentIndex] || {};

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : posts.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < posts.length - 1 ? prevIndex + 1 : 0
        );
    };

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
        marginBottom: 10,
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
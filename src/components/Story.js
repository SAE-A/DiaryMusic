import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { get, ref } from 'firebase/database';
import { database } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

const Story = () => {
    const [posts, setPosts] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true); 

    // Firebase 데이터 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRef = ref(database, 'posts'); 
                const snapshot = await get(postsRef); 
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Firebase 데이터는 객체 형태이므로 배열로 변환
                    const formattedPosts = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    setPosts(formattedPosts);
                } else {
                    setPosts([]); // 데이터가 없는 경우 빈 배열
                }
            } catch (error) {
                console.error('Firebase 데이터 읽기 오류:', error);
                Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

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

    // 로딩 상태 처리
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#D10000" />
            </View>
        );
    }

    // 데이터가 없을 경우 처리
    if (posts.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>My Story</Text>
                <Text style={styles.noDataText}>저장된 데이터가 없습니다.</Text>
            </View>
        );
    }

    const currentPost = posts[currentIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Story</Text>

            <View style={styles.postContainer}>
                {/* 이미지와 날짜 표시 */}
                <View style={styles.imageWrapper}>
                    <Text style={styles.dateText}>{currentPost.date}</Text>
                    {currentPost.image ? (
                        <Image source={{ uri: currentPost.image }} style={styles.postImage} />
                    ) : (
                        <View style={styles.noImagePlaceholder}>
                            <Ionicons name="image" size={50} color="gray" />
                            <Text style={styles.noImageText}>이미지 없음</Text>
                        </View>
                    )}
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
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 10,
    },
    noImagePlaceholder: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    noImageText: {
        marginTop: 10,
        fontSize: 14,
        color: 'gray',
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
    noDataText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
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

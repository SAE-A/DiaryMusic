import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ref, onValue, remove } from 'firebase/database';
import { database } from './firebase'; // 경로 확인
import { useUser } from './UserContext';

const HeartList = ({ navigation, route }) => {
    const { user } = useUser(); // 로그인한 사용자 정보 가져오기
    const [favorites, setFavorites] = useState([]);

    // Firebase 데이터 실시간 업데이트
    useEffect(() => {
        if(user){

        const dbRef = ref(database, `heartList/${user.uid}`);
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setFavorites(formattedData);
            } else {
                setFavorites([]);
            }
        });

        return () => unsubscribe();
    }
    }, [user]);

    // 하트 버튼을 눌렀을 때 해당 노래를 목록에서 삭제하는 함수
    const handleRemoveFavorite = (song) => {
        Alert.alert(
            "REMOVE",
            `${song.title} - ${song.artist} 을(를) Heart List에서 삭제하시겠습니까?`,
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭됨"),
                    style: "cancel"
                },
                {
                    text: "예",
                    onPress: async () => {
                        try {
                            const dbRef = ref(database, `heartList/${user.uid}`);
                            await remove(dbRef);  // Firebase에서 데이터 삭제
                            console.log(`${song.title} 삭제됨`);
                        } catch (error) {
                            console.error('데이터 삭제 중 오류:', error);
                        }
                    }
                }
            ]
        );
    };

    // 노래 항목 렌더링
    const renderItem = ({ item }) => (
        <View style={styles.songContainer}>
            <Text style={styles.songInfo}>{item.title} - {item.artist}</Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item)} style={styles.favoriteButton}>
                <Icon name="heart" size={30} color="red" />
            </TouchableOpacity>
        </View>
    );

    // 뒤로 가기 버튼 클릭 시 Inform.js로 돌아가기
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* 뒤로 가기 버튼 */}
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Heart List</Text>
            </View>
            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <Text style={styles.noFavorites}>No favorites yet</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',  // 버튼과 제목을 가로로 배치
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
        textAlign: 'center',  // 텍스트를 중앙에 정렬
        flex: 1,  // 제목이 남은 공간을 차지하도록 설정
    },
    backButton: {
        width: 40,  // 정사각형 사이즈
        height: 40, // 정사각형 사이즈
        backgroundColor: '#D10000',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,  // 버튼을 약간 둥글게
    },
    backButtonText: {
        color: '#fff',
        fontSize: 24,  // 글씨 크기
        fontWeight: 'bold',
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#ffe6f2',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    songInfo: {
        fontSize: 18,
        flex: 1,
    },
    favoriteButton: {
        paddingLeft: 10,
    },
    noFavorites: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
});

export default HeartList;

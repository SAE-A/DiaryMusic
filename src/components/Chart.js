import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from './firebase';
import Buttons from './Buttons';
import { useUser } from './UserContext'; // 사용자 정보 가져오기

const REALTIME_CHART_API_URL = 'https://app.genie.co.kr/chart/j_RealTimeRankSongList.json';

const Chart = ({ navigation, route }) => {
    const { user } = useUser(); // 로그인한 사용자 정보 가져오기
    const [songs, setSongs] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    // 사용자별 즐겨찾기 데이터 동기화
    useEffect(() => {
        if (user) {
            const dbRef = ref(database, `heartList/${user.uid}`);
            const unsubscribe = onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const formattedData = Object.keys(data).map((key) => ({
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

    // Genie 차트 데이터 가져오기
    useEffect(() => {
        const fetchGenieChart = async () => {
            try {
                const response = await axios.post(REALTIME_CHART_API_URL, null, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const data = response.data;
                if (data && data['Result']['RetCode'] === '0') {
                    const chartEntries = data['DataSet']['DATA'].slice(0, 10).map((item) => ({
                        id: decodeURIComponent(item['SONG_ID']), // SONG_ID를 고유 식별자로 사용
                        title: decodeURIComponent(item['SONG_NAME']),
                        artist: decodeURIComponent(item['ARTIST_NAME']),
                        rank: parseInt(item['RANK_NO'], 10),
                    }));
                    setSongs(chartEntries);
                    setLoading(false);

                    setChartData({
                        labels: chartEntries.map((song) => song.title),
                        datasets: [
                            {
                                data: chartEntries.map((song) => song.rank),
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                strokeWidth: 2,
                            },
                        ],
                    });
                } else {
                    console.error('Failed to fetch chart data');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching Genie data:', error);
                setLoading(false);
            }
        };

        fetchGenieChart();
    }, []);

    // 즐겨찾기 추가 및 삭제 함수
    const toggleFavorite = async (song) => {
        if (!song || !song.title || !song.artist) {
            console.error('유효하지 않은 song 객체:', song);
            return;
        }

        if (user) {
            const isFavorite = favorites.some((fav) => fav.id === song.id);
            Alert.alert(
                isFavorite ? 'REMOVE' : 'ADD',
                `${song.title} - ${song.artist} 을(를) Heart List에서 ${isFavorite ? '삭제' : '추가'}하시겠습니까?`,
                [
                    {
                        text: '취소',
                        style: 'cancel',
                    },
                    {
                        text: '예',
                        onPress: async () => {
                            try {
                                const dbRef = ref(database, `heartList/${user.uid}/${song.id}`);
                                if (isFavorite) {
                                    // 즐겨찾기 삭제
                                    await remove(dbRef);
                                    console.log(`${song.title} 삭제됨`);
                                } else {
                                    // 즐겨찾기 추가
                                    await set(dbRef, {
                                        title: song.title,
                                        artist: song.artist,
                                        rank: song.rank,
                                    });
                                    console.log(`${song.title} 추가됨`);
                                }
                            } catch (error) {
                                console.error('데이터 업데이트 중 오류:', error);
                            }
                        },
                    },
                ]
            );
        } else {
            Alert.alert('오류', '로그인이 필요합니다.');
        }
    };

    // 노래 항목 렌더링
    const renderItem = ({ item }) => (
        <View style={styles.songContainer}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.songInfo}>{item.title} - {item.artist}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                <Icon
                    name={favorites.some((fav) => fav.id === item.id) ? 'heart' : 'heart-o'}
                    size={30}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's CHART</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={songs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <Buttons navigation={navigation} favorites={favorites} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'left',
        justifyContent: 'flex-start',
        paddingTop: 20,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#ffe6f2',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        width: '100%',
    },
    rank: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    songInfo: {
        flex: 1,
        fontSize: 18,
    },
    favoriteButton: {
        paddingLeft: 15,
    },
    listContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});

export default Chart;

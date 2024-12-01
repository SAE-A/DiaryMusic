import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';
import Buttons from './Buttons';

const REALTIME_CHART_API_URL = 'https://app.genie.co.kr/chart/j_RealTimeRankSongList.json';

const Chart = ({ navigation, route }) => {
    const [songs, setSongs] = useState([]);
    const [favorites, setFavorites] = useState(route.params?.favorites || []);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

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
                    const chartEntries = data['DataSet']['DATA'].slice(0, 10).map((item, index) => ({
                        id: index.toString(), // Firebase에서 유니크 ID 필요
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

    // Firebase에서 favorites 상태를 동기화
    useEffect(() => {
        const dbRef = ref(db, 'heartList/');
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setFavorites(formattedData);
            } else {
                setFavorites([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleFavorite = async (song) => {
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
                        if (isFavorite) {
                            // Firebase에서 노래 제거
                            try {
                                const dbRef = ref(db, `heartList/${song.id}`);
                                await set(dbRef, null); // 해당 노래 삭제
                            } catch (error) {
                                console.error('데이터 삭제 중 오류:', error);
                            }
                        } else {
                            // Firebase에 노래 추가
                            try {
                                const dbRef = ref(db, `heartList/${song.id}`);
                                await set(dbRef, {
                                    title: song.title,
                                    artist: song.artist,
                                    rank: song.rank,
                                });
                            } catch (error) {
                                console.error('데이터 추가 중 오류:', error);
                            }
                        }
                    },
                },
=======
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Buttons from './Buttons'; // ./로 상대경로 사용

const SPOTIFY_CID = '74ef5f7562264b57bc41e40af0ebcf9d';
const SPOTIFY_SECRET = 'e77235d7c8304d0588110c4bd57c70df';

const Chart = ({ navigation, route }) => {
    const [songs, setSongs] = useState([]);
    const [favorites, setFavorites] = useState(route.params?.favorites || []); // 전달된 favorites 상태

    useEffect(() => {
        const fetchSpotifyChart = async () => {
            try {
                const authResponse = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({ grant_type: 'client_credentials' }),
                    {
                        headers: {
                            Authorization: `Basic ${btoa(`${SPOTIFY_CID}:${SPOTIFY_SECRET}`)}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                const accessToken = authResponse.data.access_token;

                const chartResponse = await axios.get(
                    'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const chartSongs = chartResponse.data.items.slice(0, 5).map((item) => ({
                    id: item.track.id,
                    title: item.track.name,
                    artist: item.track.artists.map((artist) => artist.name).join(', '),
                }));

                setSongs(chartSongs);
            } catch (error) {
                console.error('Error fetching Spotify data:', error);
            }
        };

        fetchSpotifyChart();
    }, []);

    const toggleFavorite = (song) => {
        const isFavorite = favorites.some(fav => fav.id === song.id); // 노래가 이미 즐겨찾기에 있는지 확인

        Alert.alert(
            isFavorite ? "REMOVE" : "ADD",  // 이미 즐겨찾기에 있다면 REMOVE, 아니면 ADD
            `${song.title} - ${song.artist} 을(를) Heart List에서 ${isFavorite ? "삭제" : "추가"}하시겠습니까?`,
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭됨"),
                    style: "cancel"
                },
                {
                    text: "예",
                    onPress: () => {
                        setFavorites((prevFavorites) => {
                            if (isFavorite) {
                                return prevFavorites.filter(fav => fav.id !== song.id); // 이미 즐겨찾기에 있으면 삭제
                            } else {
                                return [...prevFavorites, song]; // 아니면 즐겨찾기에 추가
                            }
                        });
                    }
                }
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.songContainer}>
<<<<<<< HEAD
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.songInfo}>{item.title} - {item.artist}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                <Icon
                    name={favorites.some((fav) => fav.id === item.id) ? 'heart' : 'heart-o'}
=======
            <Text style={styles.rank}>{songs.indexOf(item) + 1}</Text>
            <Text style={styles.songInfo}>{item.title} - {item.artist}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                <Icon
                    name={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-o'}
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
                    size={30}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's CHART</Text>
<<<<<<< HEAD
            {loading ? (
=======
            {songs.length === 0 ? (
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={songs}
                    renderItem={renderItem}
<<<<<<< HEAD
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
=======
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            {/* Buttons 컴포넌트에서 favorites 전달 */}
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
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
<<<<<<< HEAD
        paddingBottom: 100,
=======
>>>>>>> 64a14a76d252e5065827398ba5803e6e120e343e
    },
});

export default Chart;

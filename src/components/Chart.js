import React, { useState, useEffect } from 'react';
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
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.songContainer}>
            <Text style={styles.rank}>{songs.indexOf(item) + 1}</Text>
            <Text style={styles.songInfo}>{item.title} - {item.artist}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                <Icon
                    name={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-o'}
                    size={30}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's CHART</Text>
            {songs.length === 0 ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={songs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            {/* Buttons 컴포넌트에서 favorites 전달 */}
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
    },
});

export default Chart;
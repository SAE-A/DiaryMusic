import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Buffer } from 'buffer';

import { ref, set, onValue } from 'firebase/database';
import { db } from './firebase'; // Firebase 설정 파일 임포트


const { width } = Dimensions.get('window');

const API_URL = 'https://api.spotify.com/v1/search';
const SPOTIFY_CID = '74ef5f7562264b57bc41e40af0ebcf9d'; // 보안상 환경변수 사용 권장
const SPOTIFY_SECRET = 'e77235d7c8304d0588110c4bd57c70df'; // 보안상 환경변수 사용 권장

function Write({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURI, setImageURI] = useState(null);
    const [tag1, setTag1] = useState('');
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState(route.params?.favorites || []);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    'grant_type=client_credentials',
                    {
                        headers: {
                            'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CID}:${SPOTIFY_SECRET}`).toString('base64')}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                setToken(response.data.access_token);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (token && query) {
            const fetchSongs = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(API_URL, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            q: query,
                            type: 'track',
                            limit: 3,
                        },
                    });
                    setSongs(response.data.tracks.items);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };

            fetchSongs();
        }
    }, [query, token]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
            setImageURI(result.assets[0].uri);
        }
    };

    // 임시 저장 버튼 처리
    const handleSave = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            Alert.alert('SAVE', '작성한 일기가 임시 저장되었습니다.');
            setTitle('');
            setContent('');
            setTag1('');
            setImageURI(null);
        } else {
            Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
    };

    // 실제 저장 버튼 처리
    const handleSubmit = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            if (imageURI) {
                Alert.alert('SAVE', '작성한 일기가 저장되었습니다.');
            } else {
                Alert.alert('SAVE', '작성한 일기가 저장되었습니다. 이미지 없이 저장되었습니다.');
            }
            setTitle('');
            setContent('');
            setTag1('');
            setImageURI(null);
        } else {
            Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
    };
    /*
    const toggleFavorite = (song) => {
        const isFavorite = favorites.some((fav) => fav.id === song.id);
        const updatedFavorites = isFavorite
            ? favorites.filter((fav) => fav.id !== song.id)
            : [
                ...favorites,
                {
                    id: song.id,
                    title: song.name,
                    artist: song.artists.map((artist) => artist.name).join(', '),
                },
            ];

        setFavorites(updatedFavorites); // 상태 업데이트
        navigation.navigate('HeartList', { favorites: updatedFavorites }); // 업데이트된 데이터 전달
    };
    */


    // Realtime Database에서 favorites를 불러오는 useEffect 추가
    useEffect(() => {
        const fetchFavorites = () => {
            const favoritesRef = ref(db, 'heartList');
            onValue(favoritesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const fetchedFavorites = Object.values(data);
                    setFavorites(fetchedFavorites);
                } else {
                    console.log('No data available');
                }
            }, {
                onlyOnce: true,
            });
        };

        fetchFavorites();
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
                        try {
                            const dbRef = ref(db, `heartList/${song.id}`);
                            if (isFavorite) {
                                // 기존에 즐겨찾기가 있으면 삭제
                                await set(dbRef, null);
                                // 삭제 후, 상태를 갱신
                                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== song.id));
                            } else {
                                // 새로 즐겨찾기 추가
                                await set(dbRef, {
                                    id: song.id,
                                    title: song.name,
                                    artist: song.artists.map(artist => artist.name).join(', '),
                                });
                                // 추가 후 상태 업데이트
                                setFavorites((prevFavorites) => [
                                    ...prevFavorites,
                                    {
                                        id: song.id,
                                        title: song.name,
                                        artist: song.artists.map(artist => artist.name).join(', '),
                                    }
                                ]);
                            }
                        } catch (error) {
                            console.error('데이터베이스 업데이트 중 오류:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <View style={[{ marginLeft: 10 }, { marginBottom: index === songs.length - 1 ? 80 : 20 }]}>
                    <Text style={styles.songTitle}>{item.name}</Text>
                    <Text style={styles.artistName}>{item.artists.map(artist => artist.name).join(', ')}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                        <Icon
                            name={favorites.some((fav) => fav.id === item.id) ? 'heart' : 'heart-o'}
                            size={30}
                            color="red"
                        />
                    </TouchableOpacity>
                </View>
            )}
            ListHeaderComponent={
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.key}>#Keywords</Text>
                            <View style={styles.keywords}>
                                <View style={styles.buttonWrappers}>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('R&B')}>
                                        <Text style={styles.keyText}>#R&B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('hiphop')}>
                                        <Text style={styles.keyText}>#힙합</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('pop song')}>
                                        <Text style={styles.keyText}>#POP</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('kpop song')}>
                                        <Text style={styles.keyText}>#KPOP</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity><Text></Text></TouchableOpacity>
                                <View style={styles.buttonWrappers}>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('rainy day')}>
                                        <Text style={styles.keyText}>#비오는날</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('walking')}>
                                        <Text style={styles.keyText}>#산책</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('drive')}>
                                        <Text style={styles.keyText}>#드라이브</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.keys} onPress={() => setQuery('sports')}>
                                        <Text style={styles.keyText}>#운동</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* 사진 선택 */}
                            <TouchableOpacity onPress={pickImage}>
                                {imageURI ? (
                                    <Image source={{ uri: imageURI }} style={styles.image} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <MaterialIcons name="add-a-photo" size={50} color="gray" />
                                    </View>
                                )}
                            </TouchableOpacity>

                            {/* 제목 입력 */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="menu" size={24} />
                                <TextInput
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="제목을 입력하세요"
                                    keyboardType="default"
                                />
                            </View>

                            {/* 내용 입력 */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="book" size={24} />
                                <TextInput
                                    style={styles.input}
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="내용을 입력하세요"
                                    multiline={true}
                                    numberOfLines={4}
                                    keyboardType="default"
                                />
                            </View>

                            {/* 태그 입력 */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="happy" size={24} />
                                <TextInput
                                    style={styles.input}
                                    value={tag1}
                                    onChangeText={setTag1}
                                    placeholder="#감정"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="headset" size={24} />
                                <Text style={styles.input}>#추천곡</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
            ListFooterComponent={
                <View style={styles.buttonWrapper}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>임시 저장</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 15,
        justifyContent: 'flex-start',
        paddingBottom: 100,
    },
    innerContainer: {
        flex: 1,
    },
    key: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#000',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        marginBottom: 10,
        left: 10,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flex: 1,
        fontSize: 15,
    },
    imagePlaceholder: {
        width: width * 0.70,
        height: width * 0.70,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
    },
    image: {
        width: width * 0.70,
        height: width * 0.70,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3, // Android용 그림자
    },
    buttonContainer: {
        width: '48%',
    },
    button: {
        backgroundColor: '#D10000',
        paddingVertical: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    keywords: {
        borderWidth: 2,
        borderColor: '#D10000',
        borderStyle: 'dotted',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '95%',
        alignSelf: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2, // Android용 그림자
    },
    keyText: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'bold',
    },
    keys: {
        backgroundColor: '#ffe6f2',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonWrappers: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    songsContainer: {
        marginTop: 15,
    },
    songItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 5,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artistName: {
        fontSize: 14,
        color: 'gray',
    },
});

export default Write;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { ref, set } from 'firebase/database';
import { database } from './firebase'; // Firebase 설정 파일 임포트
import axios from 'axios'; // AI 추천 요청을 위한 라이브러리
import { useNavigation } from '@react-navigation/native';

const apiKey = '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';
const { width, height } = Dimensions.get('window');

const genres = [
    'Happy',
    'Sad',
    'Energetic',
    'Calm',
    'Romantic',
    'Motivational',
    'Blue',
    'Relaxing',
    'Angry'
];

function Write() {
    const navigation = useNavigation(); // React Navigation을 사용하여 페이지 간 이동
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURI, setImageURI] = useState(null);
    const [tag1, setTag1] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르 상태
    const [isPopupVisible, setIsPopupVisible] = useState(false); // 추천곡 팝업 상태
    const [recommendedSongs, setRecommendedSongs] = useState([]); // 추천된 노래 목록
    const [selectedSong, setSelectedSong] = useState(''); // 선택된 노래
    const [selectedArtist, setSelectedArtist] = useState(''); // 선택된 아티스트
    const [allGenres, setAllGenres] = useState([]);

    useEffect(() => {
        setAllGenres(genres.slice(0, 10)); // 장르 10개를 상태에 저장
    }, []);


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

    const handleGenreSelect = async (genre) => {
        setSelectedGenre(genre);
        setIsPopupVisible(true);
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4",
                    messages: [
                        {
                            role: "user",
                            content: `Suggest five popular ${genre} songs that are well-liked by Koreans. Provide the song title and artist name in the format: Song Title - Artist Name. Do not include numbers, bullet points, or quotation marks.`,
                        }
                    ],
                    max_tokens: 100,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`, // API Key가 정확한지 확인
                        'Content-Type': 'application/json',
                    },
                }
            );

            const songs = response.data.choices[0].message.content.trim().split('\n');
            setRecommendedSongs(songs);
        } catch (error) {
            if (error.response) {
                Alert.alert('오류', `AI 추천곡 요청에 실패했습니다. 오류 코드: ${error.response.status}`);
            } else {
                Alert.alert('오류', '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
            }
        }
    };

    const handleSongSelect = (song) => {
        let songTitle = song;
        let artistName = '';

        if (song.includes(' by ')) {
            const [title, artist] = song.split(' by ');
            songTitle = title;
            artistName = artist;
        }

        if (song.includes(' - ')) {
            const [title, artist] = song.split(' - ');
            songTitle = title;
            artistName = artist;
        }

        // 상태를 업데이트합니다.
        setSelectedSong(songTitle);
        setSelectedArtist(artistName);

        // 상태가 업데이트된 후에 처리해야 하는 로직은 상태가 바뀌면 자동으로 다시 렌더링됩니다.
        setIsPopupVisible(false); // 팝업을 닫음
    };

    // 하트 버튼 클릭 시 Firebase에 데이터 추가
    const handleHeartButtonPress = () => {
        if (selectedSong && selectedArtist) {
            const dbRef = ref(database, 'heartList/' + Date.now());  // 'heartList' 아래에 새로운 항목 추가
            set(dbRef, {
                title: selectedSong,
                artist: selectedArtist,
            }).then(() => {
                Alert.alert('Heart List에 추가됨', `${selectedSong} - ${selectedArtist} 이(가) Heart List에 추가되었습니다.`);
                // HeartList 페이지로 이동
                navigation.navigate('HeartList');
            }).catch(error => {
                console.error('데이터 추가 오류:', error);
                Alert.alert('오류', 'Heart List에 데이터를 추가하는 중 오류가 발생했습니다.');
            });
        } else {
            Alert.alert('선택 오류', '노래를 선택해 주세요.');
        }
    };

    const handleSave = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            Alert.alert('CANCEL', '작성한 일기가 취소되었습니다.');
            setTitle('');
            setContent('');
            setTag1('');
            setImageURI(null);
            setSelectedGenre('');
            setSelectedSong('');
        } else {
            Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
    };

    const handleSubmit = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            const date = new Date().toISOString().split('T')[0];
            const dbRef = ref(database, `dateData/${date}`);
            set(dbRef, {
                title: title,
                content: content,
                tag: tag1 || '',
                date: date,
                imageURI: imageURI || null,
                genre: selectedGenre || '장르 없음',
                song: selectedSong || '노래 없음'
            })
                .then(() => {
                    Alert.alert('저장 완료', '스토리가 저장되었습니다.');
                    setTitle('');
                    setContent('');
                    setTag1('');
                    setImageURI(null);
                    setSelectedGenre('');
                    setSelectedSong('');
                })
                .catch((error) => {
                    Alert.alert('오류 발생', `데이터 저장 중 문제가 발생했습니다: ${error.message}`);
                });
        } else {
            Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Write</Text>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {imageURI ? (
                                <Image source={{ uri: imageURI }} style={styles.image} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <MaterialIcons name="add-a-photo" size={50} color="gray" />
                                </View>
                            )}
                        </TouchableOpacity>

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

                        <View style={styles.inputContainer}>
                            <Ionicons name="happy" size={24} />
                            <TextInput
                                style={styles.input}
                                value={tag1}
                                onChangeText={setTag1}
                                placeholder="#태그"
                            />
                        </View>

                        <View style={styles.genreContainer}>
                            {allGenres.map((genre) => (
                                <TouchableOpacity
                                    key={genre}
                                    style={[styles.genreButton, selectedGenre === genre && styles.selectedGenreButton]}
                                    onPress={() => handleGenreSelect(genre)}
                                >
                                    <Text style={styles.genreButtonText}>{genre}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedSong ? (
                            <View style={styles.selectedSongContainer}>
                                <Text style={styles.selectedSongText}>추천곡: {selectedSong}</Text>
                                <TouchableOpacity style={styles.heartButton} onPress={handleHeartButtonPress}>
                                    <Icon
                                        name="heart-o"
                                        size={30}
                                        color="red"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.buttonWrapper}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>저장</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal visible={isPopupVisible} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>추천곡 - {selectedGenre}</Text>
                        <FlatList
                            data={recommendedSongs}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSongSelect(item)} style={styles.songItem}>
                                    <Text style={styles.songText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setIsPopupVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color: '#000',
        textAlign: 'center',
    },
    innerContainer: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: height * 0.02,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flex: 1,
        fontSize: 15,
    },
    image: {
        width: width * 0.70,
        height: width * 0.70,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
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
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    genreButton: {
        backgroundColor: '#ffe6f2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#D10000',
    },
    selectedGenreButton: {
        backgroundColor: 'pink',
    },
    genreButtonText: {
        color: 'gray',
        fontSize: 14,
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
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
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: width - 40,
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    songItem: {
        paddingVertical: 10,
    },
    songText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: '#D10000',
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    selectedSongContainer: {
        marginTop: 0,
    },
    selectedSongText: {
        color: '#D10000',
        textAlign: 'center',
        fontSize: 20,
        borderWidth: 2,
        borderColor: 'pink',
        borderRadius: 10,
        padding: 5,
        borderStyle: 'solid',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)', // 그림자 효과 (테두리와 결합)
    },
    heartButton: {
        marginTop: 10,
        alignItems: 'center',
    },
});

export default Write;
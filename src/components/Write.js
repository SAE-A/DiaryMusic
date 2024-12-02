import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, set } from 'firebase/database';
import { db } from './firebase'; // Firebase 설정 파일 임포트
import axios from 'axios'; // AI 추천 요청을 위한 라이브러리

const apiKey = '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';
const { width } = Dimensions.get('window');

const genres = ['Pop', 'Rock', 'Jazz', 'Hip-hop', 'Classical', 'R&B', 'Country', 'Reggae', 'Blues', 'Electronic', 'sad', 'happy', 'gloomy'];

function Write({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURI, setImageURI] = useState(null);
    const [tag1, setTag1] = useState('');
    const [randomGenres, setRandomGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르 상태
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState('');

    useEffect(() => {
        // 컴포넌트가 렌더링될 때 랜덤한 장르 8개 선택
        const shuffledGenres = genres.sort(() => 0.5 - Math.random());
        setRandomGenres(shuffledGenres.slice(0, 8));
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
        setIsPopupVisible(true); // 팝업 열기

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4",
                    messages: [
                        {
                            role: "user",
                            content: `Suggest some popular ${genre} songs.`,
                        }
                    ],
                    max_tokens: 50,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`, // API Key가 정확한지 확인
                        'Content-Type': 'application/json',
                    },
                }
            );

            // 응답을 처리하는 로직
            const songs = response.data.choices[0].message.content.trim().split('\n');
            setRecommendedSongs(songs);
        } catch (error) {
            if (error.response) {
                console.error(`API 요청 오류 (상태 코드: ${error.response.status})`, error.response.data);
                Alert.alert('오류', `AI 추천곡 요청에 실패했습니다. 오류 코드: ${error.response.status}`);
            } else {
                console.error('네트워크 오류 또는 기타 오류 발생:', error);
                Alert.alert('오류', '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
            }
        }
    };

    // 노래 선택 처리
    const handleSongSelect = (song) => {
        setSelectedSong(song);
        setIsPopupVisible(false); // 팝업 닫기
    };

    // 임시 저장 버튼 처리
    const handleSave = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            Alert.alert('SAVE', '작성한 일기가 임시 저장되었습니다.');
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

    // 실제 저장 버튼 처리
    const handleSubmit = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            // 새로운 스토리 데이터 추가
            const date = new Date().toISOString().split('T')[0]; // 현재 날짜를 YYYY-MM-DD 형식으로 저장
            const dbRef = ref(db, `dateData/${date}`); // 수정된 데이터 저장 경로

            set(dbRef, {
                title: title,
                content: content,
                tag: tag1 || '태그 없음',
                date: date,
                imageURI: imageURI || null,
                genre: selectedGenre || '장르 없음', // 선택된 장르 저장
                song: selectedSong || '노래 없음'
            })
                .then(() => {
                    console.log('데이터 저장 성공'); // 성공 시 로그 출력
                    Alert.alert('저장 완료', '스토리가 저장되었습니다.');
                    // 입력 상태 초기화
                    setTitle('');
                    setContent('');
                    setTag1('');
                    setImageURI(null);
                    setSelectedGenre('');
                    setSelectedSong('');
                })
                .catch((error) => {
                    console.error('데이터 저장 중 오류:', error); // 오류 로그 추가
                    Alert.alert('오류 발생', `데이터 저장 중 문제가 발생했습니다: ${error.message}`);
                });
        } else {
            Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
    };



    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
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
                                placeholder="#태그"
                            />
                        </View>

                        {/* 장르 선택 버튼들 */}
                        {/* 장르 선택 버튼들 */}
                        <View style={styles.genreContainer}>
                            {genres.slice(0, 5).map((genre) => (
                                <TouchableOpacity
                                    key={genre}
                                    style={[styles.genreButton, selectedGenre === genre && styles.selectedGenreButton]}
                                    onPress={() => handleGenreSelect(genre)}
                                >
                                    <Text style={styles.genreButtonText}>{genre}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* 선택된 노래 표시 */}
                        {selectedSong ? (
                            <View style={styles.selectedSongContainer}>
                                <Text style={styles.selectedSongText}>추천곡: {selectedSong}</Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableWithoutFeedback>
            </View>


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
            {/* 팝업 모달 */}
            <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>추천 {selectedGenre} 노래</Text>
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
    },
    innerContainer: {
        flex: 1,
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
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    genreButton: {
        backgroundColor: '#ffe6f2',
        padding: 10,
        borderRadius: 5,
        margin: 5,
    },
    selectedGenreButton: {
        backgroundColor: '#D10000',
    },
    genreButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    selectedSongContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    selectedSongText: {
        fontSize: 16,
        color: '#D10000',
        fontWeight: 'bold',
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
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
        marginTop: 20,
        backgroundColor: '#D10000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Write;

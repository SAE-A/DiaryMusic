import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { database, ref, push, set } from '../../firebaseConfig';

const { width } = Dimensions.get('window');

export default function Write() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageURI, setImageURI] = useState(null);
    const [tag1, setTag1] = useState('');

    // 이미지 선택 함수
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
    const handleSubmit = async () => {
        if (title.trim() !== '' && content.trim() !== '') {
          try {
            // Firebase 데이터베이스 참조 생성
            const postRef = ref(database, 'posts'); // 'posts'는 저장될 위치
            const newPostRef = push(postRef); // 새 데이터 노드 생성
    
            // 데이터 저장
            await set(newPostRef, {
              title,
              content,
              tag: tag1,
              date: new Date().toISOString(), // ISO 형식으로 날짜 저장
              image: imageURI || null, // 이미지 URI
            });
    
            Alert.alert('성공', '작성한 일기가 Firebase에 저장되었습니다.');
            setTitle('');
            setContent('');
            setTag1('');
            setImageURI(null);
          } catch (error) {
            console.error('Firebase 저장 오류:', error);
            Alert.alert('오류', '데이터 저장 중 오류가 발생했습니다.');
          }
        } else {
          Alert.alert('입력 오류', '제목과 내용은 필수 입력 항목입니다.');
        }
      };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>Write</Text>

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

                {/* 임시 저장 버튼과 저장 버튼 */}
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
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        marginBottom: 10,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
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
});
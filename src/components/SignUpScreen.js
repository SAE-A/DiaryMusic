import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Alert, View, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        // 입력값 검증
        if (!name.trim()) {
            Alert.alert('오류', '이름을 입력하세요.');
            return;
        }

        if (password.length < 4 || password.length > 14) {
            Alert.alert('오류', '비밀번호는 4자 이상, 14자 이내로 작성해야 합니다.');
            return;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,14}$/.test(password)) {
            Alert.alert('오류', '비밀번호는 영어와 숫자를 포함해야 합니다.');
            return;
        }

        try {
            // Firebase 회원가입 처리
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 이름 설정
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            Alert.alert('회원가입 성공', '계정이 성공적으로 생성되었습니다!');
            navigation.navigate('Chart'); // 회원가입 후 Chart 화면으로 이동
        } catch (error) {
            // 사용자 친화적인 오류 메시지
            let errorMessage = '오류가 발생했습니다.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = '이미 사용 중인 이메일입니다.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = '유효하지 않은 이메일 형식입니다.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = '비밀번호는 6자 이상이어야 합니다.';
            }
            Alert.alert('오류', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>JOIN</Text>
            <TextInput
                style={styles.input}
                placeholder="이름 입력"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="이메일 입력"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 입력"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>뒤로가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#D10000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    backButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            // Firebase 회원가입 처리
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('회원가입 성공', '계정이 성공적으로 생성되었습니다!');
            navigation.navigate('Chart'); // 회원가입 후 Chart 화면으로 이동
        } catch (error) {
            // Firebase 오류 메시지 처리
            Alert.alert('오류', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
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
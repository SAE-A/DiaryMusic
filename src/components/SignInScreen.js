import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore에서 데이터 가져오기
import { auth, db } from '../../firebaseConfig'; 

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fetchUserData = async (uid) => {
        try {
            const docRef = doc(db, 'user_data', uid); 
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log('사용자 데이터:', docSnap.data());
            } else {
                console.log('사용자 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('데이터 가져오기 오류:', error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            // Firebase 로그인 처리
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // 로그인된 사용자 정보
            Alert.alert('로그인 성공', '환영합니다!');
            
            // 사용자 데이터 가져오기
            await fetchUserData(user.uid);

            navigation.navigate('Chart'); // 로그인 후 Chart 화면으로 이동
        } catch (error) {
            // 오류 메시지 처리
            Alert.alert('로그인 실패', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => navigation.navigate('SignUpScreen')}
            >
                <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
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

export default SignInScreen;

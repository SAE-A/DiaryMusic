import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore에서 데이터 가져오기
import { auth, db } from './firebase';
import { useUser } from './UserContext';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();

    const fetchUserData = async (uid) => {
        try {
            const docRef = doc(db, 'users', uid); // Firestore 문서 참조
            const docSnap = await getDoc(docRef); // Firestore에서 문서 가져오기
    
            if (docSnap.exists()) {
                console.log('사용자 데이터:', docSnap.data());
            } else {
                console.log('사용자 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('데이터 가져오기 오류:', error.message);
        }
    };
    
    const validateInputs = () => {
        if (!email.trim()) {
            Alert.alert('오류', '이메일을 입력하세요.');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('오류', '유효하지 않은 이메일 형식입니다.');
            return false;
        }

        if (password.length < 4 || password.length > 14) {
            Alert.alert('오류', '비밀번호는 4자 이상, 14자 이내로 작성해야 합니다.');
            return false;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,14}$/.test(password)) {
            Alert.alert('오류', '비밀번호는 영어와 숫자를 포함해야 합니다.');
            return false;
        }

        return true;
    };

    const handleSignIn = async () => {
        if (!validateInputs()) return;
    
        try {
            // Firebase 로그인 처리
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Firestore에서 사용자 데이터 가져오기
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const userData = docSnap.data();
                Alert.alert('로그인 성공', `환영합니다, ${userData.name}!`);
                setUser({ uid: user.uid, name: userData.name, email: userData.email});
    
                // Inform 화면으로 사용자 데이터 전달
                navigation.navigate('Inform', {
                    name: userData.name,
                    email: userData.email,
                });
        
                                // 로그인 성공 시 Chart로 이동
                navigation.reset({
                    index: 0, // 초기 화면으로 설정
                    routes: [{ name: 'Chart' }], // Chart 화면을 첫 화면으로 설정
                });
                        
            } else {
                console.error("Firestore에서 사용자 데이터를 찾을 수 없습니다.");
                Alert.alert('오류', '사용자 데이터를 찾을 수 없습니다.');
            }
        } catch (error) {
            let errorMessage = '오류가 발생했습니다.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = '등록되지 않은 사용자입니다.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = '잘못된 비밀번호입니다.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = '잠시 후 다시 시도하세요.';
            }
            Alert.alert('로그인 실패', errorMessage);
            console.error('로그인 오류:', error.code, error.message);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>
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
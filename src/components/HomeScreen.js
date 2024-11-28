import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the App</Text>

            {/* 로그인 버튼 */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SignInScreen')} // 로그인 화면으로 이동
            >
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            {/* 비회원 로그인 버튼 */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Chart')} // 비회원 로그인 시 차트 화면으로 이동
            >
                <Text style={styles.buttonText}>비회원 로그인</Text>
            </TouchableOpacity>

            {/* 회원가입 버튼 */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SignUpScreen')} // 회원가입 화면으로 이동
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
        backgroundColor: '#f5f5f5', // 배경색
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#D10000', // 빨간색 배경
        padding: 15,
        marginVertical: 10,
        width: '80%', // 버튼의 너비 설정
        borderRadius: 5, // 둥근 모서리
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // 버튼 텍스트 색상
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;

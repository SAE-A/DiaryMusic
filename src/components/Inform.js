import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Buttons from './Buttons';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useUser } from './UserContext';

const Inform = ({ navigation, route }) => {
    const { user, setUser } = useUser(); // 로그인 시 전달된 데이터만 사용

    const handleSignOut = async () => {
        try {
            await signOut(auth); // Firebase 로그아웃 처리
            setUser(null); // 사용자 데이터 초기화
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }], // 로그인 화면으로 이동
            });
        } catch (error) {
            Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
            console.error('로그아웃 오류:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inform</Text>

            {/* 사용자 정보 표시 */}
            <View style={styles.inputContainer}>
                <View style={styles.pinkBox}>
                    <Text style={styles.input}>Name: {user?.name|| '정보 없음'}</Text>
                </View>
                <View style={styles.pinkBox}>
                    <Text style={styles.input}>ID: {user?.email || '정보 없음'}</Text>
                </View>
            </View>

            {/* Heart List 버튼 */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('HeartList', { favorites: route.params?.favorites })}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.buttonText}>Heart List </Text>
                    <Icon name="heart" size={24} color="#fff" />
                </View>
            </TouchableOpacity>

            {/* 로그아웃 버튼 */}
            <TouchableOpacity style={styles.LogoutButton} onPress={handleSignOut}>
                <Text style={styles.LogoutButtonText}>로그아웃</Text>
            </TouchableOpacity>

            <Buttons navigation={navigation} favorites={route.params?.favorites} />
        </View>
    );
};

const styles = StyleSheet.create({
    // 스타일 코드는 이전과 동일
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 30,
    },
    pinkBox: {
        backgroundColor: '#ffe6f2',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
        width: 250,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingLeft: 15,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D10000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    LogoutButton: {
        backgroundColor: '#D10000',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 20,
    },
    LogoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Inform;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘 사용
import Buttons from './Buttons';  // Buttons 컴포넌트 임포트

const Inform = ({ navigation, route }) => {
    const { favorites } = route.params || {};  // favorites가 없을 수도 있기 때문에 안전하게 처리
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    return (
        <View style={styles.container}>
            {/* 제목 */}
            <Text style={styles.title}>Inform</Text>

            {/* 이름과 ID 입력 */}
            <View style={styles.inputContainer}>
                <View style={styles.pinkBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.pinkBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="ID"
                        value={id}
                        onChangeText={setId}
                    />
                </View>
            </View>

            {/* Heart List 버튼 */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('HeartList', { favorites })}
            >
                <View style={styles.iconContainer}>
                    {/* FontAwesome 하트 아이콘과 텍스트를 Text 컴포넌트로 감싸기 */}
                    <Text style={styles.buttonText}>Heart List </Text>
                    <Icon name="heart" size={24} color="#fff" />
                </View>
            </TouchableOpacity>

            <Buttons navigation={navigation} favorites={favorites} />
        </View>
    );
};

const styles = StyleSheet.create({
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
    }
});

export default Inform;

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const EmojiModal = ({ isVisible, onClose, onSelect, emojiList }) => (
    <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>이모티콘 선택</Text>
                <View style={styles.emojiGrid}>
                    {emojiList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onSelect(item)}
                            style={styles.emojiOption}
                        >
                            <Text style={styles.emoji}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 250,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    emojiOption: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
    },
    emoji: {
        fontSize: 24,
    },
});

export default EmojiModal;
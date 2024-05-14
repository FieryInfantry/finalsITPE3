import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import questionsData from '../Data/questionData';
import styles from '../Styles/PracticeTestStyle';

const TimerTest = () => {
    const navigation = useNavigation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
    const [isWrongAnswer, setIsWrongAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState(Array(questionsData.length).fill(''));
    const [totalScore, setTotalScore] = useState(0);
    const [timer, setTimer] = useState(15); 

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(prevTimer => prevTimer - 1);
            } else {
                if (currentQuestionIndex === questionsData.length - 1) {
                    handlePracticeCompleted(); 
                } else {
                    handleNextQuestion();
                }
            }
        }, 1000);
    
        return () => clearInterval(interval); 
    }, [timer, currentQuestionIndex]); 
    

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            resetState();
        });

        return unsubscribeFocus;
    }, [navigation]);

    const resetState = () => {
        setTimer(15);
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setIsCorrectAnswer(false);
        setCorrectAnswer('');
        setIsWrongAnswer(false);
        setUserAnswers(Array(questionsData.length).fill(''));
        setTotalScore(0);
    };                                                 

    const resetScoreAndAnswers = () => {
        setTimer(15); 
        setTotalScore(0);
        setUserAnswer('');
        setIsCorrectAnswer(false);
        setCorrectAnswer('');
        setIsWrongAnswer(false);
        setCurrentQuestionIndex(0);
    };

    const checkAnswer = () => {
        const correctAnswerText = questionsData[currentQuestionIndex].questionAnswer;
        const userEnteredAnswer = userAnswer.trim().toLowerCase();
    
        if (userEnteredAnswer === correctAnswerText.toLowerCase()) {
            setIsCorrectAnswer(true);
            setTotalScore(totalScore + 1);
        } else {
            setIsCorrectAnswer(false);
            setIsWrongAnswer(true);
        }
    
        setUserAnswers(prevState => {
            const updatedAnswers = [...prevState];
            updatedAnswers[currentQuestionIndex] = userEnteredAnswer;
            return updatedAnswers;
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === questionsData.length - 1) {
            return; 
        }
        checkAnswer();
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setIsCorrectAnswer(false);
        setCorrectAnswer('');
        setIsWrongAnswer(false);
        setTimer(15);
    };

    const handlePracticeCompleted = () => {
        const updatedUserAnswers = [...userAnswers]; 
    updatedUserAnswers[currentQuestionIndex] = userAnswer.trim().toLowerCase();
    setUserAnswers(updatedUserAnswers); 


        checkAnswer(); 
        setUserAnswer('');
        setIsCorrectAnswer(false);
        setCorrectAnswer('');
        setIsWrongAnswer(false);
        setTimer(15);
        resetScoreAndAnswers();
        setCurrentQuestionIndex(0);
        navigation.navigate('TimerAnswer', {
            questionsData,
            userAnswers: updatedUserAnswers,
            totalScore,
        });
    };
    

    return (
        <ImageBackground
            source={require('../assets/1.png')}
            style={styles.backgroundImage} >
            <View style={styles.container}>
                {currentQuestionIndex < questionsData.length ? (
                    <View style={styles.card}>
                        <Text style={styles.questionText}>{questionsData[currentQuestionIndex].question}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setUserAnswer(text)}
                            value={userAnswer}
                            placeholder="Type your answer here..."
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            style={[styles.button, !userAnswer && styles.disabledButton]}
                            onPress={() => {
                                if (currentQuestionIndex === questionsData.length - 1) {
                                    handlePracticeCompleted();
                                } else {
                                    handleNextQuestion();
                                }
                            }}
                            disabled={!userAnswer}>
                            <Text style={styles.buttonText}>{currentQuestionIndex === questionsData.length - 1 ? 'Finish Test' : 'Next Question'}</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <Text style={styles.timerText}>Time Left: {formatTime(timer)}</Text>
            </View>
        </ImageBackground>
    );
};

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default TimerTest;

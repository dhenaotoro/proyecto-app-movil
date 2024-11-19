import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InputText } from '../../components/FormFields/InputText';
import { saveSurvey } from '../../services/Api';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Encuestas'>;
type EncuestaBotRouteProp = RouteProp<RootStackParamList, 'EncuestaBot'>;

export function EncuestaBot(): React.JSX.Element {
    const screen = 'EncuestaBot';
    const route = useRoute<EncuestaBotRouteProp>();
    const { userUuid, nombreEncuesta } = route.params;
    const navigation = useNavigation<NavigationProps>();

    const [step, setStep] = useState(0);
    const [rating, setRating] = useState<number | null>(null);
    const [recommend, setRecommend] = useState<string>('');
    const [opinion, setOpinion] = useState<string>('');

    const handleRatingSelect = (value: number) => {
        setRating(value);
        setStep(1); // Go to next step
    };

    const handleRecommendSelect = (value: string) => {
        setRecommend(value);
        setStep(2); // Go to next step
    };

    const handleOpinionChange = (value: string) => {
        setOpinion(value);
    };

    const handleSubmitSurvey = async () => {
        const surveyData = {
            uuid: userUuid,
            nombre_encuesta: nombreEncuesta,
            nivel_percepcion: rating?.toString() || '',
            recomendar_servicio: recommend,
            opinion,
        };
    
        try {
            console.log('Sending survey data:', surveyData);
            const response = await saveSurvey(surveyData);
    
            console.log('Survey successfully submitted:', response);
    
            // Navigate back to Encuestas component
            navigation.navigate('Encuestas', { userUuid });
        } catch (error) {
            console.error('Error submitting survey:', error);
        }
    };

    const renderSurveyStep = () => {
        switch (step) {
            case 0:
                return (
                    <View style={{ width: '100%'}}>
                        <Text style={styles.encuestaTitle}>Evalúanos</Text>
                        <Text style={styles.encuestaText}>
                            Entre 1 y 5, cuál es tu nivel de percepción de la atención donde 1 es mala y 5 es excelente
                        </Text>
                        <View style={styles.ratingButtonContainer}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity
                                    testID={`${screen}.Button.${value}`}
                                    key={value}
                                    style={[
                                        styles.customButton,
                                        styles.customButtonSmall, // Make the button smaller for case 0
                                        rating === value && styles.customButtonActive, // Apply active styles
                                    ]}
                                    onPress={() => handleRatingSelect(value)}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            rating === value && styles.buttonTextActive, // Apply active text styles
                                        ]}
                                    >
                                        {value}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View style={{ width: '100%'}}>
                        <Text style={styles.encuestaTitle}>Evalúanos</Text>
                        <Text style={styles.encuestaText}>¿Recomendarías el servicio prestado por tu empresa de confianza?</Text>
                        <View style={styles.radioButtonContainer}>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="Si"
                                    testID={`${screen}.Option.Yes`}
                                    status={recommend === 'Si' ? 'checked' : 'unchecked'}
                                    onPress={() => handleRecommendSelect('Si')} 
                                    color={colors.brand_violet} // Set border color
                                />
                                <Text style={styles.optionText}>Sí</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="No"
                                    testID={`${screen}.Option.No`}
                                    status={recommend === 'No' ? 'checked' : 'unchecked'}
                                    onPress={() => handleRecommendSelect('No')}
                                    color={colors.brand_violet} // Set border color
                                />
                                <Text style={styles.optionText}>No</Text>
                            </View>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.encuestaTitle}>Evalúanos</Text>
                        <Text style={styles.encuestaText}>Expresa tu opinión libremente</Text>
                        <InputText label='Descripción' required={false} multiline maxLength={255} value={opinion} onInputChange={(text: string) => handleOpinionChange(text)} testID={`${screen}.Descripcion`}/>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity disabled={opinion.length === 0} testID={`${screen}.Button`} style={styles.encuestaButton} onPress={handleSubmitSurvey}>
                                <Text style={styles.encuestaButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.encuestaContainer} testID={screen}>
            <View style={styles.encuestaContent}>
                <FlatList
                    style={{width: '100%'}}
                    data={[renderSurveyStep()]}
                    renderItem={({ item }) => <View>{item}</View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    encuestaContainer: {
        flex: 1,
        alignItems: 'center',
    },
    encuestaContent: {
        width: '90%',
        height: '70%',
        paddingHorizontal: 12,
        top: 11,
        paddingVertical: 16,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'solid',
    },
    stepContainer: {
        flex: 1,
        paddingTop: 20,
    },
    encuestaTitle: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeSmall,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
        marginBottom: 8,
    },
    encuestaText: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
        marginBottom: 16,
    },
    descriptionLabel: {
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeMedium,
        color: colors.black,
        marginBottom: 8,
    },
    bottomButton: {
        width: '100%', // Button takes full width
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.brand_green, // Set border color to brand green
        backgroundColor: colors.white,
        borderRadius: 5,
        marginTop: 'auto', // Push button to the bottom
    },
    bottomButtonActive: {
        backgroundColor: colors.brand_green,
    },
    buttonText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold', // Make text bold
        paddingHorizontal: 16, // Add padding between text and button border
    },
    buttonTextActive: {
        color: colors.white,
    },
    ratingButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    customButton: {
        borderWidth: 2,
        borderColor: colors.brand_violet,
        borderRadius: 5,
        paddingVertical: 1.5,
        paddingHorizontal: 2,
        marginHorizontal: 1,
    },
    customButtonActive: {
        backgroundColor: colors.brand_violet,
    },
    customButtonSmall: {
        paddingVertical: 1, // Smaller padding for smaller button
        paddingHorizontal: 3.5, // Smaller horizontal padding
    },
    radioButtonContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 16, // Add margin to separate from other elements
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    buttonContainer: {
        position: 'absolute',
        height: 92,
        paddingTop: 16,
        width: '100%',
        top: 350
    },
    encuestaButton: {
        marginTop: 29,
        height: 36,
        backgroundColor: colors.white,
        borderColor: colors.brand_green,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        alignItems: 'center',
        color: colors.black
    },
    encuestaButtonText: {
        marginTop: -5,
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeLarge,
        letterSpacing: typography.letterSpacingMedium,
        color: colors.black,
    },
});

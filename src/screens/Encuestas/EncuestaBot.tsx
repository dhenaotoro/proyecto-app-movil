import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type EncuestaBotRouteProp = RouteProp<RootStackParamList, 'EncuestaBot'>;

export function EncuestaBot(): React.JSX.Element {
    const route = useRoute<EncuestaBotRouteProp>();
    const { userUuid } = route.params;
    const navigation = useNavigation();

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

    const handleSubmitSurvey = () => {
        // Mock storing the information
        console.log('Survey submitted:', {
            rating,
            recommend,
            opinion,
        });

        // Navigate back to Encuestas component
        navigation.navigate('Encuestas', { userUuid });
    };

    const renderSurveyStep = () => {
        switch (step) {
            case 0:
                return (
                    <View>
                        <Text style={styles.encuestaTitle}>Evalúanos</Text>
                        <Text style={styles.encuestaText}>
                            Entre 1 y 5, cuál es tu nivel de percepción de la atención donde 1 es mala y 5 es excelente
                        </Text>
                        <View style={styles.ratingButtonContainer}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity
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
                    <View>
                        <Text style={styles.encuestaTitle}>Evalúanos</Text>
                        <Text style={styles.encuestaText}>¿Recomendarías el servicio prestado por tu empresa de confianza?</Text>
                        <View style={styles.radioButtonContainer}>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="Si"
                                    status={recommend === 'Si' ? 'checked' : 'unchecked'}
                                    onPress={() => handleRecommendSelect('Si')}
                                    color={colors.brand_violet} // Set border color
                                />
                                <Text style={styles.optionText}>Sí</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="No"
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
                        <Text style={styles.descriptionLabel}>Descripción</Text>
                        <TextInput
                            style={styles.widerTextArea}
                            placeholder="Escribe aquí..."
                            maxLength={255}
                            multiline
                            value={opinion}
                            onChangeText={handleOpinionChange}
                        />
                        <TouchableOpacity
                            style={[
                                styles.bottomButton,
                                opinion.length > 0 ? styles.bottomButtonActive : {},
                            ]}
                            onPress={handleSubmitSurvey}
                            disabled={opinion.length === 0}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    opinion.length > 0 ? styles.buttonTextActive : {},
                                ]}
                            >
                                Guardar Encuesta
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={[renderSurveyStep()]}
                renderItem={({ item }) => <View>{item}</View>}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  stepContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
      justifyContent: 'space-between', // Ensure space between elements
  },
  encuestaTitle: {
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeLarge,
      color: colors.black,
      marginBottom: 8,
  },
  encuestaText: {
      fontFamily: typography.nunitoSanzRegular,
      fontSize: typography.fontSizeSmall,
      color: colors.black,
      marginBottom: 16,
  },
  descriptionLabel: {
      fontFamily: typography.nunitoSanzBold,
      fontSize: typography.fontSizeMedium,
      color: colors.black,
      marginBottom: 8,
  },
  widerTextArea: {
      height: 120, // Increase height for more space
      borderColor: colors.brand_violet,
      borderWidth: 1,
      borderRadius: 5,
      padding: 8,
      marginBottom: 20, // Space between text area and button
      width: '100%', // Make text area wider
      textAlignVertical: 'top',
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
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
      marginBottom: 16,
  },
  customButton: {
      borderWidth: 2,
      borderColor: colors.brand_violet,
      borderRadius: 5,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 8,
  },
  customButtonActive: {
      backgroundColor: colors.brand_violet,
  },
  buttonTextActive: {
      color: colors.white,
  },
  customButtonSmall: {
      paddingVertical: 2, // Smaller padding for smaller button
      paddingHorizontal: 7, // Smaller horizontal padding
  },
  radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 16, // Add margin to separate from other elements
  },
  radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20, // Add space between radio buttons
  },
  optionText: {
      marginLeft: 8, // Adjust text spacing from radio button
      fontFamily: typography.nunitoSanzRegular,
      fontSize: typography.fontSizeMedium,
      color: colors.black,
  },
});

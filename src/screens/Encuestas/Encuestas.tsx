import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Encuestas' | 'EncuestaBot' | 'Chatbot' >;
type EncuestasRouteProp = RouteProp<RootStackParamList, 'Encuestas'>;

export function Encuestas(): React.JSX.Element {
  const screen = 'Encuestas';
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<EncuestasRouteProp>();
  const { userUuid } = route.params;
  const staticData = [
    { id: '1', description: 'Encuesta satisfacción', channel: 'Seguros Automóvil' },
    { id: '2', description: 'Encuesta atención al usuario', channel: 'Seguros Hogar' },
    { id: '3', description: 'Encuesta producto tecnología AVR', channel: 'Supermarket Ahorro' },
  ];

  const openEncuestaBot = () => navigation.navigate('EncuestaBot', { userUuid });

  const openChatbot = () => navigation.navigate('Chatbot', { userUuid });

  const SurveyRow = React.memo((survey: { key: string; value: { description: string; channel: string; } }) => (
    <View style={styles.surveyListRow}>
      <View style={styles.surveyListCell}>
        <TouchableOpacity style={styles.surveyOpenButton} onPress={openEncuestaBot} testID={`${screen}.EncuestaBot.${survey.value.description}`}>
          <View style={styles.surveyRowContainer}>
            <Text style={styles.openBulletPoint}>•</Text>
          </View>
          <Text style={styles.surveyDescription}>{survey.value.description}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.surveyListCell}>
        <Text style={styles.surveyChannel}>{survey.value.channel}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.encuestasContainer} testID={screen}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.encuestasScrollContainer}
      >
        <View style={styles.encuestasInnerContainer}>
          <Text style={styles.encuestasTitle}>Encuestas</Text>
          <View style={styles.surveyListTable}>
            {staticData.map((survey) => (
              <SurveyRow key={survey.id} value={survey} />
            ))}
          </View>
        </View>
        <View style={styles.surveyChabotContainer}>
            {<TouchableOpacity style={styles.surveyChatbot} onPress={openChatbot} testID={`${screen}.ChatbotButton`}>
              <Text style={styles.surveyBotText}>BOT</Text>
            </TouchableOpacity>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  encuestasContainer: {
    flex: 1,
    padding: 20,
  },
  encuestasScrollContainer: {
    padding: 15,
  },
  encuestasInnerContainer: {
    marginTop: 8, 
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 0.2,
    borderRadius: 4,
    borderStyle: 'solid',
    alignItems: 'center',
    height: 'auto',
    elevation: 2,
  },
  encuestasTitle: {
    marginLeft: -200,
    marginTop: 13,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYZSmall,
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeXYZSmall,
    color: colors.black,
  },
  surveyListTable: {
    marginTop: 20,
    width: '100%',
  },
  surveyListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingVertical: 5,
  },
  surveyListCell: {
    padding: 5,
    flex: 1,
    alignItems: 'flex-start',
  },
  surveyOpenButton: {
    flexDirection: 'row',
  },
  surveyRowContainer: {
    alignItems: 'center',
    width: '10%',
  },
  openBulletPoint: {
    color: colors.brand_brown,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
  },
  surveyDescription: {
    color: colors.brand_brown,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    lineHeight: typography.lineHeightSmall,
    width: '90%',
  },
  surveyChannel: {
    color: colors.black,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    lineHeight: typography.lineHeightSmall,
  },
  surveyChabotContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surveyChatbot: {
    right: 5,
    marginTop: 66,
    width: 60,
    backgroundColor: colors.brand_brown,
    borderColor: colors.brand_brown,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surveyBotText: {
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeSmall,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXXMedium,
    color: colors.white,
  }
});

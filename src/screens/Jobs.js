import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const items = [
    {
        icon: 'figma',
        label: 'Principal Designer',
        company: 'Figma',
        start: new Date(2021, 3, 1),
        end: null,
    },
    {
        icon: 'github',
        label: 'Senior Designer',
        company: 'GitHub',
        start: new Date(2017, 8, 1),
        end: new Date(2020, 12, 1),
    },
    {
        icon: 'gitlab',
        company: 'GitLab',
        label: 'Mid-level Designer',
        start: new Date(2016, 4, 1),
        end: new Date(2017, 8, 1),
    },
    {
        icon: 'twitter',
        company: 'Twitter',
        label: 'Mid-level Designer',
        start: new Date(2014, 2, 1),
        end: new Date(2016, 4, 1),
    },
    {
        icon: 'codesandbox',
        label: 'Junior Designer',
        company: 'CodeSandbox',
        start: new Date(2012, 1, 1),
        end: new Date(2013, 8, 1),
    },
    {
        icon: 'dribbble',
        label: 'Entry-level Designer',
        company: 'Dribbble',
        start: new Date(2008, 11, 1),
        end: new Date(2012, 1, 1),
    },
];

export default function Jobs() {
  const navigation = useNavigation();
  return (
        <SafeAreaView style={{ backgroundColor: '#F4EFF3' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.backBtn}>
                    <FeatherIcon color="#FD6B69" name="arrow-left" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Job Experience</Text>

                {items.map(({ icon, label, company, start, end }, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            
                            onPress={() => {
                                // handle onPress
                            }}>
                            <View style={[styles.card, { backgroundColor: '#FFF', borderRadius: 15, marginBottom: 10, padding: 3 }]}>
                                <View style={styles.cardIcon}>
                                    <FeatherIcon color="#000" name={icon} size={30} />
                                </View>

                                <View style={styles.cardDelimiter}>
                                    {index !== items.length - 1 && (
                                        <View style={styles.cardDelimiterLine} />
                                    )}

                                    <View
                                        style={[
                                            styles.cardDelimiterInset,
                                            !end && { backgroundColor: '#ffcb05' },
                                        ]} />
                                </View>

                                <View style={styles.cardBody}>
                                    <View style={styles.cardBodyContent}>
                                        <Text style={styles.cardTitle}>{label}</Text>

                                        <Text style={styles.cardSubtitle}>{company}</Text>

                                        <Text style={styles.cardDates}>{`${start.toLocaleString(
                                            'en-US',
                                            {
                                                month: 'short',
                                                year: 'numeric',
                                            },
                                        )} - ${end
                                            ? end.toLocaleString('en-US', {
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            : 'Present'
                                            }`}</Text>
                                    </View>

                                    <View style={styles.cardBodyAction}>
                                        <FeatherIcon
                                            color="#181818"
                                            name="arrow-right"
                                            size={16} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffdada',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    /** Card */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDelimiter: {
        position: 'relative',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    cardDelimiterLine: {
        position: 'absolute',
        left: 30,
        top: '50%',
        borderLeftWidth: 1,
        borderColor: '#eee',
        height: '100%',
        zIndex: 1,
    },
    cardDelimiterInset: {
        width: 12,
        height: 12,
        borderWidth: 3,
        borderRadius: 9999,
        backgroundColor: '#fff',
        borderColor: '#FD6B69',
        zIndex: 9,
        position: 'relative',
    },
    cardBody: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    cardBodyContent: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#2a2a2a',
        marginBottom: 3,
    },
    cardSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#464646',
        marginBottom: 3,
    },
    cardDates: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ababab',
    },
    cardBodyAction: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        maxWidth: 28,
        alignItems: 'flex-end',
    },
});
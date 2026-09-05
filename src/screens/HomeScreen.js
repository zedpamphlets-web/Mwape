import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize app on mount
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    try {
      // Load initial data
      // Initialize services
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassScreen colors={[colors.primary, colors.secondary]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sign Speak</Text>
          <Text style={styles.headerSubtitle}>Sign Language Translator</Text>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <View style={styles.content}>
            <GlassCard style={styles.card}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => navigation.navigate('SignCapture')}
              >
                <Ionicons name="camera" size={32} color={colors.primary} />
                <Text style={styles.featureTitle}>Capture Sign</Text>
                <Text style={styles.featureDescription}>Translate sign language to text</Text>
              </TouchableOpacity>
            </GlassCard>

            <GlassCard style={styles.card}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => navigation.navigate('Translation')}
              >
                <Ionicons name="language" size={32} color={colors.secondary} />
                <Text style={styles.featureTitle}>Translate</Text>
                <Text style={styles.featureDescription}>Text to sign language</Text>
              </TouchableOpacity>
            </GlassCard>

            <GlassCard style={styles.card}>
              <TouchableOpacity style={styles.featureButton}>
                <Ionicons name="settings" size={32} color={colors.accent} />
                <Text style={styles.featureTitle}>Settings</Text>
                <Text style={styles.featureDescription}>Customize your experience</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </GlassScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  featureButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 12,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { colors } from '../theme/colors';

const SignCaptureScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // Process the photo for sign language recognition
        // This would typically send to a backend service
        setTranscription('Recognized sign: [Example]');
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
        console.error('Camera error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.front} />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.captureButton]}
          onPress={takePicture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {transcription && (
        <GlassCard style={styles.resultCard}>
          <Text style={styles.resultLabel}>Transcription:</Text>
          <Text style={styles.resultText}>{transcription}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => {
              // Copy to clipboard
              Alert.alert('Copied', 'Transcription copied to clipboard');
            }}
          >
            <Ionicons name="copy" size={16} color={colors.primary} />
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: colors.primary,
  },
  resultCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  copyButtonText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

export default SignCaptureScreen;

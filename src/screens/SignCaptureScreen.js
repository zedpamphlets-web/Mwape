import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import { useLanguage } from '../i18n/LanguageContext';
import { recognizeFrame } from '../services/signRecognition';
import { cleanUpSentence } from '../services/textCleanup';
import { speak, stopSpeaking } from '../services/tts';
import { getAccessStatus } from '../services/subscription';
import colors from '../theme/colors';

// How long to wait, after the last recognized sign, before treating the
// sentence as finished and showing the cleaned-up version on screen.
const SILENCE_TIMEOUT_MS = 2500;

// Pause between camera captures while running. Photos fire on this beat
// regardless of whether the previous photo's AI response has come back
// yet (see MAX_IN_FLIGHT below) — that's what makes this feel live
// instead of stepping through one-at-a-time.
const CAPTURE_INTERVAL_MS = 700;

// How many recognition requests can be in flight to Gemini at once.
// Higher = feels more responsive, but burns through the free-tier
// rate limit faster and can return results out of order. 2 is a
// reasonable balance — raise it if you're on a paid tier and want it
// snappier, lower it to 1 if you're hitting rate-limit errors.
const MAX_IN_FLIGHT = 2;

export default function SignCaptureScreen() {
  const { t, code } = useLanguage();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [access, setAccess] = useState(null); // null = still checking
  const [isRunning, setIsRunning] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [transcript, setTranscript] = useState([]); // for display only
  const [lastSpoken, setLastSpoken] = useState('');

  const cameraRef = useRef(null);
  const loopRef = useRef(false);
  const transcriptRef = useRef([]); // source of truth during capture
  const silenceTimerRef = useRef(null);
  const inFlightRef = useRef(0); // how many recognizeFrame calls are pending right now

  // Re-check trial/plan status every time this tab is focused.
  useFocusEffect(
    useCallback(() => {
      getAccessStatus().then(setAccess);
    }, [])
  );

  useEffect(() => {
    return () => {
      loopRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      stopSpeaking();
    };
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  // Speaking happens the moment each sign is recognized (see runLoop) so
  // it feels live. Once signing pauses, we just tidy up the on-screen
  // sentence for readability — we don't speak it again, to avoid
  // double-narrating the same thing.
  const finalizeSentence = useCallback(async () => {
    const words = transcriptRef.current;
    if (words.length === 0) return;

    setIsCleaning(true);
    const sentence = await cleanUpSentence(words, code);
    setIsCleaning(false);

    setLastSpoken(sentence);
    transcriptRef.current = [];
    setTranscript([]);
  }, [code]);

  const scheduleFinalize = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      finalizeSentence();
    }, SILENCE_TIMEOUT_MS);
  }, [finalizeSentence]);

  // Handles one photo's recognition result whenever it comes back —
  // called independently for each in-flight request, in whatever order
  // they resolve (usually close to capture order, not guaranteed).
  const handleRecognitionResult = useCallback(
    (result) => {
      if (result && result.sign) {
        speak(result.sign, code); // live, sign by sign
        transcriptRef.current = [...transcriptRef.current, result.sign];
        setTranscript(transcriptRef.current);
        setLastSpoken('');
        scheduleFinalize();
      }
    },
    [code, scheduleFinalize]
  );

  const runLoop = useCallback(async () => {
    while (loopRef.current) {
      try {
        if (cameraRef.current && inFlightRef.current < MAX_IN_FLIGHT) {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            quality: 0.2,
            skipProcessing: true,
          });

          inFlightRef.current += 1;
          setIsBusy(true);

          // Deliberately not awaited — this is what lets the next
          // capture fire on schedule instead of waiting for Gemini.
          recognizeFrame(photo.base64)
            .then(handleRecognitionResult)
            .catch((err) => console.warn('Recognition error:', err?.message))
            .finally(() => {
              inFlightRef.current -= 1;
              if (inFlightRef.current <= 0) setIsBusy(false);
            });
        }
      } catch (err) {
        console.warn('Capture error:', err?.message);
      }

      if (!loopRef.current) break;
      await new Promise((resolve) => setTimeout(resolve, CAPTURE_INTERVAL_MS));
    }
  }, [handleRecognitionResult]);

  const toggleCapture = () => {
    if (isRunning) {
      loopRef.current = false;
      clearSilenceTimer();
      setIsRunning(false);
    } else {
      transcriptRef.current = [];
      setTranscript([]);
      setLastSpoken('');
      inFlightRef.current = 0;
      loopRef.current = true;
      setIsRunning(true);
      runLoop();
    }
  };

  const handleClear = () => {
    transcriptRef.current = [];
    setTranscript([]);
    setLastSpoken('');
    clearSilenceTimer();
    stopSpeaking();
  };

  // --- Access gate: free trial expired and no active plan -----------
  if (access && !access.hasAccess) {
    return (
      <GlassScreen style={styles.container}>
        <View style={styles.permissionBox}>
          <GlassCard>
            <Text style={styles.permissionTitle}>{t.trialEndedTitle}</Text>
            <Text style={styles.permissionBody}>{t.trialEndedBody}</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Payment')}
            >
              <Text style={styles.primaryButtonText}>{t.goToPayment}</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </GlassScreen>
    );
  }

  if (!permission || !access) {
    return <GlassScreen style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <GlassScreen style={styles.container}>
        <View style={styles.permissionBox}>
          <GlassCard>
            <Text style={styles.permissionTitle}>{t.cameraPermissionTitle}</Text>
            <Text style={styles.permissionBody}>{t.cameraPermissionBody}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
              <Text style={styles.primaryButtonText}>{t.grantPermission}</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen style={styles.container}>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
        <View style={styles.cameraBorder} pointerEvents="none" />
        {isBusy && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t.translating}</Text>
          </View>
        )}
      </View>

      <GlassCard style={styles.transcriptCard} intensity={30}>
        <ScrollView contentContainerStyle={styles.transcriptScroll}>
          {isCleaning ? (
            <Text style={styles.transcriptEmpty}>{t.cleaningUp}</Text>
          ) : transcript.length > 0 ? (
            <Text style={styles.transcriptText}>{transcript.join(' ')}</Text>
          ) : lastSpoken ? (
            <Text style={styles.lastSpokenText}>{lastSpoken}</Text>
          ) : (
            <Text style={styles.transcriptEmpty}>{t.noSignDetected}</Text>
          )}
        </ScrollView>
      </GlassCard>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.captureButton, isRunning && styles.captureButtonActive]}
          onPress={toggleCapture}
        >
          <Text style={styles.captureButtonText}>{isRunning ? '■' : '●'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleClear}>
          <Text style={styles.secondaryButtonText}>{t.clearButton}</Text>
        </TouchableOpacity>
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrap: {
    height: '42%',
    margin: 16,
    marginBottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: { flex: 1 },
  cameraBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badge: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  transcriptCard: {
    flex: 1,
    marginHorizontal: 16,
  },
  transcriptScroll: { flexGrow: 1 },
  transcriptEmpty: { color: colors.textMuted, fontSize: 15 },
  transcriptText: { color: colors.text, fontSize: 21, fontWeight: '600', lineHeight: 29 },
  lastSpokenText: { color: colors.textMuted, fontSize: 18, fontStyle: 'italic', lineHeight: 26 },
  controls: { padding: 20, paddingBottom: 110, alignItems: 'center' },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  captureButtonActive: { backgroundColor: colors.danger },
  captureButtonText: { color: colors.onGlassText, fontSize: 28 },
  secondaryButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  secondaryButtonText: { color: colors.text, fontWeight: '600' },
  permissionBox: { flex: 1, padding: 24, justifyContent: 'center' },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  permissionBody: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 21 },
  primaryButton: {
    backgroundColor: colors.text,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.onGlassText, fontSize: 16, fontWeight: '700' },
});

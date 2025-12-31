import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Camera, Image as ImageIcon, Film } from 'lucide-react-native';

const STYLES = [
  { id: 'REALISTIC', name: 'Realistic', icon: Camera },
  { id: 'ANIME', name: 'Anime', icon: ImageIcon },
  { id: 'CINEMATIC', name: 'Cinematic', icon: Film },
  { id: 'PRODUCT', name: 'Product', icon: Sparkles },
];

export default function CreateScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('REALISTIC');

  const handleGenerate = () => {
    console.log('Generating...', { prompt, selectedStyle });
    // This will triggered the API call and WebSocket listener
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Create New</Text>
          <Text style={styles.subtitle}>Turn words into art</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe your idea</Text>
          <View style={styles.inputCard}>
            <TextInput
              multiline
              placeholder="e.g. A futuristic city in the style of cyberpunk with neon lights..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={prompt}
              onChangeText={setPrompt}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stylesList}>
            {STYLES.map((style) => (
              <TouchableOpacity
                key={style.id}
                onPress={() => setSelectedStyle(style.id)}
                style={[
                  styles.styleCard,
                  selectedStyle === style.id && styles.styleCardActive,
                ]}
              >
                 <style.icon 
                    size={24} 
                    color={selectedStyle === style.id ? theme.colors.text : theme.colors.textMuted} 
                 />
                <Text style={[
                  styles.styleName,
                  selectedStyle === style.id && styles.styleNameActive
                ]}>
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.spacer} />
        
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Sparkles size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Generate Blaze</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  stylesList: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  styleCard: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  styleCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  styleName: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  styleNameActive: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  generateButton: {
    height: 60,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../src/theme';
import { Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - theme.spacing.lg * 3) / 2;

const MOCK_DATA = [
  { id: '1', url: 'https://picsum.photos/seed/1/400/600', favorite: true },
  { id: '2', url: 'https://picsum.photos/seed/2/400/400', favorite: false },
  { id: '3', url: 'https://picsum.photos/seed/3/400/500', favorite: false },
  { id: '4', url: 'https://picsum.photos/seed/4/400/700', favorite: true },
];

export default function GalleryScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.imageCard}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <TouchableOpacity style={styles.favoriteButton}>
        <Heart 
            size={18} 
            color={item.favorite ? theme.colors.accent : theme.colors.text} 
            fill={item.favorite ? theme.colors.accent : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Gallery</Text>
        <Text style={styles.count}>{MOCK_DATA.length} Images</Text>
      </View>
      
      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  count: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  imageCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.4,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

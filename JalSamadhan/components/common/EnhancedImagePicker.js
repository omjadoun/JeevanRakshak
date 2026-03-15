import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/Theme';

const EnhancedImagePicker = ({ onImageSelected, existingImage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState(null);

  React.useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    } catch (error) {
      console.log('Gallery permission check failed:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0]);
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    if (galleryPermission !== true) {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelected(result.assets[0]);
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {existingImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: existingImage.uri }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="camera" size={20} color={COLORS.surface} />
            <Text style={styles.changeButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="camera" size={40} color={COLORS.primary} />
          <Text style={styles.selectButtonText}>Add Photo Evidence</Text>
          <Text style={styles.selectButtonSubtext}>Camera or Gallery</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Photo</Text>
            
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.base,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  changeButtonText: {
    ...FONTS.body2,
    color: COLORS.surface,
    marginLeft: SIZES.base / 2,
    fontWeight: '600',
  },
  selectButton: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
  },
  selectButtonText: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SIZES.base,
  },
  selectButtonSubtext: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    width: '80%',
    ...SHADOWS.large,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: SIZES.margin,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    marginTop: SIZES.base,
  },
  cancelButtonText: {
    ...FONTS.body1,
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default EnhancedImagePicker;

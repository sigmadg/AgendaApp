/**
 * 🎯 EJEMPLO DE USO - Sistema de Assets AgendaApp
 * Demostración completa de cómo usar todos los assets en componentes
 */

import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonAvatar,
  IonBadge,
} from '@ionic/react';

// ============================================
// 📦 IMPORTACIONES DE ASSETS
// ============================================

// Sistema completo de assets
import {
  IMAGES,
  ICONS,
  FONTS,
  SOUNDS,
  CONFIG,
  audioManager,
  getCategoryIcon,
  getCategoryById,
  getThemeColors,
  applyTypography,
  playActionSound,
} from '@/assets';

// ============================================
// 🎨 COMPONENTE DE EJEMPLO
// ============================================

const AssetsExample: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState('health');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Colores del tema actual
  const themeColors = getThemeColors(theme);

  // Estilos tipográficos
  const titleStyle = applyTypography('H1');
  const cardTitleStyle = applyTypography('H3');
  const bodyStyle = applyTypography('BODY');

  // Categoría actual
  const categoryData = getCategoryById(currentCategory);

  // ============================================
  // 🎵 EFECTOS DE SONIDO
  // ============================================

  useEffect(() => {
    // Configurar audio
    audioManager.setEnabled(soundEnabled);

    // Precargar sonidos críticos
    audioManager.preloadCriticalSounds();
  }, [soundEnabled]);

  const handleButtonClick = async (sound: keyof typeof SOUNDS.ACTION_SOUNDS) => {
    if (soundEnabled) {
      await audioManager.play(SOUNDS.ACTION_SOUNDS[sound]);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    playActionSound('SEARCH');
  };

  // ============================================
  // 🎨 RENDERIZADO DEL COMPONENTE
  // ============================================

  return (
    <IonPage>
      {/* Header con logo y navegación */}
      <IonHeader>
        <IonToolbar style={{ background: themeColors.background }}>
          <IonAvatar slot="start">
            <img
              src={IMAGES.LOGOS.ICON}
              alt="Logo"
              style={{ width: '40px', height: '40px' }}
            />
          </IonAvatar>

          <IonTitle style={{ ...titleStyle, color: themeColors.text }}>
            Assets Demo
          </IonTitle>

          <IonButton
            fill="clear"
            slot="end"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <IonIcon
              icon={theme === 'light' ? ICONS.IONICONS.MOON : ICONS.IONICONS.SUNNY}
              color={themeColors.primary}
            />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ background: themeColors.background }}>
        {/* Sección de mascota */}
        <IonCard style={{
          background: themeColors.surface,
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ ...cardTitleStyle, color: themeColors.text }}>
              🐾 Mascota Interactiva
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <img
                src={IMAGES.MASCOTA.DEFAULT}
                alt="Mascota"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              />

              <div style={{ marginTop: '16px' }}>
                <IonButton
                  fill="outline"
                  onClick={() => handleButtonClick('SUCCESS')}
                  style={{ marginRight: '8px' }}
                >
                  <IonIcon icon={ICONS.IONICONS.HAPPY} slot="start" />
                  ¡Feliz!
                </IonButton>

                <IonButton
                  fill="outline"
                  color="warning"
                  onClick={() => handleButtonClick('WARNING')}
                >
                  <IonIcon icon={ICONS.IONICONS.SAD} slot="start" />
                  Triste
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Sección de categorías */}
        <IonCard style={{
          background: themeColors.surface,
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ ...cardTitleStyle, color: themeColors.text }}>
              📂 Categorías Disponibles
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList style={{ background: 'transparent' }}>
              {CONFIG.categories.slice(0, 6).map((category) => (
                <IonItem
                  key={category.id}
                  button
                  onClick={() => handleCategoryChange(category.id)}
                  style={{
                    background: currentCategory === category.id ?
                      `${category.color}15` : 'transparent',
                    borderRadius: '12px',
                    marginBottom: '8px'
                  }}
                >
                  <IonIcon
                    icon={getCategoryIcon(category.id)}
                    slot="start"
                    color={currentCategory === category.id ? category.color : themeColors.textSecondary}
                  />

                  <IonLabel>
                    <IonText style={{ ...bodyStyle, color: themeColors.text }}>
                      {category.name}
                    </IonText>
                    <p style={{
                      color: themeColors.textSecondary,
                      fontSize: FONTS.SIZES.SM,
                      margin: '4px 0 0 0'
                    }}>
                      {category.description}
                    </p>
                  </IonLabel>

                  {currentCategory === category.id && (
                    <IonBadge color="primary" slot="end">
                      Activo
                    </IonBadge>
                  )}
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Sección de elementos decorativos */}
        <IonCard style={{
          background: themeColors.surface,
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ ...cardTitleStyle, color: themeColors.text }}>
              ✨ Elementos Decorativos
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={IMAGES.DECORATIVE.SPARKLES}
                  alt="Brillos"
                  style={{ width: '40px', height: '40px' }}
                />
                <p style={{
                  ...FONTS.TYPOGRAPHY.SMALL,
                  color: themeColors.textSecondary,
                  margin: '8px 0 0 0'
                }}>
                  Brillos
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <IonIcon
                  icon={ICONS.IONICONS.HEART}
                  size="large"
                  color={themeColors.danger}
                />
                <p style={{
                  ...FONTS.TYPOGRAPHY.SMALL,
                  color: themeColors.textSecondary,
                  margin: '8px 0 0 0'
                }}>
                  Iconos
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: categoryData?.gradient,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IonIcon
                    icon={getCategoryIcon(currentCategory)}
                    color="light"
                  />
                </div>
                <p style={{
                  ...FONTS.TYPOGRAPHY.SMALL,
                  color: themeColors.textSecondary,
                  margin: '8px 0 0 0'
                }}>
                  Gradientes
                </p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Controles de audio */}
        <IonCard style={{
          background: themeColors.surface,
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ ...cardTitleStyle, color: themeColors.text }}>
              🔊 Controles de Audio
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <IonButton
                fill="outline"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <IonIcon
                  icon={soundEnabled ? ICONS.IONICONS.VOLUME_HIGH : ICONS.IONICONS.VOLUME_OFF}
                  slot="start"
                />
                {soundEnabled ? 'Desactivar' : 'Activar'} Audio
              </IonButton>

              <IonButton
                fill="outline"
                color="success"
                onClick={() => handleButtonClick('SUCCESS')}
                disabled={!soundEnabled}
              >
                <IonIcon icon={ICONS.IONICONS.CHECKMARK} slot="start" />
                Sonido de Éxito
              </IonButton>

              <IonButton
                fill="outline"
                color="danger"
                onClick={() => handleButtonClick('ERROR')}
                disabled={!soundEnabled}
              >
                <IonIcon icon={ICONS.IONICONS.CLOSE} slot="start" />
                Sonido de Error
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Información del sistema */}
        <IonCard style={{
          background: themeColors.surface,
          margin: '16px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}>
          <IonCardHeader>
            <IonCardTitle style={{ ...cardTitleStyle, color: themeColors.text }}>
              📊 Información del Sistema
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: FONTS.SIZES.SM
            }}>
              <div>
                <strong style={{ color: themeColors.primary }}>
                  Versión:
                </strong>
                <span style={{ color: themeColors.text, marginLeft: '8px' }}>
                  {CONFIG.app.version}
                </span>
              </div>

              <div>
                <strong style={{ color: themeColors.primary }}>
                  Categorías:
                </strong>
                <span style={{ color: themeColors.text, marginLeft: '8px' }}>
                  {CONFIG.categories.length}
                </span>
              </div>

              <div>
                <strong style={{ color: themeColors.primary }}>
                  Tema:
                </strong>
                <span style={{ color: themeColors.text, marginLeft: '8px' }}>
                  {theme === 'light' ? 'Claro' : 'Oscuro'}
                </span>
              </div>

              <div>
                <strong style={{ color: themeColors.primary }}>
                  Audio:
                </strong>
                <span style={{ color: themeColors.text, marginLeft: '8px' }}>
                  {soundEnabled ? 'Activado' : 'Desactivado'}
                </span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AssetsExample;

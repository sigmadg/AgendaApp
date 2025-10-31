import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
  IonBadge,
} from '@ionic/react';
import {
  language,
  book,
  mic,
  chatbox,
  add,
  close,
  checkmarkCircle,
  star,
  time,
} from 'ionicons/icons';

const Languages: React.FC = () => {
  const [activeSection, setActiveSection] = useState('progress');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showVocabularyModal, setShowVocabularyModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Estados para idiomas
  const [languages, setLanguages] = useState([
    { id: 1, name: 'Inglés', level: 'Intermedio', progress: 0.65, goal: 'Avanzado', hoursStudied: 120 },
    { id: 2, name: 'Francés', level: 'Principiante', progress: 0.25, goal: 'Intermedio', hoursStudied: 45 },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState(1);

  // Estados para lecciones
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    languageId: 1,
    type: 'Gramática',
    duration: '',
    difficulty: 'Principiante',
    completed: false,
    notes: ''
  });

  // Estados para vocabulario
  const [vocabulary, setVocabulary] = useState([]);
  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    languageId: 1,
    category: 'General',
    difficulty: 'Fácil',
    mastered: false
  });

  // Estados para metas
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    languageId: 1,
    description: '',
    targetDate: '',
    type: 'Horas de estudio',
    targetValue: '',
    currentValue: ''
  });

  const addLesson = () => {
    if (newLesson.title && newLesson.languageId) {
      setLessons([...lessons, { ...newLesson, id: Date.now() }]);
      setNewLesson({
        title: '',
        languageId: 1,
        type: 'Gramática',
        duration: '',
        difficulty: 'Principiante',
        completed: false,
        notes: ''
      });
      setShowLessonModal(false);
    }
  };

  const addWord = () => {
    if (newWord.word && newWord.translation && newWord.languageId) {
      setVocabulary([...vocabulary, { ...newWord, id: Date.now() }]);
      setNewWord({
        word: '',
        translation: '',
        languageId: 1,
        category: 'General',
        difficulty: 'Fácil',
        mastered: false
      });
      setShowVocabularyModal(false);
    }
  };

  const addGoal = () => {
    if (newGoal.description && newGoal.languageId) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({
        languageId: 1,
        description: '',
        targetDate: '',
        type: 'Horas de estudio',
        targetValue: '',
        currentValue: ''
      });
      setShowGoalModal(false);
    }
  };

  const getLanguageName = (id: number) => {
    const lang = languages.find(l => l.id === id);
    return lang ? lang.name : 'Desconocido';
  };

  const renderProgress = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={language} slot="start" />
            Mi Progreso en Idiomas
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {languages.map((language) => (
              <IonItem key={language.id}>
                <IonLabel>
                  <h3>{language.name}</h3>
                  <p>Nivel actual: {language.level}</p>
                  <p>Objetivo: {language.goal}</p>
                  <p>Horas estudiadas: {language.hoursStudied}</p>
                  <IonProgressBar
                    value={language.progress}
                    style={{ marginTop: '8px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {Math.round(language.progress * 100)}% completado
                  </p>
                </IonLabel>
                <IonChip color="primary" slot="end">
                  {language.level}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Estadísticas Generales</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={book} size="large" color="primary" />
                  <h3>165</h3>
                  <p>Horas Totales</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={star} size="large" color="warning" />
                  <h3>2</h3>
                  <p>Idiomas</p>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={checkmarkCircle} size="large" color="success" />
                  <h3>45</h3>
                  <p>Lecciones</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={mic} size="large" color="tertiary" />
                  <h3>320</h3>
                  <p>Palabras</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderLessons = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={book} slot="start" />
          Lecciones
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowLessonModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Lección
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {lessons.map((lesson: any) => (
              <IonItem key={lesson.id}>
                <IonLabel>
                  <h3>{lesson.title}</h3>
                  <p>{getLanguageName(lesson.languageId)} - {lesson.type}</p>
                  <p>Duración: {lesson.duration} min - Dificultad: {lesson.difficulty}</p>
                  {lesson.notes && <p>{lesson.notes}</p>}
                </IonLabel>
                <IonChip
                  color={lesson.completed ? 'success' : 'medium'}
                  slot="end"
                >
                  {lesson.completed ? 'Completada' : 'Pendiente'}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderVocabulary = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={chatbox} slot="start" />
          Vocabulario
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowVocabularyModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Palabra
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {vocabulary.map((word: any) => (
              <IonItem key={word.id}>
                <IonLabel>
                  <h3>{word.word}</h3>
                  <p>Traducción: {word.translation}</p>
                  <p>{getLanguageName(word.languageId)} - {word.category}</p>
                </IonLabel>
                <IonChip
                  color={
                    word.difficulty === 'Difícil' ? 'danger' :
                    word.difficulty === 'Medio' ? 'warning' : 'success'
                  }
                  slot="end"
                >
                  {word.difficulty}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderGoals = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={star} slot="start" />
          Metas de Aprendizaje
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="tertiary"
          onClick={() => setShowGoalModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Meta
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <IonList>
            {goals.map((goal: any) => (
              <IonItem key={goal.id}>
                <IonLabel>
                  <h3>{goal.description}</h3>
                  <p>{getLanguageName(goal.languageId)} - {goal.type}</p>
                  <p>Fecha límite: {goal.targetDate}</p>
                  <IonProgressBar
                    value={parseFloat(goal.currentValue) / parseFloat(goal.targetValue)}
                    style={{ marginTop: '8px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {goal.currentValue} / {goal.targetValue} {goal.type.toLowerCase()}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Idiomas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="progress">
            <IonLabel>Progreso</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="lessons">
            <IonLabel>Lecciones</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="vocabulary">
            <IonLabel>Vocabulario</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="goals">
            <IonLabel>Metas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'progress' && renderProgress()}
        {activeSection === 'lessons' && renderLessons()}
        {activeSection === 'vocabulary' && renderVocabulary()}
        {activeSection === 'goals' && renderGoals()}

        {/* Modal para nueva lección */}
        <IonModal isOpen={showLessonModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Lección</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowLessonModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Título de la Lección</IonLabel>
                <IonInput
                  value={newLesson.title}
                  placeholder="Verbos irregulares"
                  onIonChange={(e) => setNewLesson({...newLesson, title: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Idioma</IonLabel>
                <IonSelect
                  value={newLesson.languageId}
                  onSelectionChange={(e) => setNewLesson({...newLesson, languageId: e.detail.value!})}
                >
                  {languages.map((lang) => (
                    <IonSelectOption key={lang.id} value={lang.id}>
                      {lang.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Tipo de Lección</IonLabel>
                <IonSelect
                  value={newLesson.type}
                  onSelectionChange={(e) => setNewLesson({...newLesson, type: e.detail.value!})}
                >
                  <IonSelectOption value="Gramática">Gramática</IonSelectOption>
                  <IonSelectOption value="Vocabulario">Vocabulario</IonSelectOption>
                  <IonSelectOption value="Conversación">Conversación</IonSelectOption>
                  <IonSelectOption value="Lectura">Lectura</IonSelectOption>
                  <IonSelectOption value="Escritura">Escritura</IonSelectOption>
                  <IonSelectOption value="Listening">Listening</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Duración (minutos)</IonLabel>
                <IonInput
                  type="number"
                  value={newLesson.duration}
                  placeholder="45"
                  onIonChange={(e) => setNewLesson({...newLesson, duration: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Dificultad</IonLabel>
                <IonSelect
                  value={newLesson.difficulty}
                  onSelectionChange={(e) => setNewLesson({...newLesson, difficulty: e.detail.value!})}
                >
                  <IonSelectOption value="Principiante">Principiante</IonSelectOption>
                  <IonSelectOption value="Intermedio">Intermedio</IonSelectOption>
                  <IonSelectOption value="Avanzado">Avanzado</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notas</IonLabel>
                <IonTextarea
                  value={newLesson.notes}
                  placeholder="Notas sobre la lección..."
                  rows={2}
                  onIonChange={(e) => setNewLesson({...newLesson, notes: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addLesson}
            >
              Agregar Lección
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva palabra */}
        <IonModal isOpen={showVocabularyModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Palabra</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowVocabularyModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Palabra</IonLabel>
                <IonInput
                  value={newWord.word}
                  placeholder="Hello"
                  onIonChange={(e) => setNewWord({...newWord, word: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Traducción</IonLabel>
                <IonInput
                  value={newWord.translation}
                  placeholder="Hola"
                  onIonChange={(e) => setNewWord({...newWord, translation: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Idioma</IonLabel>
                <IonSelect
                  value={newWord.languageId}
                  onSelectionChange={(e) => setNewWord({...newWord, languageId: e.detail.value!})}
                >
                  {languages.map((lang) => (
                    <IonSelectOption key={lang.id} value={lang.id}>
                      {lang.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Categoría</IonLabel>
                <IonSelect
                  value={newWord.category}
                  onSelectionChange={(e) => setNewWord({...newWord, category: e.detail.value!})}
                >
                  <IonSelectOption value="General">General</IonSelectOption>
                  <IonSelectOption value="Comida">Comida</IonSelectOption>
                  <IonSelectOption value="Familia">Familia</IonSelectOption>
                  <IonSelectOption value="Trabajo">Trabajo</IonSelectOption>
                  <IonSelectOption value="Viajes">Viajes</IonSelectOption>
                  <IonSelectOption value="Emociones">Emociones</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Dificultad</IonLabel>
                <IonSelect
                  value={newWord.difficulty}
                  onSelectionChange={(e) => setNewWord({...newWord, difficulty: e.detail.value!})}
                >
                  <IonSelectOption value="Fácil">Fácil</IonSelectOption>
                  <IonSelectOption value="Medio">Medio</IonSelectOption>
                  <IonSelectOption value="Difícil">Difícil</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addWord}
            >
              Agregar Palabra
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva meta */}
        <IonModal isOpen={showGoalModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Meta</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowGoalModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Descripción de la Meta</IonLabel>
                <IonInput
                  value={newGoal.description}
                  placeholder="Completar curso básico de inglés"
                  onIonChange={(e) => setNewGoal({...newGoal, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Idioma</IonLabel>
                <IonSelect
                  value={newGoal.languageId}
                  onSelectionChange={(e) => setNewGoal({...newGoal, languageId: e.detail.value!})}
                >
                  {languages.map((lang) => (
                    <IonSelectOption key={lang.id} value={lang.id}>
                      {lang.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Tipo de Meta</IonLabel>
                <IonSelect
                  value={newGoal.type}
                  onSelectionChange={(e) => setNewGoal({...newGoal, type: e.detail.value!})}
                >
                  <IonSelectOption value="Horas de estudio">Horas de estudio</IonSelectOption>
                  <IonSelectOption value="Lecciones completadas">Lecciones completadas</IonSelectOption>
                  <IonSelectOption value="Palabras aprendidas">Palabras aprendidas</IonSelectOption>
                  <IonSelectOption value="Exámenes aprobados">Exámenes aprobados</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Valor Objetivo</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.targetValue}
                  placeholder="100"
                  onIonChange={(e) => setNewGoal({...newGoal, targetValue: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Valor Actual</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.currentValue}
                  placeholder="25"
                  onIonChange={(e) => setNewGoal({...newGoal, currentValue: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha Límite</IonLabel>
                <IonInput
                  type="date"
                  value={newGoal.targetDate}
                  onIonChange={(e) => setNewGoal({...newGoal, targetDate: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addGoal}
            >
              Crear Meta
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Languages;

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
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
} from '@ionic/react';
import {
  wallet,
  trendingUp,
  trendingDown,
  add,
  close,
  cash,
  card,
} from 'ionicons/icons';

const Finance: React.FC = () => {
  const [activeSection, setActiveSection] = useState('budget');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Estados para ingresos
  const [incomes, setIncomes] = useState([]);
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: '',
    category: 'Salario',
    date: '',
    recurring: false
  });

  // Estados para gastos
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Alimentación',
    date: '',
    paymentMethod: 'Efectivo'
  });

  // Estados para metas financieras
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Ahorro'
  });

  const addIncome = () => {
    if (newIncome.description && newIncome.amount) {
      setIncomes([...incomes, { ...newIncome, id: Date.now() }]);
      setNewIncome({
        description: '',
        amount: '',
        category: 'Salario',
        date: '',
        recurring: false
      });
      setShowIncomeModal(false);
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Alimentación',
        date: '',
        paymentMethod: 'Efectivo'
      });
      setShowExpenseModal(false);
    }
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: 'Ahorro'
      });
      setShowGoalModal(false);
    }
  };

  const renderBudget = () => (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Resumen Financiero</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <div style={{ textAlign: 'center', color: 'green' }}>
                  <IonIcon icon={trendingUp} size="large" />
                  <h3>Ingresos Totales</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$5,000</p>
                </div>
              </IonCol>
              <IonCol size="6">
                <div style={{ textAlign: 'center', color: 'red' }}>
                  <IonIcon icon={trendingDown} size="large" />
                  <h3>Gastos Totales</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$3,200</p>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <div style={{ textAlign: 'center', color: 'blue' }}>
                  <IonIcon icon={wallet} size="large" />
                  <h3>Balance</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$1,800</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Acciones Rápidas</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => setShowIncomeModal(true)}
                >
                  <IonIcon icon={add} slot="start" />
                  Ingreso
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton
                  expand="block"
                  color="danger"
                  onClick={() => setShowExpenseModal(true)}
                >
                  <IonIcon icon={add} slot="start" />
                  Gasto
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );

  const renderIncomes = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={trendingUp} slot="start" />
          Ingresos
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="success"
          onClick={() => setShowIncomeModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Ingreso
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Historial de Ingresos</h3>
          <IonList>
            {incomes.map((income: any) => (
              <IonItem key={income.id}>
                <IonLabel>
                  <h3>{income.description}</h3>
                  <p>{income.category} - {income.date}</p>
                </IonLabel>
                <IonChip color="success" slot="end">
                  +${income.amount}
                </IonChip>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderExpenses = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={trendingDown} slot="start" />
          Gastos
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="danger"
          onClick={() => setShowExpenseModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Agregar Gasto
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Historial de Gastos</h3>
          <IonList>
            {expenses.map((expense: any) => (
              <IonItem key={expense.id}>
                <IonLabel>
                  <h3>{expense.description}</h3>
                  <p>{expense.category} - {expense.date}</p>
                </IonLabel>
                <IonChip color="danger" slot="end">
                  -${expense.amount}
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
          <IonIcon icon={wallet} slot="start" />
          Metas Financieras
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setShowGoalModal(true)}
        >
          <IonIcon icon={add} slot="start" />
          Nueva Meta
        </IonButton>

        <div style={{ marginTop: '20px' }}>
          <h3>Mis Metas</h3>
          <IonList>
            {goals.map((goal: any) => (
              <IonItem key={goal.id}>
                <IonLabel>
                  <h3>{goal.name}</h3>
                  <p>{goal.category} - Meta: ${goal.targetAmount}</p>
                  <p>Actual: ${goal.currentAmount} - Fecha límite: {goal.deadline}</p>
                </IonLabel>
                <IonChip
                  color="primary"
                  slot="end"
                >
                  {Math.round((parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100)}%
                </IonChip>
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
          <IonTitle>Finanzas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSegment
          value={activeSection}
          onIonChange={(e) => setActiveSection(e.detail.value!)}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="budget">
            <IonLabel>Presupuesto</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="incomes">
            <IonLabel>Ingresos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="expenses">
            <IonLabel>Gastos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="goals">
            <IonLabel>Metas</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSection === 'budget' && renderBudget()}
        {activeSection === 'incomes' && renderIncomes()}
        {activeSection === 'expenses' && renderExpenses()}
        {activeSection === 'goals' && renderGoals()}

        {/* Modal para agregar ingreso */}
        <IonModal isOpen={showIncomeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Ingreso</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowIncomeModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonInput
                  value={newIncome.description}
                  placeholder="Salario mensual"
                  onIonChange={(e) => setNewIncome({...newIncome, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Monto</IonLabel>
                <IonInput
                  type="number"
                  value={newIncome.amount}
                  placeholder="5000"
                  onIonChange={(e) => setNewIncome({...newIncome, amount: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Categoría</IonLabel>
                <IonInput
                  value={newIncome.category}
                  placeholder="Salario"
                  onIonChange={(e) => setNewIncome({...newIncome, category: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newIncome.date}
                  onIonChange={(e) => setNewIncome({...newIncome, date: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addIncome}
            >
              Agregar Ingreso
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para agregar gasto */}
        <IonModal isOpen={showExpenseModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Gasto</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowExpenseModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Descripción</IonLabel>
                <IonInput
                  value={newExpense.description}
                  placeholder="Compra en supermercado"
                  onIonChange={(e) => setNewExpense({...newExpense, description: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Monto</IonLabel>
                <IonInput
                  type="number"
                  value={newExpense.amount}
                  placeholder="150"
                  onIonChange={(e) => setNewExpense({...newExpense, amount: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Categoría</IonLabel>
                <IonInput
                  value={newExpense.category}
                  placeholder="Alimentación"
                  onIonChange={(e) => setNewExpense({...newExpense, category: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha</IonLabel>
                <IonInput
                  type="date"
                  value={newExpense.date}
                  onIonChange={(e) => setNewExpense({...newExpense, date: e.detail.value!})}
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="block"
              style={{ margin: '20px' }}
              onClick={addExpense}
            >
              Agregar Gasto
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para nueva meta financiera */}
        <IonModal isOpen={showGoalModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Meta Financiera</IonTitle>
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
                <IonLabel position="stacked">Nombre de la Meta</IonLabel>
                <IonInput
                  value={newGoal.name}
                  placeholder="Vacaciones 2024"
                  onIonChange={(e) => setNewGoal({...newGoal, name: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Monto Objetivo</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.targetAmount}
                  placeholder="5000"
                  onIonChange={(e) => setNewGoal({...newGoal, targetAmount: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Monto Actual</IonLabel>
                <IonInput
                  type="number"
                  value={newGoal.currentAmount}
                  placeholder="1200"
                  onIonChange={(e) => setNewGoal({...newGoal, currentAmount: e.detail.value!})}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Fecha Límite</IonLabel>
                <IonInput
                  type="date"
                  value={newGoal.deadline}
                  onIonChange={(e) => setNewGoal({...newGoal, deadline: e.detail.value!})}
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

export default Finance;

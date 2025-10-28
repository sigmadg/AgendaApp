import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ElegantSubsectionTabs } from './shared';

const FinanceSections = () => {
  const [activeSection, setActiveSection] = useState('budget-tracker');
  
  // Estados para Budget Tracker
  const [budgetTracker, setBudgetTracker] = useState({
    monthlyBudget: '',
    categories: [
      { id: 1, name: 'Alimentación', budget: '', spent: '', remaining: '' },
      { id: 2, name: 'Transporte', budget: '', spent: '', remaining: '' },
      { id: 3, name: 'Entretenimiento', budget: '', spent: '', remaining: '' },
      { id: 4, name: 'Servicios', budget: '', spent: '', remaining: '' },
      { id: 5, name: 'Salud', budget: '', spent: '', remaining: '' },
      { id: 6, name: 'Otros', budget: '', spent: '', remaining: '' }
    ]
  });

  // Estados para Expense Tracker
  const [expenseTracker, setExpenseTracker] = useState({
    expenses: [
      { id: 1, date: '', description: '', category: '', amount: '', paymentMethod: '' },
      { id: 2, date: '', description: '', category: '', amount: '', paymentMethod: '' },
      { id: 3, date: '', description: '', category: '', amount: '', paymentMethod: '' },
      { id: 4, date: '', description: '', category: '', amount: '', paymentMethod: '' },
      { id: 5, date: '', description: '', category: '', amount: '', paymentMethod: '' }
    ],
    totalExpenses: 0
  });

  // Estados para Credit Card Manager
  const [creditCardManager, setCreditCardManager] = useState({
    cards: [
      { id: 1, name: '', bank: '', limit: '', balance: '', dueDate: '', minPayment: '' },
      { id: 2, name: '', bank: '', limit: '', balance: '', dueDate: '', minPayment: '' }
    ]
  });

  // Estados para Bill Tracker
  const [billTracker, setBillTracker] = useState({
    bills: [
      { id: 1, name: '', amount: '', dueDate: '', status: 'pending', category: '' },
      { id: 2, name: '', amount: '', dueDate: '', status: 'pending', category: '' },
      { id: 3, name: '', amount: '', dueDate: '', status: 'pending', category: '' },
      { id: 4, name: '', amount: '', dueDate: '', status: 'pending', category: '' },
      { id: 5, name: '', amount: '', dueDate: '', status: 'pending', category: '' }
    ]
  });

  // Estados para Investment Tracker
  const [investmentTracker, setInvestmentTracker] = useState({
    investments: [
      { id: 1, name: '', type: '', amount: '', currentValue: '', profit: '', date: '' },
      { id: 2, name: '', type: '', amount: '', currentValue: '', profit: '', date: '' },
      { id: 3, name: '', type: '', amount: '', currentValue: '', profit: '', date: '' }
    ]
  });

  // Estados para Savings Goals
  const [savingsGoals, setSavingsGoals] = useState({
    goals: [
      { id: 1, name: '', targetAmount: '', currentAmount: '', deadline: '', progress: 0 },
      { id: 2, name: '', targetAmount: '', currentAmount: '', deadline: '', progress: 0 },
      { id: 3, name: '', targetAmount: '', currentAmount: '', deadline: '', progress: 0 }
    ]
  });

  // Estados para Lista de Compras
  const [marketList, setMarketList] = useState({
    fruits: [],
    vegetables: [],
    dairy: [],
    meat: [],
    grains: [],
    snacks: []
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const mealCategories = [
    { id: 'fruits', name: 'Frutas', icon: '🍎' },
    { id: 'vegetables', name: 'Verduras', icon: '🥬' },
    { id: 'dairy', name: 'Lácteos', icon: '🥛' },
    { id: 'meat', name: 'Carnes', icon: '🥩' },
    { id: 'grains', name: 'Granos', icon: '🌾' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' }
  ];

  const sections = [
    { id: 'budget-tracker', name: 'Seguimiento de Presupuesto', icon: 'wallet-outline' },
    { id: 'expense-tracker', name: 'Seguimiento de Gastos', icon: 'receipt-outline' },
    { id: 'credit-card-manager', name: 'Gestor de Tarjetas', icon: 'card-outline' },
    { id: 'bill-tracker', name: 'Seguimiento de Facturas', icon: 'document-text-outline' },
    { id: 'investment-tracker', name: 'Seguimiento de Inversiones', icon: 'trending-up-outline' },
    { id: 'savings-goals', name: 'Objetivos de Ahorro', icon: 'piggy-bank-outline' },
    { id: 'shopping-list', name: 'Lista de Compras', icon: 'list-outline' }
  ];


  const updateBudgetCategory = (categoryId, field, value) => {
    setBudgetTracker(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.id === categoryId ? { ...category, [field]: value } : category
      )
    }));
  };

  const updateExpense = (expenseId, field, value) => {
    setExpenseTracker(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === expenseId ? { ...expense, [field]: value } : expense
      )
    }));
  };

  const updateCreditCard = (cardId, field, value) => {
    setCreditCardManager(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  const updateBill = (billId, field, value) => {
    setBillTracker(prev => ({
      ...prev,
      bills: prev.bills.map(bill =>
        bill.id === billId ? { ...bill, [field]: value } : bill
      )
    }));
  };

  const updateInvestment = (investmentId, field, value) => {
    setInvestmentTracker(prev => ({
      ...prev,
      investments: prev.investments.map(investment =>
        investment.id === investmentId ? { ...investment, [field]: value } : investment
      )
    }));
  };

  const updateSavingsGoal = (goalId, field, value) => {
    setSavingsGoals(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const toggleBillStatus = (billId) => {
    setBillTracker(prev => ({
      ...prev,
      bills: prev.bills.map(bill =>
        bill.id === billId 
          ? { ...bill, status: bill.status === 'paid' ? 'pending' : 'paid' }
          : bill
      )
    }));
  };

  // Funciones para Lista de Compras
  const openAddItemModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setNewItemText('');
    setNewItemQuantity(1);
    setShowAddItemModal(true);
  };

  const closeAddItemModal = () => {
    setShowAddItemModal(false);
    setSelectedCategory('');
    setNewItemText('');
    setNewItemQuantity(1);
  };

  const addItem = () => {
    if (newItemText.trim() && selectedCategory) {
      const newItem = {
        id: Date.now(),
        name: newItemText.trim(),
        quantity: newItemQuantity,
        purchased: false
      };
      setMarketList({
        ...marketList,
        [selectedCategory]: [...marketList[selectedCategory], newItem]
      });
      closeAddItemModal();
    }
  };

  const toggleItemPurchased = (categoryId, itemId) => {
    setMarketList({
      ...marketList,
      [categoryId]: marketList[categoryId].map(item => 
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    });
  };

  const removeItem = (categoryId, itemId) => {
    setMarketList({
      ...marketList,
      [categoryId]: marketList[categoryId].filter(item => item.id !== itemId)
    });
  };

  const renderBudgetTracker = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.budgetHeader}>
        <View style={styles.budgetHeaderContent}>
          <View style={styles.budgetIconContainer}>
            <Icon name="wallet-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.budgetHeaderText}>
            <Text style={styles.budgetHeaderTitle}>Seguimiento de Presupuesto</Text>
            <Text style={styles.budgetHeaderSubtitle}>Controla tus gastos mensuales</Text>
          </View>
        </View>
        <View style={styles.budgetHeaderBadge}>
          <Icon name="trending-up-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Presupuesto mensual mejorado */}
      <View style={styles.monthlyBudgetCard}>
        <View style={styles.monthlyBudgetHeader}>
          <Icon name="calendar-outline" size={20} color="#4A7C59" />
          <Text style={styles.monthlyBudgetTitle}>Presupuesto Mensual</Text>
        </View>
        <View style={styles.monthlyBudgetInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.monthlyBudgetInput}
            value={budgetTracker.monthlyBudget}
            onChangeText={(text) => setBudgetTracker({...budgetTracker, monthlyBudget: text})}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Resumen de categorías */}
      <View style={styles.categoriesSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>6</Text>
            <Text style={styles.summaryLabel}>Categorías</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="analytics-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Total Gastado</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="wallet-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Restante</Text>
          </View>
        </View>
      </View>

      {/* Categorías mejoradas */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categorías de Gastos</Text>
          <TouchableOpacity style={styles.addCategoryButton}>
            <Icon name="add-circle-outline" size={20} color="#4A7C59" />
            <Text style={styles.addCategoryText}>Agregar</Text>
          </TouchableOpacity>
        </View>
        
        {budgetTracker.categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryCardHeader}>
              <View style={styles.categoryIconContainer}>
                <Icon name="folder-outline" size={18} color="#4A7C59" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <TouchableOpacity style={styles.categoryMenuButton}>
                <Icon name="ellipsis-horizontal" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.categoryFields}>
              <View style={styles.categoryFieldGroup}>
                <Text style={styles.categoryFieldLabel}>Presupuesto</Text>
                <View style={styles.categoryFieldInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.budget}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'budget', text)}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.categoryFieldGroup}>
                <Text style={styles.categoryFieldLabel}>Gastado</Text>
                <View style={styles.categoryFieldInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.spent}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'spent', text)}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.categoryFieldGroup}>
                <Text style={styles.categoryFieldLabel}>Restante</Text>
                <View style={styles.categoryFieldInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.remaining}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'remaining', text)}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>0% utilizado</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderExpenseTracker = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.expenseHeader}>
        <View style={styles.expenseHeaderContent}>
          <View style={styles.expenseIconContainer}>
            <Icon name="receipt-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.expenseHeaderText}>
            <Text style={styles.expenseHeaderTitle}>Seguimiento de Gastos</Text>
            <Text style={styles.expenseHeaderSubtitle}>Registra y analiza tus gastos</Text>
          </View>
        </View>
        <View style={styles.expenseHeaderBadge}>
          <Icon name="analytics-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de gastos */}
      <View style={styles.expenseSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="cash-outline" size={20} color="#EF4444" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>${expenseTracker.totalExpenses}</Text>
            <Text style={styles.summaryLabel}>Total Gastado</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="list-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{expenseTracker.expenses.length}</Text>
            <Text style={styles.summaryLabel}>Transacciones</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="trending-up-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Promedio</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar gasto */}
      <View style={styles.addExpenseContainer}>
        <TouchableOpacity style={styles.addExpenseButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addExpenseText}>Agregar Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de gastos mejorada */}
      <View style={styles.expensesContainer}>
        <View style={styles.expensesHeader}>
          <Text style={styles.expensesTitle}>Gastos Recientes</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-outline" size={16} color="#4A7C59" />
            <Text style={styles.filterText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        
        {expenseTracker.expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseCardHeader}>
              <View style={styles.expenseIconContainer}>
                <Icon name="card-outline" size={18} color="#4A7C59" />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription}>
                  {expense.description || 'Descripción del gasto'}
                </Text>
                <Text style={styles.expenseCategory}>
                  {expense.category || 'Sin categoría'}
                </Text>
              </View>
              <View style={styles.expenseAmountContainer}>
                <Text style={styles.expenseAmount}>
                  ${expense.amount || '0.00'}
                </Text>
              </View>
            </View>
            
            <View style={styles.expenseDetails}>
              <View style={styles.expenseDetailRow}>
                <View style={styles.expenseDetailField}>
                  <Text style={styles.expenseDetailLabel}>Fecha</Text>
                  <TextInput
                    style={styles.expenseDetailInput}
                    value={expense.date}
                    onChangeText={(text) => updateExpense(expense.id, 'date', text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.expenseDetailField}>
                  <Text style={styles.expenseDetailLabel}>Método</Text>
                  <TextInput
                    style={styles.expenseDetailInput}
                    value={expense.paymentMethod}
                    onChangeText={(text) => updateExpense(expense.id, 'paymentMethod', text)}
                    placeholder="Efectivo/Tarjeta"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View style={styles.expenseDetailRow}>
                <View style={styles.expenseDetailField}>
                  <Text style={styles.expenseDetailLabel}>Descripción</Text>
                  <TextInput
                    style={styles.expenseDetailInput}
                    value={expense.description}
                    onChangeText={(text) => updateExpense(expense.id, 'description', text)}
                    placeholder="Descripción del gasto"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.expenseDetailField}>
                  <Text style={styles.expenseDetailLabel}>Categoría</Text>
                  <TextInput
                    style={styles.expenseDetailInput}
                    value={expense.category}
                    onChangeText={(text) => updateExpense(expense.id, 'category', text)}
                    placeholder="Categoría"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            {/* Acciones de la tarjeta */}
            <View style={styles.expenseActions}>
              <TouchableOpacity style={styles.expenseActionButton}>
                <Icon name="create-outline" size={16} color="#6B7280" />
                <Text style={styles.expenseActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.expenseActionButton}>
                <Icon name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.expenseActionText, { color: '#EF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCreditCardManager = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.creditCardHeader}>
        <View style={styles.creditCardHeaderContent}>
          <View style={styles.creditCardIconContainer}>
            <Icon name="card-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.creditCardHeaderText}>
            <Text style={styles.creditCardHeaderTitle}>Gestor de Tarjetas</Text>
            <Text style={styles.creditCardHeaderSubtitle}>Administra tus tarjetas de crédito</Text>
          </View>
        </View>
        <View style={styles.creditCardHeaderBadge}>
          <Icon name="shield-checkmark-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de tarjetas */}
      <View style={styles.creditCardSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="card-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{creditCardManager.cards.length}</Text>
            <Text style={styles.summaryLabel}>Tarjetas</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="wallet-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Límite Total</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="trending-up-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Saldo Total</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar tarjeta */}
      <View style={styles.addCardContainer}>
        <TouchableOpacity style={styles.addCardButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addCardText}>Agregar Tarjeta</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarjetas mejorada */}
      <View style={styles.cardsContainer}>
        <View style={styles.cardsHeader}>
          <Text style={styles.cardsTitle}>Mis Tarjetas</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Icon name="swap-vertical-outline" size={16} color="#4A7C59" />
            <Text style={styles.sortText}>Ordenar</Text>
          </TouchableOpacity>
        </View>
        
        {creditCardManager.cards.map((card) => (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardItemHeader}>
              <View style={styles.cardIconContainer}>
                <Icon name="card-outline" size={18} color="#4A7C59" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>
                  {card.name || 'Tarjeta de Crédito'}
                </Text>
                <Text style={styles.cardBank}>
                  {card.bank || 'Banco'}
                </Text>
              </View>
              <View style={styles.cardStatusContainer}>
                <View style={styles.cardStatusBadge}>
                  <Text style={styles.cardStatusText}>Activa</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.cardDetails}>
              <View style={styles.cardDetailRow}>
                <View style={styles.cardDetailField}>
                  <Text style={styles.cardDetailLabel}>Límite de Crédito</Text>
                  <TextInput
                    style={styles.cardDetailInput}
                    value={card.limit}
                    onChangeText={(text) => updateCreditCard(card.id, 'limit', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.cardDetailField}>
                  <Text style={styles.cardDetailLabel}>Saldo Actual</Text>
                  <TextInput
                    style={styles.cardDetailInput}
                    value={card.balance}
                    onChangeText={(text) => updateCreditCard(card.id, 'balance', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.cardDetailRow}>
                <View style={styles.cardDetailField}>
                  <Text style={styles.cardDetailLabel}>Fecha de Vencimiento</Text>
                  <TextInput
                    style={styles.cardDetailInput}
                    value={card.dueDate}
                    onChangeText={(text) => updateCreditCard(card.id, 'dueDate', text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.cardDetailField}>
                  <Text style={styles.cardDetailLabel}>Pago Mínimo</Text>
                  <TextInput
                    style={styles.cardDetailInput}
                    value={card.minPayment}
                    onChangeText={(text) => updateCreditCard(card.id, 'minPayment', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            {/* Barra de progreso del crédito utilizado */}
            <View style={styles.cardProgressContainer}>
              <View style={styles.cardProgressHeader}>
                <Text style={styles.cardProgressLabel}>Crédito Utilizado</Text>
                <Text style={styles.cardProgressValue}>0%</Text>
              </View>
              <View style={styles.cardProgressBar}>
                <View style={styles.cardProgressFill} />
              </View>
            </View>
            
            {/* Acciones de la tarjeta */}
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardActionButton}>
                <Icon name="create-outline" size={16} color="#6B7280" />
                <Text style={styles.cardActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButton}>
                <Icon name="eye-outline" size={16} color="#3B82F6" />
                <Text style={[styles.cardActionText, { color: '#3B82F6' }]}>Ver Detalles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButton}>
                <Icon name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.cardActionText, { color: '#EF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBillTracker = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.billHeader}>
        <View style={styles.billHeaderContent}>
          <View style={styles.billIconContainer}>
            <Icon name="document-text-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.billHeaderText}>
            <Text style={styles.billHeaderTitle}>Seguimiento de Facturas</Text>
            <Text style={styles.billHeaderSubtitle}>Gestiona tus facturas y pagos</Text>
          </View>
        </View>
        <View style={styles.billHeaderBadge}>
          <Icon name="calendar-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de facturas */}
      <View style={styles.billSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="receipt-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{billTracker.bills.length}</Text>
            <Text style={styles.summaryLabel}>Facturas</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {billTracker.bills.filter(bill => bill.status === 'paid').length}
            </Text>
            <Text style={styles.summaryLabel}>Pagadas</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="time-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {billTracker.bills.filter(bill => bill.status === 'pending').length}
            </Text>
            <Text style={styles.summaryLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar factura */}
      <View style={styles.addBillContainer}>
        <TouchableOpacity style={styles.addBillButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addBillText}>Agregar Factura</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de facturas mejorada */}
      <View style={styles.billsContainer}>
        <View style={styles.billsHeader}>
          <Text style={styles.billsTitle}>Mis Facturas</Text>
          <TouchableOpacity style={styles.filterBillButton}>
            <Icon name="filter-outline" size={16} color="#4A7C59" />
            <Text style={styles.filterBillText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        
        {billTracker.bills.map((bill) => (
          <View key={bill.id} style={styles.billItem}>
            <View style={styles.billItemHeader}>
              <View style={styles.billIconContainer}>
                <Icon name="document-outline" size={18} color="#4A7C59" />
              </View>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>
                  {bill.name || 'Factura sin nombre'}
                </Text>
                <Text style={styles.billCategory}>
                  {bill.category || 'Sin categoría'}
                </Text>
              </View>
              <View style={styles.billStatusContainer}>
                <TouchableOpacity
                  style={[
                    styles.billStatusBadge,
                    bill.status === 'paid' ? styles.billPaidStatus : styles.billPendingStatus
                  ]}
                  onPress={() => toggleBillStatus(bill.id)}
                >
                  <Text style={[
                    styles.billStatusText,
                    bill.status === 'paid' ? styles.billPaidText : styles.billPendingText
                  ]}>
                    {bill.status === 'paid' ? 'Pagada' : 'Pendiente'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.billDetails}>
              <View style={styles.billDetailRow}>
                <View style={styles.billDetailField}>
                  <Text style={styles.billDetailLabel}>Monto</Text>
                  <TextInput
                    style={styles.billDetailInput}
                    value={bill.amount}
                    onChangeText={(text) => updateBill(bill.id, 'amount', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.billDetailField}>
                  <Text style={styles.billDetailLabel}>Fecha de Vencimiento</Text>
                  <TextInput
                    style={styles.billDetailInput}
                    value={bill.dueDate}
                    onChangeText={(text) => updateBill(bill.id, 'dueDate', text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View style={styles.billDetailRow}>
                <View style={styles.billDetailField}>
                  <Text style={styles.billDetailLabel}>Nombre de Factura</Text>
                  <TextInput
                    style={styles.billDetailInput}
                    value={bill.name}
                    onChangeText={(text) => updateBill(bill.id, 'name', text)}
                    placeholder="Nombre de la factura"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.billDetailField}>
                  <Text style={styles.billDetailLabel}>Categoría</Text>
                  <TextInput
                    style={styles.billDetailInput}
                    value={bill.category}
                    onChangeText={(text) => updateBill(bill.id, 'category', text)}
                    placeholder="Categoría"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            {/* Indicador de urgencia */}
            <View style={styles.billUrgencyContainer}>
              <View style={styles.billUrgencyHeader}>
                <Text style={styles.billUrgencyLabel}>Estado de Pago</Text>
                <View style={[
                  styles.billUrgencyIndicator,
                  bill.status === 'paid' ? styles.billUrgencyPaid : styles.billUrgencyPending
                ]}>
                  <Icon 
                    name={bill.status === 'paid' ? 'checkmark' : 'alert-circle'} 
                    size={12} 
                    color="#FFFFFF" 
                  />
                </View>
              </View>
              <View style={styles.billUrgencyBar}>
                <View style={[
                  styles.billUrgencyFill,
                  bill.status === 'paid' ? styles.billUrgencyFillPaid : styles.billUrgencyFillPending
                ]} />
              </View>
            </View>
            
            {/* Acciones de la factura */}
            <View style={styles.billActions}>
              <TouchableOpacity style={styles.billActionButton}>
                <Icon name="create-outline" size={16} color="#6B7280" />
                <Text style={styles.billActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.billActionButton}>
                <Icon name="eye-outline" size={16} color="#3B82F6" />
                <Text style={[styles.billActionText, { color: '#3B82F6' }]}>Ver Detalles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.billActionButton}>
                <Icon name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.billActionText, { color: '#EF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInvestmentTracker = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.investmentHeader}>
        <View style={styles.investmentHeaderContent}>
          <View style={styles.investmentIconContainer}>
            <Icon name="trending-up-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.investmentHeaderText}>
            <Text style={styles.investmentHeaderTitle}>Seguimiento de Inversiones</Text>
            <Text style={styles.investmentHeaderSubtitle}>Monitorea tu portafolio de inversiones</Text>
          </View>
        </View>
        <View style={styles.investmentHeaderBadge}>
          <Icon name="analytics-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de inversiones */}
      <View style={styles.investmentSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="wallet-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{investmentTracker.investments.length}</Text>
            <Text style={styles.summaryLabel}>Inversiones</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="trending-up-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Valor Total</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="cash-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Ganancia</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar inversión */}
      <View style={styles.addInvestmentContainer}>
        <TouchableOpacity style={styles.addInvestmentButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addInvestmentText}>Agregar Inversión</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de inversiones mejorada */}
      <View style={styles.investmentsContainer}>
        <View style={styles.investmentsHeader}>
          <Text style={styles.investmentsTitle}>Mi Portafolio</Text>
          <TouchableOpacity style={styles.portfolioButton}>
            <Icon name="bar-chart-outline" size={16} color="#4A7C59" />
            <Text style={styles.portfolioText}>Análisis</Text>
          </TouchableOpacity>
        </View>
        
        {investmentTracker.investments.map((investment) => (
          <View key={investment.id} style={styles.investmentItem}>
            <View style={styles.investmentItemHeader}>
              <View style={styles.investmentIconContainer}>
                <Icon name="trending-up-outline" size={18} color="#4A7C59" />
              </View>
              <View style={styles.investmentInfo}>
                <Text style={styles.investmentName}>
                  {investment.name || 'Inversión sin nombre'}
                </Text>
                <Text style={styles.investmentType}>
                  {investment.type || 'Sin tipo'}
                </Text>
              </View>
              <View style={styles.investmentPerformanceContainer}>
                <View style={[
                  styles.investmentPerformanceBadge,
                  parseFloat(investment.profit || 0) >= 0 ? styles.investmentProfit : styles.investmentLoss
                ]}>
                  <Text style={[
                    styles.investmentPerformanceText,
                    parseFloat(investment.profit || 0) >= 0 ? styles.investmentProfitText : styles.investmentLossText
                  ]}>
                    {parseFloat(investment.profit || 0) >= 0 ? '+' : ''}${investment.profit || '0.00'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.investmentDetails}>
              <View style={styles.investmentDetailRow}>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Monto Inicial</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.amount}
                    onChangeText={(text) => updateInvestment(investment.id, 'amount', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Valor Actual</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.currentValue}
                    onChangeText={(text) => updateInvestment(investment.id, 'currentValue', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.investmentDetailRow}>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Nombre</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.name}
                    onChangeText={(text) => updateInvestment(investment.id, 'name', text)}
                    placeholder="Nombre de la inversión"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Tipo</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.type}
                    onChangeText={(text) => updateInvestment(investment.id, 'type', text)}
                    placeholder="Stock, Bond, etc."
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
              
              <View style={styles.investmentDetailRow}>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Ganancia/Pérdida</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.profit}
                    onChangeText={(text) => updateInvestment(investment.id, 'profit', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.investmentDetailField}>
                  <Text style={styles.investmentDetailLabel}>Fecha</Text>
                  <TextInput
                    style={styles.investmentDetailInput}
                    value={investment.date}
                    onChangeText={(text) => updateInvestment(investment.id, 'date', text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            {/* Barra de rendimiento */}
            <View style={styles.investmentPerformanceContainer}>
              <View style={styles.investmentPerformanceHeader}>
                <Text style={styles.investmentPerformanceLabel}>Rendimiento</Text>
                <Text style={[
                  styles.investmentPerformanceValue,
                  parseFloat(investment.profit || 0) >= 0 ? styles.investmentProfitText : styles.investmentLossText
                ]}>
                  {parseFloat(investment.profit || 0) >= 0 ? '+' : ''}{investment.profit || '0.00'}%
                </Text>
              </View>
              <View style={styles.investmentPerformanceBar}>
                <View style={[
                  styles.investmentPerformanceFill,
                  parseFloat(investment.profit || 0) >= 0 ? styles.investmentPerformanceFillProfit : styles.investmentPerformanceFillLoss
                ]} />
              </View>
            </View>
            
            {/* Acciones de la inversión */}
            <View style={styles.investmentActions}>
              <TouchableOpacity style={styles.investmentActionButton}>
                <Icon name="create-outline" size={16} color="#6B7280" />
                <Text style={styles.investmentActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.investmentActionButton}>
                <Icon name="analytics-outline" size={16} color="#3B82F6" />
                <Text style={[styles.investmentActionText, { color: '#3B82F6' }]}>Análisis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.investmentActionButton}>
                <Icon name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.investmentActionText, { color: '#EF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSavingsGoals = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.savingsHeader}>
        <View style={styles.savingsHeaderContent}>
          <View style={styles.savingsIconContainer}>
            <Icon name="piggy-bank-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.savingsHeaderText}>
            <Text style={styles.savingsHeaderTitle}>Objetivos de Ahorro</Text>
            <Text style={styles.savingsHeaderSubtitle}>Establece y alcanza tus metas financieras</Text>
          </View>
        </View>
        <View style={styles.savingsHeaderBadge}>
          <Icon name="trophy-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de objetivos */}
      <View style={styles.savingsSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="flag-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{savingsGoals.goals.length}</Text>
            <Text style={styles.summaryLabel}>Objetivos</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {savingsGoals.goals.filter(goal => parseFloat(goal.progress || 0) >= 100).length}
            </Text>
            <Text style={styles.summaryLabel}>Completados</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="wallet-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>$0</Text>
            <Text style={styles.summaryLabel}>Total Ahorrado</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar objetivo */}
      <View style={styles.addSavingsContainer}>
        <TouchableOpacity style={styles.addSavingsButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addSavingsText}>Agregar Objetivo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de objetivos mejorada */}
      <View style={styles.savingsContainer}>
        <View style={styles.savingsHeader}>
          <Text style={styles.savingsTitle}>Mis Objetivos</Text>
          <TouchableOpacity style={styles.motivationButton}>
            <Icon name="heart-outline" size={16} color="#4A7C59" />
            <Text style={styles.motivationText}>Motivación</Text>
          </TouchableOpacity>
        </View>
        
        {savingsGoals.goals.map((goal) => (
          <View key={goal.id} style={styles.savingsItem}>
            <View style={styles.savingsItemHeader}>
              <View style={styles.savingsIconContainer}>
                <Icon name="flag-outline" size={18} color="#4A7C59" />
              </View>
              <View style={styles.savingsInfo}>
                <Text style={styles.savingsName}>
                  {goal.name || 'Objetivo sin nombre'}
                </Text>
                <Text style={styles.savingsDeadline}>
                  Meta: ${goal.targetAmount || '0.00'} • Fecha: {goal.deadline || 'Sin fecha'}
                </Text>
              </View>
              <View style={styles.savingsStatusContainer}>
                <View style={[
                  styles.savingsStatusBadge,
                  parseFloat(goal.progress || 0) >= 100 ? styles.savingsCompleted : styles.savingsInProgress
                ]}>
                  <Text style={[
                    styles.savingsStatusText,
                    parseFloat(goal.progress || 0) >= 100 ? styles.savingsCompletedText : styles.savingsInProgressText
                  ]}>
                    {parseFloat(goal.progress || 0) >= 100 ? 'Completado' : 'En Progreso'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.savingsDetails}>
              <View style={styles.savingsDetailRow}>
                <View style={styles.savingsDetailField}>
                  <Text style={styles.savingsDetailLabel}>Monto Objetivo</Text>
                  <TextInput
                    style={styles.savingsDetailInput}
                    value={goal.targetAmount}
                    onChangeText={(text) => updateSavingsGoal(goal.id, 'targetAmount', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.savingsDetailField}>
                  <Text style={styles.savingsDetailLabel}>Monto Actual</Text>
                  <TextInput
                    style={styles.savingsDetailInput}
                    value={goal.currentAmount}
                    onChangeText={(text) => updateSavingsGoal(goal.id, 'currentAmount', text)}
                    placeholder="$0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.savingsDetailRow}>
                <View style={styles.savingsDetailField}>
                  <Text style={styles.savingsDetailLabel}>Nombre del Objetivo</Text>
                  <TextInput
                    style={styles.savingsDetailInput}
                    value={goal.name}
                    onChangeText={(text) => updateSavingsGoal(goal.id, 'name', text)}
                    placeholder="Nombre del objetivo"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={styles.savingsDetailField}>
                  <Text style={styles.savingsDetailLabel}>Fecha Límite</Text>
                  <TextInput
                    style={styles.savingsDetailInput}
                    value={goal.deadline}
                    onChangeText={(text) => updateSavingsGoal(goal.id, 'deadline', text)}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            {/* Barra de progreso mejorada */}
            <View style={styles.savingsProgressContainer}>
              <View style={styles.savingsProgressHeader}>
                <Text style={styles.savingsProgressLabel}>Progreso</Text>
                <Text style={styles.savingsProgressValue}>{goal.progress || '0'}%</Text>
              </View>
              <View style={styles.savingsProgressBar}>
                <View style={[
                  styles.savingsProgressFill,
                  { width: `${goal.progress || 0}%` },
                  parseFloat(goal.progress || 0) >= 100 ? styles.savingsProgressFillCompleted : styles.savingsProgressFillInProgress
                ]} />
              </View>
              <View style={styles.savingsProgressInfo}>
                <Text style={styles.savingsProgressAmount}>
                  ${goal.currentAmount || '0.00'} de ${goal.targetAmount || '0.00'}
                </Text>
                <Text style={styles.savingsProgressRemaining}>
                  Restante: ${(parseFloat(goal.targetAmount || 0) - parseFloat(goal.currentAmount || 0)).toFixed(2)}
                </Text>
              </View>
            </View>
            
            {/* Acciones del objetivo */}
            <View style={styles.savingsActions}>
              <TouchableOpacity style={styles.savingsActionButton}>
                <Icon name="create-outline" size={16} color="#6B7280" />
                <Text style={styles.savingsActionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savingsActionButton}>
                <Icon name="add-outline" size={16} color="#10B981" />
                <Text style={[styles.savingsActionText, { color: '#10B981' }]}>Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.savingsActionButton}>
                <Icon name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.savingsActionText, { color: '#EF4444' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderShoppingList = () => (
    <View style={styles.section}>
      {/* Header mejorado */}
      <View style={styles.shoppingHeader}>
        <View style={styles.shoppingHeaderContent}>
          <View style={styles.shoppingIconContainer}>
            <Icon name="cart-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.shoppingHeaderText}>
            <Text style={styles.shoppingHeaderTitle}>Lista de Compras</Text>
            <Text style={styles.shoppingHeaderSubtitle}>Organiza tus compras por categorías</Text>
          </View>
        </View>
        <View style={styles.shoppingHeaderBadge}>
          <Icon name="list-outline" size={16} color="#4A7C59" />
        </View>
      </View>

      {/* Resumen de compras */}
      <View style={styles.shoppingSummary}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="basket-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {Object.values(marketList).flat().length}
            </Text>
            <Text style={styles.summaryLabel}>Artículos</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {Object.values(marketList).flat().filter(item => item.purchased).length}
            </Text>
            <Text style={styles.summaryLabel}>Comprados</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Icon name="storefront-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{mealCategories.length}</Text>
            <Text style={styles.summaryLabel}>Categorías</Text>
          </View>
        </View>
      </View>

      {/* Botón para agregar artículo */}
      <View style={styles.addShoppingContainer}>
        <TouchableOpacity style={styles.addShoppingButton}>
          <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addShoppingText}>Agregar Artículo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de compras mejorada */}
      <View style={styles.shoppingContainer}>
        <View style={styles.shoppingHeader}>
          <Text style={styles.shoppingTitle}>Mi Lista de Compras</Text>
          <TouchableOpacity style={styles.clearButton}>
            <Icon name="trash-outline" size={16} color="#4A7C59" />
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
        
        {mealCategories.map((category) => (
          <View key={category.id} style={styles.shoppingCategory}>
            <View style={styles.shoppingCategoryHeader}>
              <View style={styles.shoppingCategoryIcon}>
                <Text style={styles.shoppingCategoryEmoji}>{category.icon}</Text>
              </View>
              <View style={styles.shoppingCategoryInfo}>
                <Text style={styles.shoppingCategoryName}>{category.name}</Text>
                <Text style={styles.shoppingCategoryCount}>
                  {marketList[category.id].length} artículos
                </Text>
              </View>
              <TouchableOpacity
                style={styles.shoppingAddButton}
                onPress={() => openAddItemModal(category.id)}
              >
                <Icon name="add-outline" size={16} color="#4A7C59" />
                <Text style={styles.shoppingAddText}>Agregar</Text>
              </TouchableOpacity>
            </View>
            
            {marketList[category.id].map((item) => (
              <View key={item.id} style={styles.shoppingItem}>
                <View style={styles.shoppingItemContent}>
                  <TouchableOpacity
                    onPress={() => toggleItemPurchased(category.id, item.id)}
                    style={styles.shoppingCheckboxContainer}
                  >
                    <View style={[
                      styles.shoppingCheckbox,
                      item.purchased && styles.shoppingCheckboxChecked
                    ]}>
                      {item.purchased && (
                        <Icon name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.shoppingItemInfo}>
                    <Text style={[
                      styles.shoppingItemName,
                      item.purchased && styles.shoppingItemNamePurchased
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={[
                      styles.shoppingItemQuantity,
                      item.purchased && styles.shoppingItemQuantityPurchased
                    ]}>
                      Cantidad: {item.quantity}
                    </Text>
                  </View>
                  
                  <View style={styles.shoppingItemActions}>
                    <TouchableOpacity
                      onPress={() => removeItem(category.id, item.id)}
                      style={styles.shoppingRemoveButton}
                    >
                      <Icon name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Indicador de estado */}
                <View style={styles.shoppingItemStatus}>
                  <View style={[
                    styles.shoppingStatusIndicator,
                    item.purchased ? styles.shoppingStatusPurchased : styles.shoppingStatusPending
                  ]} />
                  <Text style={[
                    styles.shoppingStatusText,
                    item.purchased ? styles.shoppingStatusPurchasedText : styles.shoppingStatusPendingText
                  ]}>
                    {item.purchased ? 'Comprado' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Mensaje cuando no hay artículos */}
            {marketList[category.id].length === 0 && (
              <View style={styles.shoppingEmptyState}>
                <Icon name="basket-outline" size={32} color="#9CA3AF" />
                <Text style={styles.shoppingEmptyText}>No hay artículos en esta categoría</Text>
                <TouchableOpacity
                  style={styles.shoppingEmptyButton}
                  onPress={() => openAddItemModal(category.id)}
                >
                  <Icon name="add-outline" size={16} color="#4A7C59" />
                  <Text style={styles.shoppingEmptyButtonText}>Agregar primer artículo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'budget-tracker':
        return renderBudgetTracker();
      case 'expense-tracker':
        return renderExpenseTracker();
      case 'credit-card-manager':
        return renderCreditCardManager();
      case 'bill-tracker':
        return renderBillTracker();
      case 'investment-tracker':
        return renderInvestmentTracker();
      case 'savings-goals':
        return renderSavingsGoals();
      case 'shopping-list':
        return renderShoppingList();
      default:
        return renderBudgetTracker();
    }
  };

  return (
    <View style={styles.container}>
      <ElegantSubsectionTabs
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme="forest"
        size="medium"
        showIcons={true}
        showLabels={false}
      />

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>

      {/* Modal para agregar items */}
      <Modal
        visible={showAddItemModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAddItemModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Agregar a {mealCategories.find(cat => cat.id === selectedCategory)?.name}
              </Text>
              <TouchableOpacity onPress={closeAddItemModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#4A6741" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Nombre del producto:</Text>
              <TextInput
                style={styles.textInput}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="Ej: Manzanas"
                placeholderTextColor="#999"
              />
              
              <Text style={styles.inputLabel}>Cantidad:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setNewItemQuantity(Math.max(1, newItemQuantity - 1))}
                >
                  <Icon name="remove" size={20} color="#4A6741" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{newItemQuantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setNewItemQuantity(newItemQuantity + 1)}
                >
                  <Icon name="add" size={20} color="#4A6741" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeAddItemModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addItem}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0E3', // Verde forest claro
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  crownIcon: {
    padding: 4,
  },
  budgetContent: {
    flex: 1,
  },
  monthlyBudgetSection: {
    marginBottom: 20,
  },
  monthlyBudgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 8,
  },
  monthlyBudgetInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#495057',
  },
  categoriesSection: {
    flex: 1,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 12,
  },
  categoryCard: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  categoryHeader: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  categoryFields: {
    flex: 1,
  },
  categoryFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryFieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  categoryFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  expenseContent: {
    flex: 1,
  },
  expenseTable: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF6B9D',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 10,
    color: '#495057',
    marginHorizontal: 2,
  },
  totalSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  creditCardContent: {
    flex: 1,
  },
  creditCard: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  creditCardHeader: {
    marginBottom: 12,
  },
  creditCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  creditCardFields: {
    flex: 1,
  },
  creditCardFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditCardFieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  creditCardFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  billContent: {
    flex: 1,
  },
  billTable: {
    marginBottom: 16,
  },
  statusCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paidStatus: {
    backgroundColor: '#d4edda',
  },
  pendingStatus: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  paidText: {
    color: '#155724',
  },
  pendingText: {
    color: '#721c24',
  },
  investmentContent: {
    flex: 1,
  },
  investmentCard: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  investmentHeader: {
    marginBottom: 12,
  },
  investmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  investmentFields: {
    flex: 1,
  },
  investmentFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  investmentFieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  investmentFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  savingsContent: {
    flex: 1,
  },
  savingsGoal: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderRadius: 8,
  },
  savingsGoalHeader: {
    marginBottom: 12,
  },
  savingsGoalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  savingsGoalFields: {
    flex: 1,
  },
  savingsGoalFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsGoalFieldLabel: {
    fontSize: 12,
    color: '#495057',
    flex: 1,
  },
  savingsGoalFieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingVertical: 2,
    fontSize: 12,
    color: '#495057',
    flex: 1,
    marginLeft: 8,
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  // Estilos para Lista de Compras
  headerDecoration: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  mascotImage: {
    width: 32,
    height: 32,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#4A6B8A',
    marginTop: 2,
  },
  marketListContainer: {
    gap: 16,
  },
  categorySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A6B8A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  itemRowPurchased: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    color: '#1E3A5F',
  },
  itemTextPurchased: {
    textDecorationLine: 'line-through',
    color: '#6C757D',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#4A6B8A',
    marginTop: 2,
  },
  itemQuantityPurchased: {
    color: '#6C757D',
  },
  removeButton: {
    padding: 4,
  },
  // Estilos para Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E3A5F',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A6B8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    minWidth: 30,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  addButton: {
    backgroundColor: '#4A6B8A',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Estilos mejorados para Budget Tracker
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  budgetHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  budgetHeaderText: {
    flex: 1,
  },
  budgetHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  budgetHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  budgetHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Presupuesto mensual mejorado
  monthlyBudgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  monthlyBudgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthlyBudgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  monthlyBudgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginRight: 8,
  },
  monthlyBudgetInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingVertical: 0,
  },
  
  // Resumen de categorías
  categoriesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Categorías mejoradas
  categoriesContainer: {
    flex: 1,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addCategoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Tarjetas de categoría mejoradas
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryMenuButton: {
    padding: 4,
  },
  
  // Campos de categoría mejorados
  categoryFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  categoryFieldGroup: {
    flex: 1,
  },
  categoryFieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  categoryFieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryFieldInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 0,
  },
  
  // Barra de progreso
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#4A7C59',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Estilos mejorados para Expense Tracker
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  expenseHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expenseHeaderText: {
    flex: 1,
  },
  expenseHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  expenseHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  expenseHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de gastos
  expenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar gasto
  addExpenseContainer: {
    marginBottom: 20,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addExpenseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de gastos
  expensesContainer: {
    flex: 1,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Tarjetas de gastos mejoradas
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  expenseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  
  // Detalles de gastos
  expenseDetails: {
    marginBottom: 16,
  },
  expenseDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  expenseDetailField: {
    flex: 1,
  },
  expenseDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  expenseDetailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Acciones de gastos
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  expenseActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  expenseActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // Estilos mejorados para Credit Card Manager
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  creditCardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creditCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  creditCardHeaderText: {
    flex: 1,
  },
  creditCardHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  creditCardHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  creditCardHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de tarjetas
  creditCardSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar tarjeta
  addCardContainer: {
    marginBottom: 20,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de tarjetas
  cardsContainer: {
    flex: 1,
  },
  cardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Tarjetas de crédito mejoradas
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  cardBank: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardStatusContainer: {
    alignItems: 'flex-end',
  },
  cardStatusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  // Detalles de tarjetas
  cardDetails: {
    marginBottom: 16,
  },
  cardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  cardDetailField: {
    flex: 1,
  },
  cardDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  cardDetailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Barra de progreso del crédito
  cardProgressContainer: {
    marginBottom: 16,
  },
  cardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardProgressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  cardProgressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A7C59',
  },
  cardProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  cardProgressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#4A7C59',
    borderRadius: 3,
  },
  
  // Acciones de tarjetas
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // Estilos mejorados para Bill Tracker
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  billHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billHeaderText: {
    flex: 1,
  },
  billHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  billHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  billHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de facturas
  billSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar factura
  addBillContainer: {
    marginBottom: 20,
  },
  addBillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de facturas
  billsContainer: {
    flex: 1,
  },
  billsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  billsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterBillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterBillText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Tarjetas de facturas mejoradas
  billItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  billItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  billInfo: {
    flex: 1,
    marginLeft: 12,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  billCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  billStatusContainer: {
    alignItems: 'flex-end',
  },
  billStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  billPaidStatus: {
    backgroundColor: '#10B981',
  },
  billPendingStatus: {
    backgroundColor: '#F59E0B',
  },
  billStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  billPaidText: {
    color: '#FFFFFF',
  },
  billPendingText: {
    color: '#FFFFFF',
  },
  
  // Detalles de facturas
  billDetails: {
    marginBottom: 16,
  },
  billDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  billDetailField: {
    flex: 1,
  },
  billDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  billDetailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Indicador de urgencia
  billUrgencyContainer: {
    marginBottom: 16,
  },
  billUrgencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billUrgencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  billUrgencyIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billUrgencyPaid: {
    backgroundColor: '#10B981',
  },
  billUrgencyPending: {
    backgroundColor: '#F59E0B',
  },
  billUrgencyBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  billUrgencyFill: {
    height: '100%',
    borderRadius: 3,
  },
  billUrgencyFillPaid: {
    width: '100%',
    backgroundColor: '#10B981',
  },
  billUrgencyFillPending: {
    width: '50%',
    backgroundColor: '#F59E0B',
  },
  
  // Acciones de facturas
  billActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  billActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  billActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // Estilos mejorados para Investment Tracker
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  investmentHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  investmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  investmentHeaderText: {
    flex: 1,
  },
  investmentHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  investmentHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  investmentHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de inversiones
  investmentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar inversión
  addInvestmentContainer: {
    marginBottom: 20,
  },
  addInvestmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addInvestmentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de inversiones
  investmentsContainer: {
    flex: 1,
  },
  investmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  portfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  portfolioText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Tarjetas de inversiones mejoradas
  investmentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  investmentItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  investmentType: {
    fontSize: 14,
    color: '#6B7280',
  },
  investmentPerformanceContainer: {
    alignItems: 'flex-end',
  },
  investmentPerformanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  investmentProfit: {
    backgroundColor: '#10B981',
  },
  investmentLoss: {
    backgroundColor: '#EF4444',
  },
  investmentPerformanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  investmentProfitText: {
    color: '#FFFFFF',
  },
  investmentLossText: {
    color: '#FFFFFF',
  },
  
  // Detalles de inversiones
  investmentDetails: {
    marginBottom: 16,
  },
  investmentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  investmentDetailField: {
    flex: 1,
  },
  investmentDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  investmentDetailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Barra de rendimiento
  investmentPerformanceContainer: {
    marginBottom: 16,
  },
  investmentPerformanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  investmentPerformanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  investmentPerformanceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  investmentPerformanceBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  investmentPerformanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  investmentPerformanceFillProfit: {
    width: '75%',
    backgroundColor: '#10B981',
  },
  investmentPerformanceFillLoss: {
    width: '25%',
    backgroundColor: '#EF4444',
  },
  
  // Acciones de inversiones
  investmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  investmentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  investmentActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // Estilos mejorados para Savings Goals
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  savingsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savingsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  savingsHeaderText: {
    flex: 1,
  },
  savingsHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  savingsHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  savingsHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de objetivos
  savingsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar objetivo
  addSavingsContainer: {
    marginBottom: 20,
  },
  addSavingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addSavingsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de objetivos
  savingsContainer: {
    flex: 1,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  motivationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  motivationText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Tarjetas de objetivos mejoradas
  savingsItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  savingsItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  savingsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  savingsDeadline: {
    fontSize: 14,
    color: '#6B7280',
  },
  savingsStatusContainer: {
    alignItems: 'flex-end',
  },
  savingsStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingsCompleted: {
    backgroundColor: '#10B981',
  },
  savingsInProgress: {
    backgroundColor: '#F59E0B',
  },
  savingsStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  savingsCompletedText: {
    color: '#FFFFFF',
  },
  savingsInProgressText: {
    color: '#FFFFFF',
  },
  
  // Detalles de objetivos
  savingsDetails: {
    marginBottom: 16,
  },
  savingsDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  savingsDetailField: {
    flex: 1,
  },
  savingsDetailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  savingsDetailInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  
  // Barra de progreso mejorada
  savingsProgressContainer: {
    marginBottom: 16,
  },
  savingsProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsProgressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  savingsProgressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A7C59',
  },
  savingsProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  savingsProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  savingsProgressFillCompleted: {
    backgroundColor: '#10B981',
  },
  savingsProgressFillInProgress: {
    backgroundColor: '#4A7C59',
  },
  savingsProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsProgressAmount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  savingsProgressRemaining: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  
  // Acciones de objetivos
  savingsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  savingsActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  savingsActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // Estilos mejorados para Shopping List
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shoppingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shoppingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shoppingHeaderText: {
    flex: 1,
  },
  shoppingHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  shoppingHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  shoppingHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Resumen de compras
  shoppingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  
  // Botón para agregar artículo
  addShoppingContainer: {
    marginBottom: 20,
  },
  addShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A7C59',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#4A7C59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Contenedor de compras
  shoppingContainer: {
    flex: 1,
  },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shoppingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Categorías de compras
  shoppingCategory: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shoppingCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shoppingCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shoppingCategoryEmoji: {
    fontSize: 20,
  },
  shoppingCategoryInfo: {
    flex: 1,
  },
  shoppingCategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  shoppingCategoryCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  shoppingAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shoppingAddText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Artículos de compras
  shoppingItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shoppingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shoppingCheckboxContainer: {
    marginRight: 12,
  },
  shoppingCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoppingCheckboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  shoppingItemInfo: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  shoppingItemNamePurchased: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  shoppingItemQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  shoppingItemQuantityPurchased: {
    color: '#9CA3AF',
  },
  shoppingItemActions: {
    marginLeft: 12,
  },
  shoppingRemoveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Estado del artículo
  shoppingItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shoppingStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  shoppingStatusPurchased: {
    backgroundColor: '#10B981',
  },
  shoppingStatusPending: {
    backgroundColor: '#F59E0B',
  },
  shoppingStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shoppingStatusPurchasedText: {
    color: '#10B981',
  },
  shoppingStatusPendingText: {
    color: '#F59E0B',
  },
  
  // Estado vacío
  shoppingEmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  shoppingEmptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  shoppingEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shoppingEmptyButtonText: {
    color: '#4A7C59',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default FinanceSections;

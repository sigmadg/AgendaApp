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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const sections = [
    { id: 'budget-tracker', name: 'Budget Tracker', icon: 'wallet-outline' },
    { id: 'expense-tracker', name: 'Expense Tracker', icon: 'receipt-outline' },
    { id: 'credit-card-manager', name: 'Credit Card Manager', icon: 'card-outline' },
    { id: 'bill-tracker', name: 'Bill Tracker', icon: 'document-text-outline' },
    { id: 'investment-tracker', name: 'Investment Tracker', icon: 'trending-up-outline' },
    { id: 'savings-goals', name: 'Savings Goals', icon: 'piggy-bank-outline' }
  ];

  const renderSectionTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              activeSection === section.id && styles.activeTab
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <Icon 
              name={section.icon} 
              size={18} 
              color={activeSection === section.id ? '#FFFFFF' : '#6c757d'} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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

  const renderBudgetTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>BUDGET TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.budgetContent}>
        <View style={styles.monthlyBudgetSection}>
          <Text style={styles.monthlyBudgetTitle}>Monthly Budget</Text>
          <TextInput
            style={styles.monthlyBudgetInput}
            value={budgetTracker.monthlyBudget}
            onChangeText={(text) => setBudgetTracker({...budgetTracker, monthlyBudget: text})}
            placeholder="Presupuesto mensual"
            placeholderTextColor="#adb5bd"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          {budgetTracker.categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              
              <View style={styles.categoryFields}>
                <View style={styles.categoryFieldRow}>
                  <Text style={styles.categoryFieldLabel}>Budget:</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.budget}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'budget', text)}
                    placeholder="Presupuesto"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.categoryFieldRow}>
                  <Text style={styles.categoryFieldLabel}>Spent:</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.spent}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'spent', text)}
                    placeholder="Gastado"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.categoryFieldRow}>
                  <Text style={styles.categoryFieldLabel}>Remaining:</Text>
                  <TextInput
                    style={styles.categoryFieldInput}
                    value={category.remaining}
                    onChangeText={(text) => updateBudgetCategory(category.id, 'remaining', text)}
                    placeholder="Restante"
                    placeholderTextColor="#adb5bd"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderExpenseTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXPENSE TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.expenseContent}>
        <View style={styles.expenseTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Description</Text>
            <Text style={styles.headerCell}>Category</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Method</Text>
          </View>
          
          {expenseTracker.expenses.map((expense) => (
            <View key={expense.id} style={styles.tableRow}>
              <TextInput
                style={styles.tableCell}
                value={expense.date}
                onChangeText={(text) => updateExpense(expense.id, 'date', text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={expense.description}
                onChangeText={(text) => updateExpense(expense.id, 'description', text)}
                placeholder="Descripción"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={expense.category}
                onChangeText={(text) => updateExpense(expense.id, 'category', text)}
                placeholder="Categoría"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={expense.amount}
                onChangeText={(text) => updateExpense(expense.id, 'amount', text)}
                placeholder="Monto"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.tableCell}
                value={expense.paymentMethod}
                onChangeText={(text) => updateExpense(expense.id, 'paymentMethod', text)}
                placeholder="Método"
                placeholderTextColor="#adb5bd"
              />
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalTitle}>Total Expenses: ${expenseTracker.totalExpenses}</Text>
        </View>
      </View>
    </View>
  );

  const renderCreditCardManager = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CREDIT CARD MANAGER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.creditCardContent}>
        {creditCardManager.cards.map((card) => (
          <View key={card.id} style={styles.creditCard}>
            <View style={styles.creditCardHeader}>
              <Text style={styles.creditCardTitle}>Credit Card {card.id}</Text>
            </View>
            
            <View style={styles.creditCardFields}>
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Card Name:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.name}
                  onChangeText={(text) => updateCreditCard(card.id, 'name', text)}
                  placeholder="Nombre de la tarjeta"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Bank:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.bank}
                  onChangeText={(text) => updateCreditCard(card.id, 'bank', text)}
                  placeholder="Banco"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Credit Limit:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.limit}
                  onChangeText={(text) => updateCreditCard(card.id, 'limit', text)}
                  placeholder="Límite de crédito"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Current Balance:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.balance}
                  onChangeText={(text) => updateCreditCard(card.id, 'balance', text)}
                  placeholder="Saldo actual"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Due Date:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.dueDate}
                  onChangeText={(text) => updateCreditCard(card.id, 'dueDate', text)}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.creditCardFieldRow}>
                <Text style={styles.creditCardFieldLabel}>Min Payment:</Text>
                <TextInput
                  style={styles.creditCardFieldInput}
                  value={card.minPayment}
                  onChangeText={(text) => updateCreditCard(card.id, 'minPayment', text)}
                  placeholder="Pago mínimo"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBillTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>BILL TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.billContent}>
        <View style={styles.billTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Bill Name</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Due Date</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Category</Text>
          </View>
          
          {billTracker.bills.map((bill) => (
            <View key={bill.id} style={styles.tableRow}>
              <TextInput
                style={styles.tableCell}
                value={bill.name}
                onChangeText={(text) => updateBill(bill.id, 'name', text)}
                placeholder="Nombre de la factura"
                placeholderTextColor="#adb5bd"
              />
              <TextInput
                style={styles.tableCell}
                value={bill.amount}
                onChangeText={(text) => updateBill(bill.id, 'amount', text)}
                placeholder="Monto"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.tableCell}
                value={bill.dueDate}
                onChangeText={(text) => updateBill(bill.id, 'dueDate', text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#adb5bd"
              />
              <TouchableOpacity
                style={[
                  styles.statusCell,
                  bill.status === 'paid' ? styles.paidStatus : styles.pendingStatus
                ]}
                onPress={() => toggleBillStatus(bill.id)}
              >
                <Text style={[
                  styles.statusText,
                  bill.status === 'paid' ? styles.paidText : styles.pendingText
                ]}>
                  {bill.status === 'paid' ? 'Paid' : 'Pending'}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.tableCell}
                value={bill.category}
                onChangeText={(text) => updateBill(bill.id, 'category', text)}
                placeholder="Categoría"
                placeholderTextColor="#adb5bd"
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderInvestmentTracker = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>INVESTMENT TRACKER</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.investmentContent}>
        {investmentTracker.investments.map((investment) => (
          <View key={investment.id} style={styles.investmentCard}>
            <View style={styles.investmentHeader}>
              <Text style={styles.investmentTitle}>Investment {investment.id}</Text>
            </View>
            
            <View style={styles.investmentFields}>
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Name:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.name}
                  onChangeText={(text) => updateInvestment(investment.id, 'name', text)}
                  placeholder="Nombre de la inversión"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Type:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.type}
                  onChangeText={(text) => updateInvestment(investment.id, 'type', text)}
                  placeholder="Tipo (Stock, Bond, etc.)"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Initial Amount:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.amount}
                  onChangeText={(text) => updateInvestment(investment.id, 'amount', text)}
                  placeholder="Monto inicial"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Current Value:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.currentValue}
                  onChangeText={(text) => updateInvestment(investment.id, 'currentValue', text)}
                  placeholder="Valor actual"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Profit/Loss:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.profit}
                  onChangeText={(text) => updateInvestment(investment.id, 'profit', text)}
                  placeholder="Ganancia/Pérdida"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.investmentFieldRow}>
                <Text style={styles.investmentFieldLabel}>Date:</Text>
                <TextInput
                  style={styles.investmentFieldInput}
                  value={investment.date}
                  onChangeText={(text) => updateInvestment(investment.id, 'date', text)}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#adb5bd"
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSavingsGoals = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SAVINGS GOALS</Text>
        <View style={styles.crownIcon}>
          <Icon name="star" size={20} color="#FF6B9D" />
        </View>
      </View>

      <View style={styles.savingsContent}>
        {savingsGoals.goals.map((goal) => (
          <View key={goal.id} style={styles.savingsGoal}>
            <View style={styles.savingsGoalHeader}>
              <Text style={styles.savingsGoalTitle}>Goal {goal.id}</Text>
            </View>
            
            <View style={styles.savingsGoalFields}>
              <View style={styles.savingsGoalFieldRow}>
                <Text style={styles.savingsGoalFieldLabel}>Goal Name:</Text>
                <TextInput
                  style={styles.savingsGoalFieldInput}
                  value={goal.name}
                  onChangeText={(text) => updateSavingsGoal(goal.id, 'name', text)}
                  placeholder="Nombre de la meta"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.savingsGoalFieldRow}>
                <Text style={styles.savingsGoalFieldLabel}>Target Amount:</Text>
                <TextInput
                  style={styles.savingsGoalFieldInput}
                  value={goal.targetAmount}
                  onChangeText={(text) => updateSavingsGoal(goal.id, 'targetAmount', text)}
                  placeholder="Monto objetivo"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.savingsGoalFieldRow}>
                <Text style={styles.savingsGoalFieldLabel}>Current Amount:</Text>
                <TextInput
                  style={styles.savingsGoalFieldInput}
                  value={goal.currentAmount}
                  onChangeText={(text) => updateSavingsGoal(goal.id, 'currentAmount', text)}
                  placeholder="Monto actual"
                  placeholderTextColor="#adb5bd"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.savingsGoalFieldRow}>
                <Text style={styles.savingsGoalFieldLabel}>Deadline:</Text>
                <TextInput
                  style={styles.savingsGoalFieldInput}
                  value={goal.deadline}
                  onChangeText={(text) => updateSavingsGoal(goal.id, 'deadline', text)}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#adb5bd"
                />
              </View>
              
              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Progress: {goal.progress}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
                </View>
              </View>
            </View>
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
      default:
        return renderBudgetTracker();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navegación de pestañas */}
      {renderSectionTabs()}

      {/* Contenido de la sección activa */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderActiveSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
});

export default FinanceSections;

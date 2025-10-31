import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  IonLoading,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Main from './pages/main/Main';

// Category Pages
import Health from './pages/categories/health/Health';
import Work from './pages/categories/work/Work';
import Finance from './pages/categories/finance/Finance';
import Travel from './pages/categories/travel/Travel';
import School from './pages/categories/school/School';
import Events from './pages/categories/events/Events';
import Languages from './pages/categories/languages/Languages';
import Pets from './pages/categories/pets/Pets';
import Selfcare from './pages/categories/selfcare/Selfcare';
import Reading from './pages/categories/reading/Reading';
import Movies from './pages/categories/movies/Movies';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Styles
import './pages/auth/Login.css';
import './pages/auth/Register.css';
import './pages/auth/ForgotPassword.css';
import './pages/auth/ResetPassword.css';
import './pages/main/Main.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <IonLoading
        isOpen={true}
        message="Cargando..."
      />
    );
  }

  return (
    <IonRouterOutlet>
      {isAuthenticated ? (
        // Authenticated routes
        <>
          <Route exact path="/main" component={Main} />
          <Route exact path="/health" component={Health} />
          <Route exact path="/work" component={Work} />
          <Route exact path="/finance" component={Finance} />
          <Route exact path="/travel" component={Travel} />
          <Route exact path="/school" component={School} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/languages" component={Languages} />
          <Route exact path="/pets" component={Pets} />
          <Route exact path="/selfcare" component={Selfcare} />
          <Route exact path="/reading" component={Reading} />
          <Route exact path="/movies" component={Movies} />
          <Route exact path="/" render={() => <Redirect to="/main" />} />
          <Route render={() => <Redirect to="/main" />} />
        </>
      ) : (
        // Unauthenticated routes
        <>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route render={() => <Redirect to="/login" />} />
        </>
      )}
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;

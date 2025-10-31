import 'package:go_router/go_router.dart';
import '../auth/pages/login_page.dart';
import '../auth/pages/register_page.dart';
import '../auth/pages/forgot_password_page.dart';
import '../auth/pages/reset_password_page.dart';
import '../pages/main/main_page.dart';
import '../widgets/school/school_sections.dart';
import '../widgets/selfcare/selfcare_sections.dart';
import '../widgets/travel/travel_sections.dart';
import '../widgets/work/work_sections.dart';
import '../widgets/health/health_sections.dart';
import '../widgets/finance/finance_sections.dart';
import '../widgets/nutrition/nutrition_sections.dart';
import '../widgets/exercise/exercise_sections.dart';
import '../widgets/language/language_sections.dart';
import '../widgets/menstrual/menstrual_sections.dart';
import '../widgets/pet/pet_sections.dart';
import '../widgets/reading/reading_sections.dart';
import '../widgets/movie/movies_sections.dart';
import '../widgets/entrepreneurship/entrepreneurship_sections.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterPage(),
    ),
    GoRoute(
      path: '/forgot-password',
      builder: (context, state) => const ForgotPasswordPage(),
    ),
    GoRoute(
      path: '/reset-password',
      builder: (context, state) => const ResetPasswordPage(),
    ),
    GoRoute(
      path: '/main',
      builder: (context, state) => const MainPage(),
    ),
    GoRoute(
      path: '/school',
      builder: (context, state) => const SchoolSections(),
    ),
    GoRoute(
      path: '/selfcare',
      builder: (context, state) => const SelfCareSections(),
    ),
    GoRoute(
      path: '/travel',
      builder: (context, state) => const TravelSections(),
    ),
    GoRoute(
      path: '/work',
      builder: (context, state) => const WorkSections(),
    ),
    GoRoute(
      path: '/health',
      builder: (context, state) => const HealthSections(),
    ),
    GoRoute(
      path: '/finance',
      builder: (context, state) => const FinanceSections(),
    ),
    GoRoute(
      path: '/nutrition',
      builder: (context, state) => const NutritionSections(),
    ),
    GoRoute(
      path: '/exercise',
      builder: (context, state) => const ExerciseSections(),
    ),
    GoRoute(
      path: '/language',
      builder: (context, state) => const LanguageSections(),
    ),
    GoRoute(
      path: '/menstrual',
      builder: (context, state) => const MenstrualSections(),
    ),
    GoRoute(
      path: '/pet',
      builder: (context, state) => const PetSections(),
    ),
    GoRoute(
      path: '/reading',
      builder: (context, state) => const ReadingSections(),
    ),
    GoRoute(
      path: '/movies',
      builder: (context, state) => const MoviesSections(),
    ),
    GoRoute(
      path: '/entrepreneurship',
      builder: (context, state) => const EntrepreneurshipSections(),
    ),
  ],
);


import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'auth/providers/auth_provider.dart';
import 'theme/app_theme.dart';
import 'utils/app_router.dart';
import 'config/supabase_config.dart';
import 'widgets/common/app_background.dart';
import 'services/permission_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Solicitar permisos necesarios
  try {
    print('Solicitando permisos necesarios...');
    final permissionsResult = await PermissionService.requestPermissions();
    print('Resultado de permisos: $permissionsResult');
    
    // Verificar si todos los permisos fueron concedidos
    final allGranted = await PermissionService.checkAllPermissions();
    if (allGranted) {
      print('Todos los permisos necesarios han sido concedidos');
    } else {
      print('Algunos permisos no fueron concedidos. La app puede funcionar con funcionalidad limitada.');
    }
  } catch (e) {
    print('Error al solicitar permisos: $e');
    // Continuar con la ejecución aunque haya error en permisos
  }
  
  // Inicializar formato de fecha para español
  try {
    await initializeDateFormatting('es', null);
    print('Formato de fecha en español inicializado');
  } catch (e) {
    print('Error al inicializar formato de fecha: $e');
  }
  
  // Inicializar Supabase
  try {
    await Supabase.initialize(
      url: SupabaseConfig.supabaseUrl,
      anonKey: SupabaseConfig.supabaseAnonKey,
      authOptions: const FlutterAuthClientOptions(
        authFlowType: AuthFlowType.pkce,
        autoRefreshToken: true,
      ),
    );
    print('Supabase inicializado correctamente');
    print('URL: ${SupabaseConfig.supabaseUrl}');
  } catch (e) {
    print('Error al inicializar Supabase: $e');
    print('Nota: Asegúrate de configurar tus credenciales en lib/config/supabase_config.dart');
    print('Verifica también tu conexión a internet');
  }
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp.router(
        title: 'AgendaApp',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        routerConfig: appRouter,
        builder: (context, child) {
          return AppBackground(
            child: child ?? const SizedBox.shrink(),
          );
        },
      ),
    );
  }
}

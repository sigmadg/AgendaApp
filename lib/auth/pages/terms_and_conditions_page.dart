import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class TermsAndConditionsPage extends StatelessWidget {
  const TermsAndConditionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBackground,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppTheme.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Términos y Condiciones',
          style: TextStyle(
            color: AppTheme.white,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Última actualización: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}',
              style: const TextStyle(
                color: AppTheme.white60,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 24),
            const SectionTitle('1. Aceptación de los Términos'),
            const SectionText(
              'Al acceder y utilizar la aplicación Agenda, aceptas cumplir y estar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar la aplicación.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('2. Uso de la Aplicación'),
            const SectionText(
              'La aplicación Agenda está diseñada para ayudarte a gestionar tu agenda personal. Puedes usar la aplicación para organizar eventos, tareas y otras actividades relacionadas con tu vida personal.',
            ),
            const SectionText(
              'Te comprometes a utilizar la aplicación de manera responsable y de acuerdo con todas las leyes y regulaciones aplicables.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('3. Cuenta de Usuario'),
            const SectionText(
              'Para utilizar ciertas funciones de la aplicación, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.',
            ),
            const SectionText(
              'Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('4. Privacidad y Protección de Datos'),
            const SectionText(
              'El uso de la aplicación también se rige por nuestra Política de Privacidad. Al utilizar la aplicación, aceptas el procesamiento de tus datos de acuerdo con nuestra Política de Privacidad.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('5. Propiedad Intelectual'),
            const SectionText(
              'Todos los derechos de propiedad intelectual sobre la aplicación y su contenido pertenecen a sus respectivos propietarios. No puedes copiar, modificar, distribuir o crear trabajos derivados sin autorización.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('6. Limitación de Responsabilidad'),
            const SectionText(
              'La aplicación se proporciona "tal cual" y "según disponibilidad". No garantizamos que la aplicación esté libre de errores, interrupciones o defectos.',
            ),
            const SectionText(
              'No seremos responsables por ningún daño directo, indirecto, incidental o consecuente que pueda resultar del uso o la imposibilidad de usar la aplicación.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('7. Modificaciones de los Términos'),
            const SectionText(
              'Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Te notificaremos sobre cambios significativos a través de la aplicación.',
            ),
            const SectionText(
              'El uso continuado de la aplicación después de tales modificaciones constituye tu aceptación de los términos modificados.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('8. Terminación'),
            const SectionText(
              'Nos reservamos el derecho de suspender o terminar tu acceso a la aplicación en cualquier momento, sin previo aviso, por cualquier motivo, incluyendo el incumplimiento de estos términos.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('9. Ley Aplicable'),
            const SectionText(
              'Estos Términos y Condiciones se rigen por las leyes del país donde se utiliza la aplicación. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('10. Contacto'),
            const SectionText(
              'Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través de la aplicación o por los medios de contacto proporcionados en nuestra Política de Privacidad.',
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String text;
  
  const SectionTitle(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: AppTheme.orangeAccent,
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
    );
  }
}

class SectionText extends StatelessWidget {
  final String text;
  
  const SectionText(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Text(
        text,
        style: const TextStyle(
          color: AppTheme.white70,
          fontSize: 14,
          height: 1.6,
        ),
      ),
    );
  }
}


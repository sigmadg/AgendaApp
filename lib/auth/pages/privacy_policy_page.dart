import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({super.key});

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
          'Política de Privacidad',
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
            const SectionTitle('1. Información que Recopilamos'),
            const SectionText(
              'Recopilamos información que nos proporcionas directamente cuando creas una cuenta, como tu nombre, dirección de correo electrónico y contraseña.',
            ),
            const SectionText(
              'También recopilamos información sobre cómo utilizas la aplicación, incluyendo los eventos, tareas y datos que ingresas en la aplicación.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('2. Cómo Utilizamos tu Información'),
            const SectionText(
              'Utilizamos la información recopilada para:',
            ),
            const BulletPoint('Proporcionar y mejorar nuestros servicios'),
            const BulletPoint('Personalizar tu experiencia en la aplicación'),
            const BulletPoint('Comunicarnos contigo sobre tu cuenta y el servicio'),
            const BulletPoint('Garantizar la seguridad y prevenir fraudes'),
            const SizedBox(height: 24),
            const SectionTitle('3. Compartir tu Información'),
            const SectionText(
              'No vendemos ni alquilamos tu información personal a terceros. Solo compartimos tu información en las siguientes circunstancias:',
            ),
            const BulletPoint('Con tu consentimiento explícito'),
            const BulletPoint('Para cumplir con obligaciones legales'),
            const BulletPoint('Para proteger nuestros derechos y seguridad'),
            const BulletPoint('Con proveedores de servicios que nos ayudan a operar la aplicación'),
            const SizedBox(height: 24),
            const SectionTitle('4. Almacenamiento y Seguridad'),
            const SectionText(
              'Utilizamos medidas de seguridad técnicas y organizativas para proteger tu información personal. Tus datos se almacenan de forma segura utilizando tecnologías de encriptación modernas.',
            ),
            const SectionText(
              'Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por proteger tu información, no podemos garantizar su seguridad absoluta.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('5. Retención de Datos'),
            const SectionText(
              'Conservamos tu información personal mientras tu cuenta esté activa o mientras sea necesario para proporcionarte nuestros servicios.',
            ),
            const SectionText(
              'Puedes solicitar la eliminación de tu cuenta en cualquier momento, y eliminaremos tu información de acuerdo con nuestras políticas de retención de datos.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('6. Tus Derechos'),
            const SectionText(
              'Tienes derecho a:',
            ),
            const BulletPoint('Acceder a tu información personal'),
            const BulletPoint('Corregir información incorrecta'),
            const BulletPoint('Solicitar la eliminación de tu información'),
            const BulletPoint('Oponerte al procesamiento de tu información'),
            const BulletPoint('Solicitar la portabilidad de tus datos'),
            const SizedBox(height: 24),
            const SectionTitle('7. Cookies y Tecnologías Similares'),
            const SectionText(
              'La aplicación puede utilizar cookies y tecnologías similares para mejorar tu experiencia. Puedes controlar el uso de cookies a través de la configuración de tu dispositivo.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('8. Cambios a esta Política'),
            const SectionText(
              'Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos sobre cambios significativos publicando la nueva política en la aplicación o por otros medios.',
            ),
            const SectionText(
              'Te recomendamos que revises periódicamente esta política para estar informado sobre cómo protegemos tu información.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('9. Menores de Edad'),
            const SectionText(
              'La aplicación no está dirigida a menores de 13 años. No recopilamos conscientemente información personal de menores de 13 años.',
            ),
            const SectionText(
              'Si descubrimos que hemos recopilado información de un menor de 13 años sin el consentimiento de los padres, tomaremos medidas para eliminar esa información.',
            ),
            const SizedBox(height: 24),
            const SectionTitle('10. Contacto'),
            const SectionText(
              'Si tienes preguntas o inquietudes sobre esta Política de Privacidad o sobre cómo manejamos tu información, puedes contactarnos a través de la aplicación o utilizando los medios de contacto proporcionados.',
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

class BulletPoint extends StatelessWidget {
  final String text;
  
  const BulletPoint(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 4, left: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '• ',
            style: TextStyle(
              color: AppTheme.orangeAccent,
              fontSize: 14,
            ),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                color: AppTheme.white70,
                fontSize: 14,
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }
}


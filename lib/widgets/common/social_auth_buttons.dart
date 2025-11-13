import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class SocialAuthButtons extends StatelessWidget {
  final VoidCallback? onGoogleLogin;
  final VoidCallback? onFacebookLogin;
  final VoidCallback? onAppleLogin;
  final VoidCallback? onWhatsAppLogin;

  const SocialAuthButtons({
    super.key,
    this.onGoogleLogin,
    this.onFacebookLogin,
    this.onAppleLogin,
    this.onWhatsAppLogin,
  });

  Future<void> _handleGoogleLogin() async {
    if (onGoogleLogin != null) {
      onGoogleLogin!();
    } else {
      // Implementación por defecto
    }
  }

  Future<void> _handleFacebookLogin() async {
    if (onFacebookLogin != null) {
      onFacebookLogin!();
    } else {
      // Implementación por defecto
    }
  }

  Future<void> _handleAppleLogin() async {
    if (onAppleLogin != null) {
      onAppleLogin!();
    } else {
      // Implementación por defecto
    }
  }

  Future<void> _handleWhatsAppLogin() async {
    if (onWhatsAppLogin != null) {
      onWhatsAppLogin!();
    } else {
      // Implementación por defecto
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Divider
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Row(
            children: [
              Expanded(child: Divider(color: AppTheme.darkSurfaceVariant)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'o continúa con',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Expanded(child: Divider(color: AppTheme.darkSurfaceVariant)),
            ],
          ),
        ),
        // Social Buttons
          Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: _buildSocialButton(
                icon: Icons.g_mobiledata,
                label: 'Google',
                color: Colors.red,
                onTap: _handleGoogleLogin,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSocialButton(
                icon: Icons.facebook,
                label: 'Facebook',
                color: Colors.blue,
                onTap: _handleFacebookLogin,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSocialButton(
                icon: Icons.apple,
                label: 'Apple',
                color: Colors.black87,
                onTap: _handleAppleLogin,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSocialButton(
                icon: Icons.chat_bubble_outline,
                label: 'WhatsApp',
                color: Colors.green,
                onTap: _handleWhatsAppLogin,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSocialButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Color.fromRGBO(
              color.red,
              color.green,
              color.blue,
              0.5,
            ),
            width: 1.5,
          ),
        ),
        child: Icon(
          icon,
          color: color,
          size: 24,
        ),
      ),
    );
  }
}


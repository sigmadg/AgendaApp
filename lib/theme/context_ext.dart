import 'package:flutter/material.dart';
import 'pro_palette.dart';

extension ProThemeX on BuildContext {
  ProPalette get pro => Theme.of(this).extension<ProPalette>() ?? ProPalette.work;
  ColorScheme get scheme => Theme.of(this).colorScheme;
  TextTheme get txt => Theme.of(this).textTheme;
}


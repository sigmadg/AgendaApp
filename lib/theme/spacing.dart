import 'package:flutter/material.dart';

class Spacing {
  static const all4 = EdgeInsets.all(4);
  static const all8 = EdgeInsets.all(8);
  static const all12 = EdgeInsets.all(12);
  static const all16 = EdgeInsets.all(16);
  static const all20 = EdgeInsets.all(20);
  static const all24 = EdgeInsets.all(24);
  
  static const h4 = SizedBox(height: 4);
  static const h8 = SizedBox(height: 8);
  static const h12 = SizedBox(height: 12);
  static const h16 = SizedBox(height: 16);
  static const h20 = SizedBox(height: 20);
  static const h24 = SizedBox(height: 24);
  
  static const w4 = SizedBox(width: 4);
  static const w8 = SizedBox(width: 8);
  static const w12 = SizedBox(width: 12);
  static const w16 = SizedBox(width: 16);
  static const w20 = SizedBox(width: 20);
  static const w24 = SizedBox(width: 24);
  
  static const symmetricH12V6 = EdgeInsets.symmetric(horizontal: 12, vertical: 6);
  static const symmetricH16V8 = EdgeInsets.symmetric(horizontal: 16, vertical: 8);
  static const symmetricH20V12 = EdgeInsets.symmetric(horizontal: 20, vertical: 12);
  static const symmetricH24V16 = EdgeInsets.symmetric(horizontal: 24, vertical: 16);
  
  static const fromLTRB20_24_20_20 = EdgeInsets.fromLTRB(20, 24, 20, 20);
}


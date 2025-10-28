# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native ProGuard rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native bridge
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Keep vector icons
-keep class com.oblador.vectoricons.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep permissions
-keep class com.zoontek.rnpermissions.** { *; }

# Keep date time picker
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# Keep safe area context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep Google Sign In
-keep class com.reactnativegooglesignin.** { *; }

# Keep Facebook SDK
-keep class com.facebook.reactnative.androidsdk.** { *; }

# Keep Apple Authentication
-keep class com.invertase.appleauthentication.** { *; }

# Add any project specific keep options here:

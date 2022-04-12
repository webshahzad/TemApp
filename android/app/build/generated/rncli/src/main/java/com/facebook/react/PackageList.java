
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/art
import com.reactnativecommunity.art.ARTPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/dynamic-links
import io.invertase.firebase.dynamiclinks.ReactNativeFirebaseDynamicLinksPackage;
// @react-native-firebase/firestore
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-firebase/storage
import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
// react-native-background-actions
import com.asterinet.react.bgactions.BackgroundActionsPackage;
// react-native-background-job
import com.pilloxa.backgroundjob.BackgroundJobPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-fbsdk
import com.facebook.reactnative.androidsdk.FBSDKPackage;
// react-native-geolocation-service
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-get-random-values
import org.linusu.RNGetRandomValuesPackage;
// react-native-google-signin
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-neumorphism
import com.reactnativeneumorphism.NeumorphismPackage;
// react-native-pedometer-ios-android
import com.reactnativepedometer.PedometerPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-samsung-accessory
import com.egorshulga.reactnative.samsungaccessory.SAPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-simple-gradient-progressbar-view
import com.reactnativesimplegradientprogressbarview.SimpleGradientProgressbarViewPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-text-gradient
import iyegoroff.RNTextGradient.RNTextGradientPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-view-shot
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// react-native-wheel-picker-android
import com.wheelpicker.WheelPickerPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new ARTPackage(),
      new RNDateTimePickerPackage(),
      new RNCMaskedViewPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseDynamicLinksPackage(),
      new ReactNativeFirebaseFirestorePackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new ReactNativeFirebaseStoragePackage(),
      new BackgroundActionsPackage(),
      new BackgroundJobPackage(),
      new ReactNativeContacts(),
      new RNDeviceInfo(),
      new FBSDKPackage(),
      new RNFusedLocationPackage(),
      new RNGestureHandlerPackage(),
      new RNGetRandomValuesPackage(),
      new RNGoogleSigninPackage(),
      new ImagePickerPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new NeumorphismPackage(),
      new PedometerPackage(),
      new ReactNativePushNotificationPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new SAPackage(),
      new RNScreensPackage(),
      new SimpleGradientProgressbarViewPackage(),
      new SvgPackage(),
      new RNTextGradientPackage(),
      new VectorIconsPackage(),
      new RNViewShotPackage(),
      new RNCWebViewPackage(),
      new WheelPickerPackage()
    ));
  }
}

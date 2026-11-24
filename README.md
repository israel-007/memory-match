# Memory Match: Android app

This folder is a ready Capacitor project: the game lives in `www/`, the native Android project is in `android/`
(icons and splash screens already generated, portrait lock applied, app ID `com.memorymatch.app`).

## Get an APK, pick one

### A. No Android Studio: build in the cloud (easiest)
1. Create a new GitHub repository and push this folder to it (branch `main`).
2. Open the repo's **Actions** tab. The *Build Android* workflow runs by itself (or press *Run workflow*).
3. When it finishes, download **memory-match-debug-apk** from the run page, unzip it, and install `app-debug.apk`
   on your phone (allow "install unknown apps" for your browser or file manager).

### B. Android Studio on your computer
Needs Node 22+, Android Studio 2025.2.1 or newer (it bundles JDK 21).
```bash
npm install
npx cap sync android
npx cap open android
```
In Android Studio let Gradle sync, plug in a phone (USB debugging on) or start an emulator, press **Run**.
For a shareable file: **Build > Build APK(s)**. The file lands in `android/app/build/outputs/apk/debug/`.

## Publish on Google Play
1. **Pick your final app ID first.** Edit `appId` in `capacitor.config.json` (for example `com.yourname.memorymatch`), then:
   ```bash
   rm -rf android
   npx cap add android
   npm run android:tweak
   npm run assets
   npx cap sync android
   ```
   (Player progress lives on the device, so changing the ID only matters before you publish.)
2. Make an upload key once, and keep the file and passwords safe:
   ```bash
   keytool -genkeypair -v -keystore release.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
3. Build the signed bundle either way:
   - **Android Studio:** Build > Generate Signed App Bundle, choose `release.jks`.
   - **Cloud:** add GitHub repo secrets `KEYSTORE_BASE64` (output of `base64 -w0 release.jks`),
     `KEYSTORE_PASSWORD` and `KEY_ALIAS` (here `upload`). The workflow then also publishes **memory-match-release-aab**.
4. In Google Play Console create the app, upload the `.aab`, and fill in the store listing: description, screenshots,
   icon (`assets/icon-only.png`), privacy policy URL, content rating and the Data safety form.
   Right now the game stores everything on the device and collects no data. Update the form if you add ads or accounts.
5. Raise `versionCode` in `android/app/build.gradle` for every new upload.

## Updating the game
Edit `www/index.html`, then `npx cap sync android` and rebuild. Bump `CACHE` in `www/sw.js` only for the web version.

## Check on a real phone before release
- Status bar icons are light on the dark background (set by `SystemBars.style` in `capacitor.config.json`).
- Header and bottom power-up bar clear the camera cut-out and gesture bar.
- Back button: closes menus, then goes home, then exits the app.
- Vibration feels right with the native Haptics plugin, and music starts after your first tap.
- The game pauses when you switch apps.

Google updates minimum SDK and review rules every year, so check Play Console's current requirements before you upload.

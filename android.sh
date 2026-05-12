#!/bin/zsh

set -e

echo "Fixing npm permissions..."
sudo chown -R $(whoami) ~/.npm || true
sudo chown -R $(whoami) . || true

echo "Fixing Capacitor logs..."
mkdir -p ~/Library/Logs/capacitor
sudo chown -R $(whoami) ~/Library/Logs/capacitor || true

echo "Removing old Android project..."
rm -rf android

echo "Removing old dependencies..."
rm -rf node_modules
rm -f package-lock.json

echo "Installing dependencies..."
npm install

echo "Installing Capacitor v6..."
npm remove @capacitor/core @capacitor/cli @capacitor/android || true

npm install @capacitor/core@6 \
            @capacitor/cli@6 \
            @capacitor/android@6

echo "Installing Capacitor Assets..."
npm install @capacitor/assets --save-dev

echo "Building Vite app..."
npm run build

echo "Adding Android platform..."
npx cap add android

echo "Downgrading AGP to 8.0.2..."

find android -name "*.gradle" -type f -exec sed -i '' \
's/com.android.tools.build:gradle:[0-9.]*/com.android.tools.build:gradle:8.0.2/g' {} \;

echo "Downgrading Gradle wrapper..."

sed -i '' \
's/gradle-[0-9.]*-bin.zip/gradle-8.0-all.zip/g' \
android/gradle/wrapper/gradle-wrapper.properties

echo "Generating Android icons and splash screen..."

npx capacitor-assets generate \
  --android \
  --iconBackgroundColor '#ffffff' \
  --splashBackgroundColor '#ffffff' \
  --assetPath public/img/leokash/favicon.png

echo "Syncing Capacitor..."
npx cap sync android

echo "Cleaning Gradle..."
cd android
./gradlew clean
cd ..

echo "Opening Android Studio..."
open -a "Android Studio" android

echo "DONE!"


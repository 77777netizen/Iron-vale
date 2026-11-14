// Run after `npx cap add android`: forces landscape + immersive fullscreen.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "android", "app", "src", "main");
const mf = path.join(root, "AndroidManifest.xml");
let m = fs.readFileSync(mf, "utf8");
if (!/screenOrientation/.test(m)) m = m.replace("<activity", '<activity\n            android:screenOrientation="sensorLandscape"');
fs.writeFileSync(mf, m);
const stylesF = path.join(root, "res", "values", "styles.xml");
let st = fs.readFileSync(stylesF, "utf8");
if (!/windowFullscreen/.test(st)) st = st.replace(/(<style name="AppTheme.NoActionBar"[^>]*>)/, '$1\n        <item name="android:windowFullscreen">true</item>\n        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>');
fs.writeFileSync(stylesF, st);
const jdir = path.join(root, "java", "com", "ironvale", "game");
const jf = path.join(jdir, "MainActivity.java");
fs.mkdirSync(jdir, { recursive: true });
fs.writeFileSync(jf, `package com.ironvale.game;

import android.os.Bundle;
import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle b) { super.onCreate(b); immersive(); }
  @Override public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) immersive(); }
  private void immersive() {
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
  }
}
`);
console.log("patched manifest, styles and MainActivity");

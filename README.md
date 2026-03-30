# Zyro sample hybrid Android AUT

Minimal **native Kotlin + React Native** app for exercising Zyro’s mobile crawler against **real UiAutomator2 view hierarchies**. All “backend” behavior is **in-process mocks** (delays + fixed rules). **No real payments, no real APIs.**

## Package name and entry activity

| Item | Value |
|------|--------|
| `applicationId` / package | `com.zyro.sample.payment` |
| Launcher (`MAIN` / `LAUNCHER`) | `com.zyro.sample.payment.LoginActivity` |
| React Native host (post-login) | `com.zyro.sample.payment.MainActivity` |

Registered JS root component: **`ZyroSamplePayment`** (see `index.js`).

## Mock credentials and rules

| Field | Mock value / rule |
|-------|-------------------|
| Phone | Any **8+ digits** (validation is local only). |
| OTP | **`123456`** — accepted on **Verify**. Any other value shows a native error dialog. |
| Register | Name + email + password (**≥ 4 characters**) + **terms checkbox** required. |
| P2P success | Amount **&lt; 10 000** → mock success **Snackbar** after confirm sheet. |
| P2P error | Amount **≥ 10 000** → native **AlertDialog** (“insufficient balance”). |
| Checkout success | **Place order** with delivery note **not** equal to `fail` (case-insensitive). |
| Checkout error | Delivery note **`fail`** → RN **Modal** error dialog. |

### Example AUT credentials (plain text, all fake)

```
Phone:   5551234567
OTP:     123456
Email:   demo@example.com
Password: mockpass1
```

## How native and React Native are wired

1. **Login** (`LoginActivity`) and **Register** (`RegisterActivity`) are **native** Material screens.
2. After a successful OTP verify, the app opens **`MainActivity`**, which subclasses **`ReactActivity`** and loads the bundle entry `index` → **`App.tsx`** (dashboard + shop flow).
3. **`ZyroNavigationModule`** (bridge name **`ZyroNavigation`**) exposes:
   - `openP2P()` → starts **`P2PActivity`** (native).
   - `openProfile()` → starts **`ProfileActivity`** (native).
   - `logout()` → clears the task and returns to **`LoginActivity`**.
4. **P2P** uses a **BottomSheetDialog** (confirm / cancel) and a **RecyclerView** with **20** mock contacts.
5. **E-commerce** path lives entirely in **RN**: browse (18 rows) → detail → cart → checkout → success/error **Modal**.

Debug builds expect **Metro** for JS (`npx react-native start`). **Release** builds embed the bundle via the React Native Gradle plugin — use a **release APK** for fully offline device runs without Metro.

## Locator variation matrix (intentional)

| Screen / area | Pattern (for similar controls) |
|---------------|------------------------------|
| **Native login** | Strong **`contentDescription`** on inputs and actions; **Send OTP** uses a **generic** `@+id/btn1` on purpose. |
| **Native register** | Mix of **stable `@+id/...`** (`register_name`, `cb_terms_accept`, …) and **content descriptions** on the same screen. |
| **RN dashboard** | Heavy **`testID`** + **`accessibilityLabel`** on primary actions (`btn_dashboard_p2p`, …). |
| **Native P2P** | Strong **`@+id/`** on list (`p2p_recycler_contacts`), amount (`p2p_amount`), send (`p2p_btn_send`); **weaker** accessibility on some fields (amount / note / send rely more on hierarchy + text). |
| **RN shop / checkout** | Most controls use **`testID`**; **product detail** primary **“Add to cart”** deliberately has **no `testID`** and **no extra accessibility label** (relies on **visible text** + pressable) to mimic tech debt while staying **clickable** for UiAutomator. |

## Suggested Appium capabilities

```json
{
  "platformName": "Android",
  "automationName": "UiAutomator2",
  "appPackage": "com.zyro.sample.payment",
  "appActivity": ".LoginActivity",
  "app": "/absolute/path/to/app-debug.apk"
}
```

- Use **`.LoginActivity`** when starting cold at sign-in.
- If you need to attach to an app already on the **RN dashboard**, use **`appActivity`: `.MainActivity`** (and ensure the session matches your current task).

APK output paths (typical):

- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Build prerequisites

- **JDK 17** (recommended for current Android Gradle Plugin / AGP used by React Native 0.76).
- **Android SDK** with **SDK Platform 35** (or as required by your installed AGP) and build-tools.
- **Node.js ≥ 18**.

Create `android/local.properties` if Android Studio / CLI does not:

```properties
sdk.dir=/path/to/Android/sdk
```

## Build commands

```bash
npm install
# Debug (needs Metro for JS unless you pre-bundle):
npx react-native start   # separate terminal
cd android && ./gradlew assembleDebug

# Release (JS bundled into APK; suitable for offline AUT handoff):
cd android && ./gradlew assembleRelease
```

## Acceptance checklist mapping

- [x] Native **and** RN on real navigation paths (`Login` → `MainActivity` / RN → native `P2P` / `Profile`).
- [x] Phone + OTP + Register + Dashboard + P2P + Shop complete on mocks; intentional **error** dialogs (login OTP, P2P high amount, checkout `fail` note).
- [x] Checkbox (register terms), **radio** instrument group (5), **AlertDialog** / **Modal** success & error, **bottom sheet**, **Snackbar**.
- [x] Long list: **20** P2P contacts, **18** shop products.
- [x] **Single** package id; **Back** returns from sub-screens; **no network** dependency for mock logic.

## Crawler traps avoided

- **No** Mobile / Email **tab strip** on login (linear phone → OTP only).
- **No** prominent “Forgot password / Help / Terms” links on the **main login** screen; terms appear only on **Register** with a checkbox.

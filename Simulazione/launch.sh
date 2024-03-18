# HOW TO RUN: ./launch.sh

# ⚠️ [CTRL]+[C] WILL NOT BUILD THE PROJECT ⚠️
# USE [Q]+[ENTER] TO STOP HOSTING AND BUILD

echo "[LAUNCHER] Launching from: root/launch.sh"
echo "[LAUNCHER] Use [Q]+[ENTER] to quit safely and allow vite to build the project!"
echo "[LAUNCHER] Running Vite..."
npx vite
echo "[LAUNCHER] Building Project..."
npx vite build --emptyOutDir
echo "[LAUNCHER] Exiting..."
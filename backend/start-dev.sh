#!/bin/bash

# --- CONFIGURACIÓ ---
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$PROJECT_DIR/mongo-data"
LOG_FILE="$PROJECT_DIR/mongod.log"
MONGOD_PID_FILE="$PROJECT_DIR/mongod.pid"

echo "Projecte: $PROJECT_DIR"
echo "Dades MongoDB: $DATA_DIR"

# Crear carpeta de dades si no existeix
mkdir -p "$DATA_DIR"

# Comprovar si mongod ja està en marxa
if lsof -i :27017 >/dev/null 2>&1; then
    echo "MongoDB ja està en marxa al port 27017"
else
    echo "Iniciant MongoDB..."
    mongod --dbpath "$DATA_DIR" --logpath "$LOG_FILE" --fork --pidfilepath "$MONGOD_PID_FILE"
    
    # Esperar que s'iniciï
    sleep 3
    
    if lsof -i :27017 >/dev/null 2>&1; then
        echo "MongoDB iniciat correctament"
    else
        echo "ERROR: MongoDB no s'ha pogut iniciar"
        cat "$LOG_FILE" | tail -20
        exit 1
    fi
fi

# Executar el backend
echo "Iniciant el backend amb npm run dev..."
npm run dev
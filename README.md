# Proyecto mínimo: registre (frontend) + backend (API)

Este ZIP contiene **solo**:
- `registre/` (Vue + Vite)
- `backend/`  (Node.js + Express + MongoDB)

## Arranque
### Backend
```
cd backend
npm install
copy .env.example .env
npm run dev   # http://localhost:4000
```

### Frontend
```
cd registre
npm install
copy .env.example .env
npm run dev   # http://localhost:5173
```

## Variables de entorno
- Backend: `backend/.env`
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/registre
JWT_SECRET=supersecreto_cambialo
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```
- Frontend: `registre/.env`
```
VITE_API_URL=http://localhost:4000
```

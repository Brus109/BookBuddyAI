# 🔗 Guía de Conexión Backend-Frontend - BookBuddyAI

## ✅ Cambios Implementados

### 1. **Tipos Sincronizados** (`frontend/src/types/index.ts`)
- Actualizado `Book` para usar `workId` (string) en lugar de `id` (number)
- Campos ajustados: `cover`, `year`, `author?` (opcional)
- Nuevo tipo `SaveBook` para favoritos (compatible con backend)

### 2. **API Service Actualizado** (`frontend/src/services/api.ts`)
- ✅ Registro usa `full_name` en lugar de `username`
- ✅ Login retorna `{ token: string }`
- ✅ Mejor manejo de errores con mensajes del backend
- ✅ Tipos correctos para `SaveBook` y favoritos

### 3. **Autenticación** (`frontend/src/context/AuthContext.tsx`)
- ✅ Nuevo contexto `AuthProvider` para manejar estado global
- ✅ Funciones: `login`, `register`, `logout`
- ✅ Tokens guardados en localStorage
- ✅ Hook `useAuth()` para usar en cualquier componente

### 4. **Favoritos Conectados** (`frontend/src/hooks/useFavorites.ts`)
- ✅ Conectado al backend cuando el usuario está autenticado
- ✅ Fallback a localStorage si no está autenticado
- ✅ Usa formato `SaveBook` compatible con backend
- ✅ Función `addFavorite` ahora puede incluir status, rating y review

### 5. **Componentes Actualizados**
- ✅ `App.tsx`: Integra `AuthProvider`
- ✅ `BookList.tsx`: Usa `workId` para navegación
- ✅ `BookDetailPage.tsx`: Usa `workId` en lugar de `id` numérico
- ✅ `FavoriteButton.tsx`: Guarda en formato compatible con backend

---

## 🚀 Cómo Probar la Conexión

### Paso 1: Iniciar Backend
```bash
cd /Users/axelorozco/BookBoddyAI/backend
source venv/bin/activate  # Activar entorno virtual
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verificar backend activo:**
```bash
curl http://localhost:8000/
# Debe responder: {"status":"OK"}
```

### Paso 2: Configurar Variables de Entorno Frontend
Crear o verificar `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Paso 3: Iniciar Frontend
```bash
cd /Users/axelorozco/BookBoddyAI/frontend
npm install  # Si es primera vez
npm run dev
```

Abre: http://localhost:5173

---

## 🧪 Endpoints Disponibles

### Backend URLs Base: `http://localhost:8000`

#### **Autenticación**
- `POST /auth/register` - Registrar usuario
  ```json
  {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "preferences": {}
  }
  ```

- `POST /auth/login` - Login
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
  **Respuesta:** `{ "token": "eyJ..." }`

#### **Libros (Públicos)**
- `GET /books/catalog?page=1` - Catálogo general
- `GET /books/search?title=harry&genre=fantasy&page=1` - Buscar libros
- `GET /books/genres` - Obtener géneros disponibles
- `GET /books/rating?id=OL123W` - Rating de un libro específico

#### **Favoritos (Requieren Autenticación)**
- `POST /books/save` - Guardar favorito
  ```json
  {
    "book_id": "OL123W",
    "status": "reading",
    "rating": 5,
    "review": "Excelente libro"
  }
  ```
  **Headers:** `Authorization: Bearer {token}`

- `GET /books/get_favorites` - Obtener favoritos del usuario
  **Headers:** `Authorization: Bearer {token}`

---

## 📋 Estructura de Datos

### Book (Backend → Frontend)
```typescript
{
  workId: "OL123W",      // ID de OpenLibrary
  title: "Harry Potter",
  author: "J.K. Rowling",
  year: 1997,
  cover: "https://covers.openlibrary.org/...",
  // Opcionales
  genre?: string,
  rating?: number,
  reviews?: number
}
```

### SaveBook (Frontend → Backend)
```typescript
{
  book_id: "OL123W",     // workId del libro
  status: "reading",     // "reading" | "completed" | "want_to_read"
  rating?: number,       // 1-5
  review?: string        // Texto de reseña
}
```

---

## 🔧 Flujo de Autenticación

1. **Usuario sin autenticar:**
   - Puede ver catálogo y buscar libros
   - Favoritos se guardan solo en localStorage

2. **Usuario se registra:**
   ```typescript
   const { register } = useAuth();
   await register(email, password, full_name);
   // Login automático después del registro
   ```

3. **Usuario hace login:**
   ```typescript
   const { login } = useAuth();
   await login(email, password);
   // Token guardado en localStorage y context
   ```

4. **Usuario autenticado:**
   - Favoritos se sincronizan con backend
   - Puede agregar ratings y reviews
   - Token se envía en header `Authorization: Bearer {token}`

5. **Usuario hace logout:**
   ```typescript
   const { logout } = useAuth();
   logout();
   // Token removido de localStorage
   ```

---

## 🐛 Troubleshooting

### Error CORS
Si ves errores de CORS en consola:
1. Verificar que backend esté corriendo en puerto 8000
2. Verificar `allow_origins` en `backend/main.py`:
   ```python
   allow_origins=["http://localhost:5173"]
   ```

### Error 401 (Unauthorized)
- Verificar que el token esté presente
- Verificar que el token no haya expirado
- Hacer logout y login de nuevo

### Libros sin workId
- OpenLibrary a veces no retorna `workId` para todos los libros
- Los componentes manejan este caso mostrando advertencia en consola
- Esos libros no se pueden guardar como favoritos

### Backend no conecta con Supabase
1. Verificar archivo `.env` en backend:
   ```env
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-anon-key
   ```
2. Verificar credenciales en Supabase dashboard

---

## 🎯 Próximos Pasos

### Backend
- [ ] Implementar endpoint `DELETE /books/favorites/{book_id}` para eliminar favoritos
- [ ] Retornar datos completos del usuario en login
- [ ] Implementar refresh token

### Frontend
- [ ] Crear componente de Login/Register UI
- [ ] Mostrar estado de autenticación en header
- [ ] Sincronizar favoritos de localStorage con backend al hacer login
- [ ] Implementar Reviews conectadas al backend

---

## 📚 Estructura de Archivos Clave

```
BookBoddyAI/
├── backend/
│   ├── main.py                    # ✅ CORS configurado
│   ├── api/
│   │   ├── routers/
│   │   │   ├── auth.py            # ✅ /auth/register, /auth/login
│   │   │   └── books.py           # ✅ Endpoints de libros
│   │   └── schemas/
│   │       ├── auths.py           # ✅ UserRegister, UserLogin
│   │       └── books.py           # ✅ Book, SaveBook
│   ├── services/
│   │   ├── auth_service.py        # ✅ Lógica de autenticación
│   │   └── book_service.py        # ✅ Lógica de libros
│   └── utils/
│       └── database.py            # ✅ Cliente Supabase
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.tsx    # ✅ NUEVO - Estado global de auth
    │   ├── services/
    │   │   └── api.ts             # ✅ ACTUALIZADO - Servicios API
    │   ├── types/
    │   │   └── index.ts           # ✅ ACTUALIZADO - Tipos sincronizados
    │   ├── hooks/
    │   │   └── useFavorites.ts    # ✅ ACTUALIZADO - Conectado al backend
    │   ├── components/
    │   │   ├── BookList.tsx       # ✅ ACTUALIZADO - Usa workId
    │   │   ├── FavoriteButton.tsx # ✅ ACTUALIZADO - Formato compatible
    │   │   └── BookDetailPage.tsx # ✅ ACTUALIZADO - Usa workId
    │   └── App.tsx                # ✅ ACTUALIZADO - AuthProvider integrado
    └── .env                        # ⚠️ Configurar VITE_API_URL
```

---

## ✨ Testing Rápido

### 1. Test de Conexión
```bash
# Terminal 1: Backend
cd backend && uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Curl test
curl http://localhost:8000/books/catalog?page=1
```

### 2. Test de Registro
En el navegador (consola):
```javascript
const response = await fetch('http://localhost:8000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    full_name: 'Test User'
  })
});
console.log(await response.json());
```

### 3. Test de Favoritos (con token)
```javascript
const token = 'tu-token-aqui';
const response = await fetch('http://localhost:8000/books/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    book_id: 'OL123W',
    status: 'reading',
    rating: 5
  })
});
console.log(await response.json());
```

---

## 📞 Contacto y Ayuda

Si encuentras problemas:
1. Revisa logs del backend en la terminal
2. Revisa consola del navegador (F12)
3. Verifica que todos los archivos `.env` estén configurados
4. Asegúrate de que Supabase esté configurado correctamente

¡Todo listo para conectar tu backend con el frontend! 🎉

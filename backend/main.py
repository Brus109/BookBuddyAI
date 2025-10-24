from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import books  # Importa el router
from api.routers import auth 

app = FastAPI(title="BookBuddyAI")

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ¡IMPORTANTE! Asegúrate de que esta línea esté ANTES de los routers
app.include_router(books.router)
app.include_router(auth.router)

@app.get("/")
def health_check():
    return {"status": "OK"}
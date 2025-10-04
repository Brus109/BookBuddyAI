from fastapi import FastAPI
from api.routers import books  # Importa el router
from api.routers import auth 

app = FastAPI(title="BookBuddyAI")

# ¡IMPORTANTE! Asegúrate de que esta línea esté ANTES de los routers
app.include_router(books.router)
app.include_router(auth.router)

@app.get("/")
def health_check():
    return {"status": "OK"}
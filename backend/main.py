from fastapi import FastAPI
from api.routers import books  # Importa el router

app = FastAPI(title="BookBuddyAI")

# ¡IMPORTANTE! Asegúrate de que esta línea esté ANTES de los routers
app.include_router(books.router)

@app.get("/")
def health_check():
    return {"status": "OK"}
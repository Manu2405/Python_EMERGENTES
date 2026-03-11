from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='Contactos API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Grupos

@app.get('/api/groups', response_model=list[schemas.GroupOut])
def list_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_groups(db, skip=skip, limit=limit)

@app.post('/api/groups', response_model=schemas.GroupOut)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    return crud.create_group(db, group)

@app.put('/api/groups/{code}', response_model=schemas.GroupOut)
def update_group(code: str, group: schemas.GroupUpdate, db: Session = Depends(get_db)):
    updated = crud.update_group(db, code, group)
    if not updated:
        raise HTTPException(status_code=404, detail='Group not found')
    return updated

# Personas

@app.get('/api/persons', response_model=list[schemas.PersonOut])
def list_persons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_persons(db, skip=skip, limit=limit)

@app.post('/api/persons', response_model=schemas.PersonOut)
def create_person(person: schemas.PersonCreate, db: Session = Depends(get_db)):
    group = crud.get_group(db, person.group_id)
    if not group:
        raise HTTPException(status_code=400, detail='Group not found')
    return crud.create_person(db, person)

@app.put('/api/persons/{code}', response_model=schemas.PersonOut)
def update_person(code: str, person: schemas.PersonUpdate, db: Session = Depends(get_db)):
    updated = crud.update_person(db, code, person)
    if not updated:
        raise HTTPException(status_code=404, detail='Person not found')
    return updated

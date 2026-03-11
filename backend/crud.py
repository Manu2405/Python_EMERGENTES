from sqlalchemy.orm import Session
from . import models, schemas
from uuid import UUID

# Groups

def get_groups(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Group).offset(skip).limit(limit).all()

def get_group(db: Session, code: UUID):
    return db.query(models.Group).filter(models.Group.code == code).first()

def create_group(db: Session, group: schemas.GroupCreate):
    db_group = models.Group(grupo=group.grupo, esta_activo=group.esta_activo)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

def update_group(db: Session, code: UUID, update: schemas.GroupUpdate):
    db_group = get_group(db, code)
    if not db_group:
        return None
    db_group.grupo = update.grupo
    db_group.esta_activo = update.esta_activo
    db.commit()
    db.refresh(db_group)
    return db_group

# Persons

def get_persons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Person).offset(skip).limit(limit).all()

def get_person(db: Session, code: UUID):
    return db.query(models.Person).filter(models.Person.code == code).first()

def create_person(db: Session, person: schemas.PersonCreate):
    db_person = models.Person(
        nombres=person.nombres,
        apellidos=person.apellidos,
        correo=person.correo,
        celular=person.celular,
        direccion=person.direccion,
        observaciones=person.observaciones,
        fotografia_url=person.fotografia_url,
        esta_activo=person.esta_activo,
        group_id=person.group_id,
    )
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

def update_person(db: Session, code: UUID, update: schemas.PersonUpdate):
    db_person = get_person(db, code)
    if not db_person:
        return None
    for field, value in update.dict().items():
        setattr(db_person, field, value)
    db.commit()
    db.refresh(db_person)
    return db_person

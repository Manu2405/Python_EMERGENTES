import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base

class Group(Base):
    __tablename__ = 'groups'

    code = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, unique=True)
    grupo = Column(String(255), nullable=False, unique=True)
    esta_activo = Column(Boolean, nullable=False, default=True)

    persons = relationship('Person', back_populates='group', cascade='all, delete-orphan')

class Person(Base):
    __tablename__ = 'persons'

    code = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, unique=True)
    nombres = Column(String(255), nullable=False)
    apellidos = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False, unique=True)
    celular = Column(String(50), nullable=True)
    direccion = Column(String(500), nullable=True)
    observaciones = Column(String(1000), nullable=True)
    fotografia_url = Column(String(1024), nullable=True)
    esta_activo = Column(Boolean, nullable=False, default=True)

    group_id = Column(UUID(as_uuid=True), ForeignKey('groups.code'), nullable=False)
    group = relationship('Group', back_populates='persons')

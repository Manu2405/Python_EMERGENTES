from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from typing import Optional

class GroupBase(BaseModel):
    grupo: str = Field(..., min_length=1, max_length=255)
    esta_activo: bool = True

class GroupCreate(GroupBase):
    pass

class GroupUpdate(GroupBase):
    pass

class GroupOut(GroupBase):
    code: UUID

    class Config:
        orm_mode = True

class PersonBase(BaseModel):
    nombres: str = Field(..., min_length=1, max_length=255)
    apellidos: str = Field(..., min_length=1, max_length=255)
    correo: EmailStr
    celular: Optional[str] = None
    direccion: Optional[str] = None
    observaciones: Optional[str] = None
    fotografia_url: Optional[str] = None
    esta_activo: bool = True
    group_id: UUID

class PersonCreate(PersonBase):
    pass

class PersonUpdate(PersonBase):
    pass

class PersonOut(PersonBase):
    code: UUID
    group: GroupOut

    class Config:
        orm_mode = True

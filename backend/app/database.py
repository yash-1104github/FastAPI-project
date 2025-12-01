import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

logging.info("Database URL loaded")
logging.info(DATABASE_URL)


engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
logging.info("ORM Base initialized")


def getDb():
    db = SessionLocal()   
    try:
        yield db          
    finally:
        db.close()       
        logging.info("Database session closed")

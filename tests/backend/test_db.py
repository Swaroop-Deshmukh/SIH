import pytest
from app.database import check_db_connection

def test_database_connection_check():
    # Will return True if DB container is up, False gracefully if offline
    res = check_db_connection()
    assert isinstance(res, bool)

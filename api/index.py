import sys
import os

# Add backend/ to Python path so all imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app

# vercel-python looks for a module-level `app` WSGI callable
app = create_app()

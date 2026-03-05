import sys
import os

# Make backend/ importable from the serverless function
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, os.path.abspath(backend_path))

from app import create_app

# Vercel looks for a variable named `app` (WSGI callable)
app = create_app()

"""
config.py
WHAT: Central place for the authorized news domain whitelist and other
shared constants.
WHY: A single source of truth prevents the scraping tool from ever
drifting to an unapproved (and therefore unverified) source.
"""
import os

# Only these domains may be searched/scraped for market news.
# WHY: Freight/shipping news is rife with speculative blogs; restricting
# to known trade-press and institutional sources is how we "eliminate
# misinformation" as required by the spec. Replace with domains you trust.
AUTHORIZED_NEWS_DOMAINS = [
    "lloydslist.com",
    "freightwaves.com",
    "joc.com",  # Journal of Commerce
    "hellenicshippingnews.com",
    "splash247.com",
]

# Resolve repo-relative defaults so a fresh clone works without stale
# absolute paths. Env vars (backend/.env) always take precedence.
_SRC_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_SRC_DIR)
MODEL_DIR_ENV = os.path.join(_BACKEND_DIR, "models")
DATA_DIR_ENV = os.path.join(_BACKEND_DIR, "data")

# Vite dev-server origins allowed by FastAPI CORSMiddleware.
VITE_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

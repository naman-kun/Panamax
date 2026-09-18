"""
config.py
WHAT: Central place for the authorized news domain whitelist and other
shared constants.
WHY: A single source of truth prevents the scraping tool from ever
drifting to an unapproved (and therefore unverified) source.
"""
# Only these domains may be searched/scraped for market news.
# WHY: Freight/shipping news is rife with speculative blogs; restricting
# to known trade-press and institutional sources is how we "eliminate
# misinformation" as required by the spec. Replace with domains you trust.
AUTHORIZED_NEWS_DOMAINS = [
"lloydslist.com",
"freightwaves.com",
"joc.com", # Journal of Commerce
"hellenicshippingnews.com",
"splash247.com",
]
MODEL_DIR_ENV = "~/freight_forecast/models"
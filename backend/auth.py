import os
from fastapi import Header, HTTPException, status

APP_API_KEY = os.getenv("APP_API_KEY")

if not APP_API_KEY:
    # Fail loudly at startup rather than silently running with no auth.
    raise RuntimeError(
        "APP_API_KEY is not set. Add it to your .env file before starting the server."
    )


def require_api_key(x_api_key: str = Header(default=None)):
    """
    Dependency that checks for a valid API key in the X-API-Key header.
    Add `Depends(require_api_key)` to any route you want to protect.
    """
    if x_api_key is None or x_api_key != APP_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )

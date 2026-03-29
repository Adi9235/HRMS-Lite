from typing import Dict, Any, Optional
from datetime import datetime


def utc_now():
    return datetime.utcnow()


def mongo_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not doc:
        return None

    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
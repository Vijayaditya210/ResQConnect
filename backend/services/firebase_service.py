import os
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, Optional
from ..config import FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

_db: Optional[firestore.firestore.Client] = None
_firebase_initialized = False

def initialize_firebase():
    global _db, _firebase_initialized
    if _firebase_initialized:
        return _db
    
    try:
        if FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY:
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": FIREBASE_PROJECT_ID,
                "private_key": FIREBASE_PRIVATE_KEY,
                "client_email": FIREBASE_CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token",
            })
            firebase_admin.initialize_app(cred)
            _db = firestore.client()
            _firebase_initialized = True
            print("Firebase Admin SDK initialized successfully with Cloud Firestore.")
        else:
            print("Firebase Admin credentials not fully configured; using client-side Firestore / Local Adapter sync.")
    except Exception as e:
        print(f"Firebase Admin initialization note: {e}")
    return _db

def get_firestore_client() -> Optional[firestore.firestore.Client]:
    global _db
    if not _firebase_initialized:
        return initialize_firebase()
    return _db

def execute_atomic_allocation(resource_id: str, quantity: int) -> Dict[str, Any]:
    """
    Executes an atomic transaction in Firestore to allocate resources,
    strictly preventing race conditions, duplicate allocations, or negative stock.
    """
    db = get_firestore_client()
    if not db:
        # Client-side will handle Firestore transaction directly
        return {"success": True, "mode": "client_managed"}

    resource_ref = db.collection("resources").document(resource_id)

    @firestore.transactional
    def update_in_transaction(transaction, ref):
        snapshot = ref.get(transaction=transaction)
        if not snapshot.exists:
            raise ValueError(f"Resource {resource_id} does not exist.")
        
        data = snapshot.to_dict()
        available = data.get("available_quantity", 0)
        allocated = data.get("allocated_quantity", 0)

        if available < quantity:
            raise ValueError(f"Insufficient stock: requested {quantity}, available {available}")

        new_available = available - quantity
        new_allocated = allocated + quantity
        new_status = "DEPLETED" if new_available == 0 else ("LOW_STOCK" if new_available < 200 else "AVAILABLE")

        transaction.update(ref, {
            "available_quantity": new_available,
            "allocated_quantity": new_allocated,
            "status": new_status,
            "last_updated": firestore.SERVER_TIMESTAMP
        })
        return {
            "previous_available": available,
            "new_available": new_available,
            "new_allocated": new_allocated
        }

    transaction = db.transaction()
    try:
        result = update_in_transaction(transaction, resource_ref)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

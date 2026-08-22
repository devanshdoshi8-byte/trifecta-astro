from fastapi import APIRouter, HTTPException
from ..schemas.target import TargetInput, ResolvedTarget
from ..services.target_resolver import resolve_target

router = APIRouter(prefix="/targets", tags=["Targets"])

@router.post("/resolve", response_model=ResolvedTarget)
def api_resolve_target(input_data: TargetInput):
    """
    Resolves any target identifier (TIC, TOI, host star, exoplanet name, or coordinates)
    into a canonical internal target representation.
    """
    try:
        resolved = resolve_target(input_data.query, input_data.requested_sector)
        return resolved
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to resolve target: {str(e)}")

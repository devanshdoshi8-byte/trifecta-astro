import io
import csv
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
from ..schemas.results import PhotometricPoint, ChromaticityDiagnostic
from ..science.chromaticity import evaluate_chromaticity_diagnostic

router = APIRouter(prefix="/followup", tags=["Follow-up Photometry"])

@router.post("/upload")
async def upload_followup_photometry(
    file: UploadFile = File(...),
    filter_band: str = Form("g-band"),
    target_id: str = Form("Target")
):
    """
    Parses user-uploaded follow-up photometry CSV/TXT file and returns validated points.
    """
    try:
        content = await file.read()
        text = content.decode("utf-8")
        reader = csv.reader(io.StringIO(text))
        
        points: List[PhotometricPoint] = []
        for row in reader:
            if not row or row[0].startswith("#") or row[0].isalpha():
                continue
            try:
                t = float(row[0])
                f = float(row[1])
                err = float(row[2]) if len(row) > 2 else 0.0005
                points.append(PhotometricPoint(
                    time=t,
                    flux=f,
                    flux_err=err,
                    filter=filter_band
                ))
            except Exception:
                continue

        if len(points) == 0:
            raise HTTPException(status_code=400, detail="No numerical time/flux points found in uploaded file.")

        return {
            "filename": file.filename,
            "filter": filter_band,
            "target_id": target_id,
            "points_count": len(points),
            "points_preview": [p.model_dump() for p in points[:50]],
            "status": "ACCEPTED"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process upload: {str(e)}")

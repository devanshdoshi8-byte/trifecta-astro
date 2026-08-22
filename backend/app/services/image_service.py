from ..schemas.results import ImageCutoutData

def get_target_images(ra_deg: float, dec_deg: float) -> ImageCutoutData:
    """
    Constructs public Pan-STARRS and TESScut image URLs for target coordinates.
    Zero API key required.
    """
    # Pan-STARRS is available for dec > -30 deg
    has_panstarrs = dec_deg > -30.0
    
    panstarrs_url = None
    if has_panstarrs:
        # Standard public Pan-STARRS cutout image endpoint
        panstarrs_url = f"https://ps1images.stsci.edu/cgi-bin/fitscut.cgi?ra={ra_deg:.5f}&dec={dec_deg:.5f}&size=240&format=jpg&red=z&green=r&blue=g"

    # TESScut public URL
    tesscut_url = f"https://mast.stsci.edu/tesscut/api/v0.1/astrocut?ra={ra_deg:.5f}&dec={dec_deg:.5f}&radius=5px"

    return ImageCutoutData(
        has_panstarrs_image=has_panstarrs,
        panstarrs_url=panstarrs_url,
        tesscut_url=tesscut_url,
        skyview_fov_arcmin=1.5
    )

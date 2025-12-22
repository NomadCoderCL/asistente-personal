from typing import Optional
import pytesseract
from PIL import Image

def ocr_contains(image_path: str, needle: str) -> bool:
    """Extrae texto con pytesseract y busca `needle` (case-insensitive)."""
    if not image_path:
        return False
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang='eng+spa')
        return needle.lower() in text.lower()
    except Exception as e:
        print('ocr error', e)
        return False

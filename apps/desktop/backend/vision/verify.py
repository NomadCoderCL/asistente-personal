import os

def file_exists(path: str) -> bool:
    if not path:
        return False
    return os.path.exists(path)

def file_opened(path: str) -> bool:
    # Placeholder: implement platform-specific check if a file is in use
    return False

!define PRODUCT_NAME "Asistente Personal"
!define PRODUCT_VERSION "0.1.0"
!define COMPANY_NAME "Asistente Personal"

OutFile "dist\${PRODUCT_NAME}-Setup-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES\\${PRODUCT_NAME}"
InstallDirRegKey HKLM "Software\\${COMPANY_NAME}\\${PRODUCT_NAME}" "Install_Dir"

SetCompress auto
SetCompressor lzma

Page components
Page directory
Page instfiles
UninstallPage uninstConfirm
UninstallPage instfiles

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File /r "app\\release\\win-unpacked\\*"
  CreateDirectory "$SMPROGRAMS\\${PRODUCT_NAME}"
  CreateShortCut "$SMPROGRAMS\\${PRODUCT_NAME}\\${PRODUCT_NAME}.lnk" "$INSTDIR\\Asistente Personal.exe"
  CreateShortCut "$DESKTOP\\${PRODUCT_NAME}.lnk" "$INSTDIR\\Asistente Personal.exe"
  WriteRegStr HKLM "Software\\${COMPANY_NAME}\\${PRODUCT_NAME}" "Install_Dir" "$INSTDIR"
  WriteUninstaller "$INSTDIR\\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$SMPROGRAMS\\${PRODUCT_NAME}\\${PRODUCT_NAME}.lnk"
  Delete "$DESKTOP\\${PRODUCT_NAME}.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKLM "Software\\${COMPANY_NAME}\\${PRODUCT_NAME}"
SectionEnd

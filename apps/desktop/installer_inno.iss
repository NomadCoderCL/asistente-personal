[Setup]
AppName=Asistente Personal
AppVersion=0.1.0
AppPublisher=Asistente Personal
DefaultDirName={pf}\Asistente Personal
DefaultGroupName=Asistente Personal
OutputDir=dist
OutputBaseFilename=Asistente_Personal-Setup-0.1.0
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
DisableDirPage=no
DisableProgramGroupPage=no
Uninstallable=yes

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el escritorio"; GroupDescription: "Opciones"; Flags: unchecked

[Files]
Source: "app\\release\\win-unpacked\\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\Asistente Personal"; Filename: "{app}\\Asistente Personal.exe"
Name: "{commondesktop}\\Asistente Personal"; Filename: "{app}\\Asistente Personal.exe"; Tasks: desktopicon
Name: "{group}\\Desinstalar Asistente Personal"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\\Asistente Personal.exe"; Description: "Iniciar Asistente Personal"; Flags: nowait postinstall skipifsilent

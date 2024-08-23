@echo off

"C:\dev\WinSCP\WinSCP.com" ^
  /log="C:\temp\WinSCP.log" /ini=nul ^
  /command ^
    "open sftp://root:%EOFOL_PASSWORD%@80.211.202.167/ -hostkey=""ssh-ed25519 255 fR69LSpUtEJ60kjBdvER0/OJTlOKAgc2azekG6U8tkY""" ^
    "call rm -r -f /var/www/eofol/eofol4" ^
    "call mkdir -p /var/www/eofol/eofol4" ^
	"put c:\code\eofol4\build\* /var/www/eofol/eofol4/" ^
    "exit"

set WINSCP_RESULT=%ERRORLEVEL%
if %WINSCP_RESULT% equ 0 (
  echo Success
) else (
  echo Error
)

exit /b %WINSCP_RESULT%

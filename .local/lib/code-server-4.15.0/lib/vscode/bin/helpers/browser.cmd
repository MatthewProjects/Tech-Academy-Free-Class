@echo off
setlocal
set ROOT_DIR=%~dp0..\..\..\..
set VSROOT_DIR=%~dp0..\..
call "%ROOT_DIR%\node.exe" "%VSROOT_DIR%\out\server-cli.js" "code-server" "1.80.1" "74f6148eb9ea00507ec113ec51c489d6ffb4b771" "code-server.cmd" "--openExternal" %*
endlocal

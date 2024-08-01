@echo off
SET BASE_DIR=%~dp0
SET NODE_EXE=%BASE_DIR%node_modules\.bin\node.exe
IF EXIST "%NODE_EXE%" (
    "%NODE_EXE%" "%BASE_DIR%dist\src\index.js" %*
) ELSE (
    node "%BASE_DIR%dist\src\index.js" %*
)
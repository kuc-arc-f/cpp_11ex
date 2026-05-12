# todo_3sql

 Version: 0.9.1

 date    : 2026/05/11

 update :

***

C++ Window Webview2 + React SQLite , LLVM CLang

* TODO app , SQLite database
* LLVM CLang use
* visual studio 2026 community
* node 24
* windows11

***
### related

https://www.sqlite.org/download.html

* sqlite-amalgamation-*.zip , download
* sqlite3.h , sqlite3.c

***
### vcpkg install
```
vcpkg install webview2:x64-windows
vcpkg install nlohmann-json:x64-windows
```

***
### front build

```
npm i
npm run build
```
***
### build

```
clang++ -target x86_64-pc-windows-msvc -m64 -std=c++17 -O2 main.cpp -o main.exe ^
  -I/prog/vcpkg/installed/x64-windows/include ^
  -L/prog/vcpkg/installed/x64-windows/lib ^
  -L./lib ^
  -lWebView2Loader.dll -luser32 -lgdi32 -lole32 -loleaut32 -lsqlite3

```

***

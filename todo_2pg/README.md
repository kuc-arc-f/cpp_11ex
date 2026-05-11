# todo_2pg

 Version: 0.9.1

 date    : 2026/05/10

 update :

***

C++ Window Webview2 + React + postgresql , LLVM CLang

* TODO app
* LLVM CLang use
* visual studio 2026 community
* node 24
* windows11

***
### vcpkg install
```
vcpkg install webview2:x64-windows
vcpkg install nlohmann-json:x64-windows
```

***
### table

* schema.sql

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
  -I/prog/postgresql-18.3-2/pgsql/include ^
  -L/prog/vcpkg/installed/x64-windows/lib ^
  -L/prog/postgresql-18.3-2/pgsql/lib ^
  -lWebView2Loader.dll -luser32 -lgdi32 -lole32 -loleaut32 -llibpq

```

***

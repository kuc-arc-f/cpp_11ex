# book_mark

 Version: 0.9.1

 date    : 2026/05/16

 update :

***

C++ Window Webview2 + React CLang , BookMark 

* LLVM CLang use
* visual studio 2026 community
* node 24
* windows11

***
### API Server

* workers + D1

https://github.com/kuc-arc-f/workers27ex

***
* image

![img1](/images/book_mark.png)

***
### vcpkg install
```
vcpkg install webview2:x64-windows
vcpkg install nlohmann-json:x64-windows
vcpkg install curl:x64-windows
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
  -I./include ^
  -I/prog/vcpkg/installed/x64-windows/include ^
  -L/prog/vcpkg/installed/x64-windows/lib ^
  -lWebView2Loader.dll -luser32 -lgdi32 -lole32 -loleaut32  -llibcurl

```

***

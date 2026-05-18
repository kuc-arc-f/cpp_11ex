// ============================================================
//  MyWebViewApp - C++ / LLVM Clang / WebView2 Desktop App
//  ローカルHTMLファイルを表示するデスクトップアプリ
// ============================================================

#ifndef UNICODE
#define UNICODE
#endif

#include <windows.h>
#include <wrl.h>
#include <wil/com.h>
#include <WebView2.h>

#include <iostream>
#include <fstream>
#include <filesystem>
#include <vector>
#include <sstream>
#include <string>
#include <stdexcept>
#include <shlwapi.h>
#include <thread>

#include "dotenv.h"
#include "nlohmann/json.hpp"

#include "include/http_client.hpp"
#include "include/my_bookmark.hpp"
#include "include/my_todo.hpp"

// JSON用エイリアス
using json = nlohmann::json;
#pragma comment(lib, "shlwapi.lib")
using namespace Microsoft::WRL;

// ── グローバル変数 ─────────────────────────────────────────
static HWND                                    g_hWnd       = nullptr;
static wil::com_ptr<ICoreWebView2Controller>   g_controller;
static wil::com_ptr<ICoreWebView2>             g_webview;

// ── ウィンドウタイトル / クラス名 ─────────────────────────
static constexpr wchar_t APP_TITLE[]     = L"MyWebViewApp";
static constexpr wchar_t WND_CLASS[]     = L"MyWebViewAppClass";

// ── HTMLファイルのパスを取得 ──────────────────────────────
static std::wstring GetHtmlPath()
{
    wchar_t exePath[MAX_PATH] = {};
    GetModuleFileNameW(nullptr, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);               // 実行ファイルのディレクトリ

    std::wstring path = exePath;
    path += L"\\html\\index.html";
    return path;
}

std::string to_utf8(const std::wstring& wstr) {
    if (wstr.empty()) return std::string();
    int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
    return strTo;
}

struct ActionRequest {
    std::string action;
    std::string data;
};

struct QueryReq {
    std::string input;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(QueryReq, input)

struct ChatQuery {
    std::string role;
    std::string content;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(ChatQuery, role, content)

struct ChatRequest {
    std::string model;
    std::vector<ChatQuery> messages;
    double temperature;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(ChatRequest, model, messages, temperature)

std::string extractContent(const std::string& jsonStr)
{
    try {
        auto j = nlohmann::json::parse(jsonStr);
        return j["choices"][0]["message"]["content"].get<std::string>();
    } catch (const std::exception& e) {
        std::cerr << "[ERROR] JSON parse: " << e.what() << "\n";
        return "";
    }
}

std::wstring action_respose(int status_code,  std::string body) {
    ActionResponse resp;
    resp.data = body;
    resp.ret = status_code;
    json j2 = resp;
    std::string json_str = j2.dump();
    std::wstring resp_wstr = StringToWString(json_str);
    return resp_wstr;
}

/**
*
* @param
*
* @return
*/
std::wstring action_handler(const std::wstring& data) {
    ActionResponse resp;
    dotenv env(".env");

    try {    
        resp.ret = 500;
        char* api_url = std::getenv("API_URL_BASE");
        if (api_url) {
            std::cout << "API URL: " << api_url << std::endl;
        } 
        std::string data_u8 = to_utf8(data);
        json j1 = json::parse(data_u8);
        std::string action = j1.at("action").get<std::string>();
        MyBookmark bm_helper(api_url);
        if (action == "book_mark_create") {
            std::wstring resp_wstr = bm_helper.create_handler(data_u8);
            return resp_wstr;
        }
        if (action == "book_mark_list") {
            std::wstring resp_wstr = bm_helper.list_handler(data_u8);
            return resp_wstr;
        }
        if (action == "book_mark_delete") {
            std::wstring resp_wstr = bm_helper.delete_handler(data_u8);
            return resp_wstr;
        }
        if (action == "book_mark_update") {
            std::wstring resp_wstr = bm_helper.update_handler(data_u8);
            return resp_wstr;
        }
        if (action == "book_mark_seacrh") {
            std::wstring resp_wstr = bm_helper.seacrh_handler(data_u8);
            return resp_wstr;
        }

        return L"";
    } catch (const std::exception& ex) {
        std::wstring err = action_respose(500, ex.what());
        return err;
    }
}

// ── WebView2 の初期化 ─────────────────────────────────────
static void InitWebView2(HWND hWnd)
{
    // ユーザーデータフォルダ（実行ファイルと同じ場所に作成）
    wchar_t exePath[MAX_PATH] = {};
    GetModuleFileNameW(nullptr, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring userDataFolder = std::wstring(exePath) + L"\\WebView2Data";

    HRESULT hr = CreateCoreWebView2EnvironmentWithOptions(
        nullptr,                    // ブラウザ実行可能フォルダ (nullptr = 自動検索)
        userDataFolder.c_str(),     // ユーザーデータフォルダ
        nullptr,                    // 追加オプション
        Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
            [hWnd](HRESULT result, ICoreWebView2Environment* env) -> HRESULT
            {
                if (FAILED(result) || !env)
                {
                    MessageBoxW(hWnd,
                        L"WebView2 ランタイムが見つかりません。\n"
                        L"Microsoft Edge WebView2 Runtime をインストールしてください。\n"
                        L"https://developer.microsoft.com/microsoft-edge/webview2/",
                        L"エラー", MB_ICONERROR | MB_OK);
                    PostQuitMessage(1);
                    return result;
                }

                env->CreateCoreWebView2Controller(
                    hWnd,
                    Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
                        [hWnd](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT
                        {
                            if (FAILED(result) || !controller)
                            {
                                MessageBoxW(hWnd, L"WebView2 コントローラの作成に失敗しました。",
                                    L"エラー", MB_ICONERROR | MB_OK);
                                PostQuitMessage(1);
                                return result;
                            }

                            g_controller = controller;
                            g_controller->get_CoreWebView2(&g_webview);

                            // ── WebView2 設定 ──────────────────────
                            wil::com_ptr<ICoreWebView2Settings> settings;
                            g_webview->get_Settings(&settings);
                            if (settings)
                            {
                                settings->put_IsScriptEnabled(TRUE);
                                settings->put_AreDefaultContextMenusEnabled(TRUE);
                                settings->put_IsZoomControlEnabled(TRUE);
                                settings->put_AreDevToolsEnabled(TRUE);   // 開発中はTRUE
                            }

                            // ── ウィンドウサイズに合わせてリサイズ ──
                            RECT bounds;
                            GetClientRect(hWnd, &bounds);
                            g_controller->put_Bounds(bounds);
                            g_controller->put_IsVisible(TRUE);

                            // ── ローカルHTMLファイルをロード ────────
                            std::wstring htmlPath = GetHtmlPath();
                            // file:/// URI に変換
                            std::wstring uri = L"file:///" + htmlPath;
                            // バックスラッシュをスラッシュに変換
                            for (auto& c : uri) if (c == L'\\') c = L'/';

                            g_webview->Navigate(uri.c_str());

                            // ── JS からメッセージを受信した時の処理 ───────
                            g_webview->add_WebMessageReceived(
                                Callback<ICoreWebView2WebMessageReceivedEventHandler>(
                                    [](ICoreWebView2* sender,
                                       ICoreWebView2WebMessageReceivedEventArgs* args) -> HRESULT
                                    {
                                        wil::unique_cotaskmem_string message;
                                        args->TryGetWebMessageAsString(&message);

                                        if (message)
                                        {
                                            std::wstring msgStr = message.get();
                                            
                                            // 受信した文字を確認（デバッグ用）
                                            /*
                                            std::string data_u8 = to_utf8(msgStr);
                                            json j1 = json::parse(data_u8);
                                            std::string data_str = j1.at("data").get<std::string>();
                                            std::wstring data_str_w = StringToWString(data_str);
                                            */
                                            //MessageBoxW(g_hWnd, data_str_w.c_str(), L"C++ 受信", MB_OK);
                                            // 重い処理は別スレッド
                                            std::thread([msgStr]() {
                                                //std::this_thread::sleep_for(
                                                //    std::chrono::seconds(5));
                                                auto resp = action_handler(msgStr);

                                                std::wstring result = resp;

                                                // WebView2操作はUIスレッドへ戻す
                                                 PostMessage(
                                                     g_hWnd,
                                                     WM_APP + 1,
                                                     (WPARAM)new std::wstring(resp),
                                                     0);
                                            }).detach();                                           
                                            // 返信メッセージを作成
                                            //std::wstring response = resp;
                                            // JS にメッセージを送信
                                            //sender->PostWebMessageAsString(response.c_str());
                                        }
                                        return S_OK;
                                    }
                                ).Get(),
                                nullptr
                            );

                            // ── ナビゲーション完了イベント ──────────
                            g_webview->add_NavigationCompleted(
                                Callback<ICoreWebView2NavigationCompletedEventHandler>(
                                    [](ICoreWebView2* sender,
                                       ICoreWebView2NavigationCompletedEventArgs* args) -> HRESULT
                                    {
                                        BOOL success = FALSE;
                                        args->get_IsSuccess(&success);
                                        if (!success)
                                        {
                                            COREWEBVIEW2_WEB_ERROR_STATUS status;
                                            args->get_WebErrorStatus(&status);
                                            // ファイルが見つからない場合はフォールバックHTML
                                            if (status == COREWEBVIEW2_WEB_ERROR_STATUS_CANNOT_CONNECT ||
                                                status == COREWEBVIEW2_WEB_ERROR_STATUS_UNKNOWN)
                                            {
                                                sender->NavigateToString(
                                                    L"<html><body style='font-family:sans-serif;"
                                                    L"display:flex;align-items:center;justify-content:center;"
                                                    L"height:100vh;margin:0;background:#1a1a2e;color:#eee'>"
                                                    L"<div><h2>&#x26A0; HTMLファイルが見つかりません</h2>"
                                                    L"<p>html/index.html を配置してください。</p></div></body></html>"
                                                );
                                            }
                                        }
                                        return S_OK;
                                    }
                                ).Get(),
                                nullptr
                            );

                            return S_OK;
                        }
                    ).Get()
                );
                return S_OK;
            }
        ).Get()
    );

    if (FAILED(hr))
    {
        MessageBoxW(hWnd, L"WebView2 環境の作成に失敗しました。", L"エラー", MB_ICONERROR | MB_OK);
        PostQuitMessage(1);
    }
}

// ── ウィンドウプロシージャ ────────────────────────────────
static LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg)
    {
    case WM_SIZE:
        if (g_controller)
        {
            RECT bounds;
            GetClientRect(hWnd, &bounds);
            g_controller->put_Bounds(bounds);
        }
        return 0;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;

    // ── キーボードショートカット ──────────────────────────
     case WM_KEYDOWN:
         if (wParam == VK_F5 && g_webview)
         {
             g_webview->Reload();               // F5: リロード
         }
         else if (wParam == VK_F12 && g_webview)
         {
             g_webview->OpenDevToolsWindow();   // F12: DevTools
         }
         return 0;

    case WM_APP + 1:
        {
            std::wstring* result = reinterpret_cast<std::wstring*>(wParam);
            if (result && g_webview)
            {
                g_webview->PostWebMessageAsString(result->c_str());
            }
            delete result;
            return 0;
        }

    default:
        return DefWindowProcW(hWnd, msg, wParam, lParam);
    }
}

// ── エントリーポイント ────────────────────────────────────
int WINAPI wWinMain(
    _In_     HINSTANCE hInstance,
    _In_opt_ HINSTANCE /*hPrevInstance*/,
    _In_     LPWSTR    /*lpCmdLine*/,
    _In_     int       nCmdShow)
{
    // DPI 対応
    SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

    // ── ウィンドウクラス登録 ──────────────────────────────
    WNDCLASSEXW wc = {};
    wc.cbSize        = sizeof(wc);
    wc.style         = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc   = WndProc;
    wc.hInstance     = hInstance;
    wc.hCursor       = LoadCursorW(nullptr, IDC_ARROW);
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_WINDOW + 1);
    wc.lpszClassName = WND_CLASS;
    wc.hIcon         = LoadIconW(nullptr, IDI_APPLICATION);

    if (!RegisterClassExW(&wc))
    {
        MessageBoxW(nullptr, L"ウィンドウクラスの登録に失敗しました。", L"エラー", MB_ICONERROR);
        return 1;
    }

    // ── ウィンドウ作成 ────────────────────────────────────
    const int W = 1200, H = 800;
    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);

    g_hWnd = CreateWindowExW(
        0, WND_CLASS, APP_TITLE,
        WS_OVERLAPPEDWINDOW,
        (screenW - W) / 2, (screenH - H) / 2,   // 画面中央
        W, H,
        nullptr, nullptr, hInstance, nullptr
    );

    if (!g_hWnd)
    {
        MessageBoxW(nullptr, L"ウィンドウの作成に失敗しました。", L"エラー", MB_ICONERROR);
        return 1;
    }

    ShowWindow(g_hWnd, nCmdShow);
    UpdateWindow(g_hWnd);

    // ── WebView2 初期化（非同期） ─────────────────────────
    InitWebView2(g_hWnd);

    // ── メッセージループ ──────────────────────────────────
    MSG msg = {};
    while (GetMessageW(&msg, nullptr, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return static_cast<int>(msg.wParam);
}

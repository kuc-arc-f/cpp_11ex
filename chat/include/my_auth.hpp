#pragma once
#include <iostream>
#include <string>
#include <vector>
#include <sodium.h> // libsodium のヘッダー

class MyAuth {
private:
    std::string m_name;

public:
    explicit MyAuth(std::string str){
    }

    ~MyAuth() {}

    bool init_proc(){
        bool ret = false;
        if (sodium_init() < 0) {
            std::cerr << "libsodium の初期化に失敗しました。\n";
            return ret;
        }        
        ret = true;
        return ret;
    }

    // 1. ユーザー登録時：パスワードを安全にハッシュ化する
    std::string HashPasswordArgon2(const std::string& password) {
        bool ret = init_proc();
        if(!ret){
            return "";
        }
        // libsodiumが自動生成する、ソルトや設定情報を含んだ最終的な文字列を格納するバッファ
        // crypto_pwhash_STRBYTES は必要な長さ（通常128バイト）が定義されています
        char hashed_output[crypto_pwhash_STRBYTES];

        // パスワードのハッシュ化を実行
        // 自動的に「安全なソルト生成」→「Argon2idで計算」→「設定情報込みの文字列に整形」をしてくれます
        int result = crypto_pwhash_str(
            hashed_output,
            password.c_str(),
            password.length(),
            crypto_pwhash_OPSLIMIT_INTERACTIVE, // 計算負荷（CPUサイクル数）の設定
            crypto_pwhash_MEMLIMIT_INTERACTIVE  // メモリ消費量の設定（デフォルトで約64MB）
        );

        if (result != 0) {
            throw std::runtime_error("パスワードのハッシュ化に失敗しました（メモリ不足など）。");
        }

        return std::string(hashed_output);
    }

    // 2. ログイン時：入力されたパスワードと、DBに保存されているハッシュ値を検証する
    bool VerifyPasswordArgon2(const std::string& input_password, const std::string& stored_hash) {
        // crypto_pwhash_str_verify は、保存された文字列から自動的にソルトや計算設定を読み取って検証します
        int result = crypto_pwhash_str_verify(
            stored_hash.c_str(),
            input_password.c_str(),
            input_password.length()
        );

        // 一致すれば 0 が返り、一致しなければ -1 が返ります
        return (result == 0);
    }    
};

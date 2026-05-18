#pragma once
#include <iostream>

#include "nlohmann/json.hpp"
#include "http_client.hpp"

// JSON用エイリアス
using json = nlohmann::json;

struct ActionResponse {
    int ret;
    std::string data;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(ActionResponse, ret, data)


std::wstring StringToWString(const std::string& str)
{
    if (str.empty()) return L"";

    int size_needed = MultiByteToWideChar(
        CP_UTF8, 0,
        str.c_str(), (int)str.size(),
        NULL, 0
    );

    std::wstring wstr(size_needed, 0);

    MultiByteToWideChar(
        CP_UTF8, 0,
        str.c_str(), (int)str.size(),
        &wstr[0], size_needed
    );

    return wstr;
}

class MyBookmark {
private:
    std::string m_api_url = "";

public:
    explicit MyBookmark(std::string str){
        m_api_url = str;
    }
    ~MyBookmark() {}

    std::string action_respose(int status_code,  std::string body) {
        ActionResponse resp;
        resp.data = body;
        resp.ret = status_code;
        json j2 = resp;
        std::string json_str = j2.dump();
        //std::wstring resp_wstr = StringToWString(json_str);
        return json_str;
    }

    std::wstring create_handler(std::string data){
        json j1 = json::parse(data);
        std::string path_str = j1.at("path").get<std::string>();
        std::string data_str = j1.at("data").get<std::string>();
        HttpClient client(30 /*timeout*/, true /*verify_ssl*/);

        std::string api_url = m_api_url + path_str;
        auto res2 = client.post_json(api_url , data_str);
        if (!res2.error.empty()) {
            std::string res3 = action_respose(500, res2.error);
            std::wstring resp_wstr = StringToWString(res3);
            return resp_wstr;
        }
        ActionResponse resp;
        resp.data = res2.body;
        resp.ret = 200;
        json j2 = resp;
        std::string json_str = j2.dump();
        std::wstring resp_wstr = StringToWString(json_str);
        return resp_wstr;
    }

    std::wstring list_handler(std::string data){
        json j1 = json::parse(data);
        std::string path_str = j1.at("path").get<std::string>();
        std::string data_str = j1.at("data").get<std::string>();
        HttpClient client(30 /*timeout*/, true /*verify_ssl*/);

        std::string api_url = m_api_url + path_str;
        auto res2 = client.post_json(api_url , data_str);
        if (!res2.error.empty()) {
            std::string res3 = action_respose(500, res2.error);
            std::wstring resp_wstr = StringToWString(res3);
            return resp_wstr;
        }
        ActionResponse resp;
        resp.data = res2.body;
        resp.ret = 200;
        json j2 = resp;
        std::string json_str = j2.dump();
        std::wstring resp_wstr = StringToWString(json_str);
        return resp_wstr;
    }

    std::wstring delete_handler(std::string data){
        json j1 = json::parse(data);
        std::string data_str = j1.at("data").get<std::string>();
        std::string path_str = j1.at("path").get<std::string>();

        HttpClient client(30 /*timeout*/, true /*verify_ssl*/);

        std::string api_url = m_api_url + path_str;
        auto res2 = client.post_json(api_url , data_str);
        if (!res2.error.empty()) {
            std::string res3 = action_respose(500, res2.error);
            std::wstring resp_wstr = StringToWString(res3);
            return resp_wstr;
        }

        ActionResponse resp;
        resp.data = res2.body;
        resp.ret = 200;
        json j2 = resp;
        std::string json_str = j2.dump();
        std::wstring resp_wstr = StringToWString(json_str);
        return resp_wstr;
    }

    std::wstring update_handler(std::string data){
        json j1 = json::parse(data);
        std::string data_str = j1.at("data").get<std::string>();
        std::string path_str = j1.at("path").get<std::string>();
        HttpClient client(30 /*timeout*/, true /*verify_ssl*/);

        std::string api_url = m_api_url + path_str;
        auto res2 = client.post_json(api_url , data_str);
        if (!res2.error.empty()) {
            std::string res3 = action_respose(500, res2.error);
            std::wstring resp_wstr = StringToWString(res3);
            return resp_wstr;
        }        
        ActionResponse resp;
        resp.data = res2.body;
        resp.ret = 200;
        json j2 = resp;
        std::string json_str = j2.dump();
        std::wstring resp_wstr = StringToWString(json_str);
        return resp_wstr;
    }

    std::wstring seacrh_handler(std::string data){
        json j1 = json::parse(data);
        std::string data_str = j1.at("data").get<std::string>();
        std::string path_str = j1.at("path").get<std::string>();

        HttpClient client(30 /*timeout*/, true /*verify_ssl*/);

        std::string api_url = m_api_url + path_str;
        auto res2 = client.post_json(api_url , data_str);
        if (!res2.error.empty()) {
            std::string res3 = action_respose(500, res2.error);
            std::wstring resp_wstr = StringToWString(res3);
            return resp_wstr;
        }
        ActionResponse resp;
        resp.data = res2.body;            
        resp.ret = 200;
        json j2 = resp;
        std::string json_str = j2.dump();
        std::wstring resp_wstr = StringToWString(json_str);
        return resp_wstr;
    }


};

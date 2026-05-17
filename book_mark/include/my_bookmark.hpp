#pragma once
#include <iostream>

class MyBookmark {
private:
    std::string m_api_url = "";

public:
    explicit MyBookmark(std::string str){}

    void hoge(std::string str) {
      std::cout << str << " \n";
    }

    ~MyBookmark() {}
};

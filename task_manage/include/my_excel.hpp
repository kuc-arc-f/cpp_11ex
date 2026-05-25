#pragma once
#include <xlsxwriter.h>
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <algorithm>


// ─────────────────────────────────────────────
// Data structures
// ─────────────────────────────────────────────
struct TaskRow {
    int         id;
    std::string title;
    std::string start_date;   // "YYYY-MM-DD"
    std::string end_date;     // "YYYY-MM-DD"
    std::string status;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(TaskRow, id, title, start_date, end_date, status)

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Parse "YYYY-MM-DD" → std::tm (UTC midnight)
static std::tm parse_date(const std::string& s) {
    std::tm tm{};
    std::istringstream ss(s);
    ss >> std::get_time(&tm, "%Y-%m-%d");
    return tm;
}

// Convert std::tm → time_t
static time_t to_time_t(std::tm tm) {
    return mktime(&tm);
}

// Return all calendar dates between start and end (inclusive)
static std::vector<std::tm> date_range(const std::string& start, const std::string& end) {
    std::vector<std::tm> dates;
    std::tm cur = parse_date(start);
    std::tm e   = parse_date(end);
    time_t t_end = to_time_t(e);

    while (to_time_t(cur) <= t_end) {
        dates.push_back(cur);
        cur.tm_mday++;
        mktime(&cur);          // normalise
    }
    return dates;
}

// Format std::tm → "M/D"
static std::string fmt_md(const std::tm& tm) {
    std::ostringstream ss;
    ss << (tm.tm_mon + 1) << "/" << tm.tm_mday;
    return ss.str();
}

// Check whether a task is active on a given calendar date
static bool is_active(const TaskRow& task, const std::tm& day) {
    time_t t_day   = to_time_t(const_cast<std::tm&>(day));
    std::tm ts     = parse_date(task.start_date);
    std::tm te     = parse_date(task.end_date);
    time_t t_start = to_time_t(ts);
    time_t t_end   = to_time_t(te);
    return t_day >= t_start && t_day <= t_end;
}

// ─────────────────────────────────────────────
// Collect all unique calendar dates across tasks
// ─────────────────────────────────────────────
static std::vector<std::tm> collect_dates(const std::vector<TaskRow>& tasks) {
    std::string min_date, max_date;
    for (const auto& t : tasks) {
        if (min_date.empty() || t.start_date < min_date) min_date = t.start_date;
        if (max_date.empty() || t.end_date   > max_date) max_date = t.end_date;
    }
    return date_range(min_date, max_date);
}

class MyExcel {
private:
    std::string m_name;
    
public:
    explicit MyExcel(std::string str){}

    // ─────────────────────────────────────────────
    // Excel generation
    // ─────────────────────────────────────────────
    static void write_gantt(const std::vector<TaskRow>& tasks, const char* filename) {

        lxw_workbook*  wb = workbook_new(filename);
        lxw_worksheet* ws = workbook_add_worksheet(wb, "Gantt");

        // ── Formats ──────────────────────────────
        // Header row (date labels) – centred, bold, thin border, light blue bg
        lxw_format* fmt_header = workbook_add_format(wb);
        format_set_bold(fmt_header);
        format_set_align(fmt_header, LXW_ALIGN_CENTER);
        format_set_align(fmt_header, LXW_ALIGN_VERTICAL_CENTER);
        format_set_bg_color(fmt_header, 0xBDD7EE);   // light blue
        format_set_border(fmt_header, LXW_BORDER_THIN);
        format_set_font_name(fmt_header, "Arial");
        format_set_font_size(fmt_header, 10);

        // Task title cell – left-aligned, bold, thin border
        lxw_format* fmt_title = workbook_add_format(wb);
        format_set_bold(fmt_title);
        format_set_align(fmt_title, LXW_ALIGN_LEFT);
        format_set_align(fmt_title, LXW_ALIGN_VERTICAL_CENTER);
        format_set_border(fmt_title, LXW_BORDER_THIN);
        format_set_font_name(fmt_title, "Arial");
        format_set_font_size(fmt_title, 10);

        // Empty cell – thin border
        lxw_format* fmt_empty = workbook_add_format(wb);
        format_set_border(fmt_empty, LXW_BORDER_THIN);
        format_set_align(fmt_empty, LXW_ALIGN_CENTER);
        format_set_font_name(fmt_empty, "Arial");
        format_set_font_size(fmt_empty, 10);

        // Active (filled) cell – filled circle symbol, dark blue bg
        lxw_format* fmt_active = workbook_add_format(wb);
        format_set_border(fmt_active, LXW_BORDER_THIN);
        format_set_align(fmt_active, LXW_ALIGN_CENTER);
        format_set_align(fmt_active, LXW_ALIGN_VERTICAL_CENTER);
        format_set_bg_color(fmt_active, 0xFFFFFF);   // white bg, dot via text
        format_set_font_name(fmt_active, "Arial");
        format_set_font_size(fmt_active, 14);

        // Top-left corner header cell
        lxw_format* fmt_corner = workbook_add_format(wb);
        format_set_border(fmt_corner, LXW_BORDER_THIN);
        format_set_bg_color(fmt_corner, 0xBDD7EE);
        format_set_font_name(fmt_corner, "Arial");
        format_set_font_size(fmt_corner, 10);

        // ── Layout constants ──────────────────────
        const int TITLE_COL  = 0;   // Column A  → task names
        const int DATE_START = 1;   // Column B  → first date
        const int HEADER_ROW = 0;   // Row 1     → date headers
        const int DATA_ROW   = 1;   // Row 2..   → task rows

        // ── Column widths ─────────────────────────
        worksheet_set_column(ws, TITLE_COL, TITLE_COL, 14, nullptr);   // task name col

        // ── Collect date range ────────────────────
        std::vector<std::tm> dates = collect_dates(tasks);

        // ── Write date header row ─────────────────
        worksheet_write_blank(ws, HEADER_ROW, TITLE_COL, fmt_corner);

        for (int c = 0; c < (int)dates.size(); ++c) {
            std::string label = fmt_md(dates[c]);
            worksheet_write_string(ws, HEADER_ROW, DATE_START + c, label.c_str(), fmt_header);
            worksheet_set_column(ws, DATE_START + c, DATE_START + c, 5.5, nullptr);
        }

        // ── Write task rows ───────────────────────
        for (int r = 0; r < (int)tasks.size(); ++r) {
            const TaskRow& task = tasks[r];
            int row = DATA_ROW + r;

            // Task title
            worksheet_write_string(ws, row, TITLE_COL, task.title.c_str(), fmt_title);

            // Date columns
            for (int c = 0; c < (int)dates.size(); ++c) {
                if (is_active(task, dates[c])) {
                    // Write a filled circle character (U+25CF BLACK CIRCLE)
                    worksheet_write_string(ws, row, DATE_START + c, "\xe2\x97\x8f", fmt_active);
                } else {
                    worksheet_write_blank(ws, row, DATE_START + c, fmt_empty);
                }
            }

            // Row height
            worksheet_set_row(ws, row, 18, nullptr);
        }

        // Header row height
        worksheet_set_row(ws, HEADER_ROW, 20, nullptr);

        workbook_close(wb);
        std::cout << "Generated: " << filename << "\n";
    }
    void hoge(std::string str) {
      std::cout << str << " \n";
    }

    ~MyExcel() {}

};

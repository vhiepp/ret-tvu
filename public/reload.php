<?php
require 'vendor/autoload.php';

use Google\Client;
use Google\Service\Sheets;

$serviceAccountFile = 'rettvu-b5c632f2a1b5.json'; // Thay bằng đường dẫn file JSON của bạn
const spreadsheetId = '1OPDsM_YuAVo1IURhd4GCEgxQR-hvXdgZ5CI1gDIogaE'; // ID của Google Sheet

// Tên của sheet và phạm vi cần đọc (ví dụ: "Sheet1!A1:C10")


// Tạo client Google API
$client = new Client();
$client->setAuthConfig($serviceAccountFile);
$client->setScopes([Sheets::SPREADSHEETS_READONLY]);

// Tạo service Google Sheets
$service = new Sheets($client);

function parseContent($content)
{
    $lines = explode("\n", $content);
    $parsedContent = [];
    $currentItem = [];

    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) {
            continue;
        }

        // Kiểm tra định dạng key: value
        if (preg_match('/^(Time|Type|Name|Title|Speaker|Chairs|Text|Seminar_preliminary|Opening_speech):\s*(.*)$/', $line, $matches)) {
            if (!empty($currentItem) && $matches[1] == 'Time') {
                $parsedContent[] = $currentItem;
                $currentItem = [];
            }
            // $key = strtolower($matches[1]);
            $key = $matches[1];
            $value = $matches[2];

            // Nếu key là Chairs, tách các giá trị và lưu vào mảng
            if ($key === 'Chairs') {
                $currentItem[$key] = array_map('trim', explode(',', $value));
            } else {
                $currentItem[$key] = $value;
            }
        } else {
            // Xử lý các dòng không có key
            if (!isset($currentItem['description'])) {
                $currentItem['description'] = $line;
            } else {
                $currentItem['description'] .= "\n" . $line;
            }
        }
        $currentItem['description'] = "";
    }

    if (!empty($currentItem)) {
        $parsedContent[] = $currentItem;
    }

    return $parsedContent;
}

function transformData2($data)
{
    $transformed = [];

    foreach ($data as $entry) {
        $transformed[] = [
            'index' => $entry['index'],
            'session' => $entry['session'],
            'date' => $entry['date'],
            'room' => $entry['room'],
            'content' => parseContent($entry['content']),
        ];
    }

    return $transformed;
}

// Các hàm xử lý dữ liệu
function parseSessionChairs($sessionchairs)
{
    return array_map('trim', explode(',', $sessionchairs));
}

function parseTimeInfo($timeString)
{
    $timePattern = '/- Time: \[(.*?)\]\n- Title: (.*?)\n- Authors: (.*?)\n- Chairs: (.*?)(?=\n|$)/s';
    $result = [];
    if (preg_match($timePattern, $timeString, $matches)) {
        $time = $matches[1];
        $title = $matches[2];
        $authors = array_map('trim', explode(',', $matches[3]));
        $chairs = array_map('trim', explode(',', $matches[4]));

        $result = [
            'time' => $time,
            'title' => $title,
            'authors' => $authors,
            'chairs' => $chairs,
        ];
    }
    return $result;
}

function transformData($data)
{
    $transformed = [];

    foreach ($data as $entry) {
        $times = [];
        for ($i = 1; $i <= 10; $i++) {
            if (isset($entry["time$i"])) {
                // Loại bỏ các ký tự \r và khoảng trắng thừa khỏi từng mục thời gian
                $timeString = str_replace("\r", "", trim($entry["time$i"]));
                $timeInfo = parseTimeInfo($timeString);
                if (!empty($timeInfo)) {
                    $times[] = $timeInfo;
                }
            }
        }

        $transformed[] = [
            'stt' => $entry['stt'],
            'room' => $entry['room'],
            'sessionchairs' => parseSessionChairs($entry['sessionchairs']),
            'times' => $times,
            'title' => $entry['title']
        ];
    }

    return $transformed;
}

// aubout_ret
function getAboutRET($service) {
    $filePath = "about_ret.json";
    $range = 'About RET!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), null));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[About RET] Lưu dữ liệu thành công. < br />";    
}

// committees
function getCommittees($service) {
    $filePath = "committees.json";
    $range = 'Committees!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = $values[0];
        $dataTemps = [];
        unset($values[0]);
        foreach ($values as $index => $value) {
            $dataTemps[$value[0]][] = mb_convert_encoding($value[1], "UTF-8", "auto");
        }
        foreach ($dataTemps as $key => $value) {
            $data[] = [
                $keys[0] => $key,
                $keys[1] => $value
            ];
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Committees] Lưu dữ liệu thành công. < br />";    
}

// conference-program
function getConferenceProgram($service) {
    $filePath = "conference-program.json";
    $range = 'Conference-Program!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), null));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode(transformData2($data), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Conference-Program] Lưu dữ liệu thành công. < br />";    
}

// contact
function getContact($service) {
    $filePath = "contact.json";
    $range = 'Contact!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), null));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Contact] Lưu dữ liệu thành công. < br />";    
}

// important_date
function getImportantDate($service) {
    $filePath = "important_date.json";
    $range = 'Important_Date!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Important_Date] Lưu dữ liệu thành công. < br />";    
}

// ProgramParallelSession1
function getProgramParallelSession1($service) {
    $filePath = "program-parallel-sessions-1.json";
    $range = 'Program-Parallel-Sessions-1!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode(transformData($data), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[ProgramParallelSession1] Lưu dữ liệu thành công. < br />";    
}

// ProgramParallelSession2
function getProgramParallelSession2($service) {
    $filePath = "program-parallel-sessions-2.json";
    $range = 'Program-Parallel-Sessions-2!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode(transformData($data), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[ProgramParallelSession2] Lưu dữ liệu thành công. < br />";    
}

// Registration
function getRegistration($service) {
    $filePath = "registration.json";
    $range = 'Registration!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Registration] Lưu dữ liệu thành công. < br />";    
}

// Speakers
function getSpeakers($service) {
    $filePath = "speakers.json";
    $range = 'Speakers!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Speakers] Lưu dữ liệu thành công. < br />";    
}

// SubmissionGuideline
function getSubmissionGuideline($service) {
    $filePath = "submission_guideline.json";
    $range = 'Submission_Guideline!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), ""));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Submission_Guideline] Lưu dữ liệu thành công. < br />";    
}

// topics
function getTopics($service) {
    $filePath = "topics.json";
    $range = 'Topic!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), null));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[Topics] Lưu dữ liệu thành công. < br />";    
}

// travel_info
function getTravelInfo($service) {
    $filePath = "travel_info.json";
    $range = 'Travel_Info!A1:Z';
    // Gửi yêu cầu đọc dữ liệu từ Google Sheet
    $response = $service->spreadsheets_values->get(spreadsheetId, $range);

    // Lấy dữ liệu
    $values = $response->getValues();

    $data = [];

    if (empty($values)) {
        echo "Không có dữ liệu.";
    } else {
        $keys = array_shift($values);
        // Chuyển từng hàng thành dạng key-value
        foreach ($values as $row) {
            $data[] = array_combine($keys, array_pad($row, count($keys), null));
        }
    }
    // Lưu dữ liệu vào file JSON
    file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    // echo "[TravelInfo] Lưu dữ liệu thành công. < br />";    
}

session_start();

function ok($service) {
    getAboutRET($service);
    getCommittees($service);
    getConferenceProgram($service);
    getContact($service);
    getImportantDate($service);
    getProgramParallelSession1($service);
    getProgramParallelSession2($service);
    getRegistration($service);
    getSpeakers($service);
    getSubmissionGuideline($service);
    getTopics($service);
    getTravelInfo($service);
    echo "<script>alert('Reload du lieu thanh cong!');window.history.back();</script>";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $password = $_POST['password'] ?? '';
    if ($password === "22555") {
        ok($service);
        exit;
    } else {
        echo "<script>alert('Sai mat khau');</script>";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reload dữ liệu</title>
</head>
<body>
    <script>
        let password = prompt("Nhap mat khau:");
        if (password) {
            let form = document.createElement("form");
            form.method = "POST";
            form.action = "";
            let input = document.createElement("input");
            input.type = "hidden";
            input.name = "password";
            input.value = password;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    </script>
</body>
</html>
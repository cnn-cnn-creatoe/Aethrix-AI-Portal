@echo off
echo ========================================
echo 测试所有服务访问状态
echo ========================================
echo.

echo [1/9] 测试主应用 (http://localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://localhost
echo.

echo [2/9] 测试 Bureau F (http://bureau-f.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://bureau-f.localhost
echo.

echo [3/9] 测试 Rocket.Chat (http://chat.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://chat.localhost
echo.

echo [4/9] 测试 Focalboard (http://board.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://board.localhost
echo.

echo [5/9] 测试 BookStack (http://books.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://books.localhost
echo.

echo [6/9] 测试 Excalidraw (http://draw.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://draw.localhost
echo.

echo [7/9] 测试 IT-Tools (http://tools.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://tools.localhost
echo.

echo [8/9] 测试 LibreSpeed (http://speed.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://speed.localhost
echo.

echo [9/9] 测试 Dozzle (http://logs.localhost)
curl -s -o nul -w "状态码: %%{http_code}\n" http://logs.localhost
echo.

echo ========================================
echo 测试完成！
echo ========================================
echo.
echo 提示：如果看到 000 状态码，说明需要在 hosts 文件中添加域名映射
echo Windows hosts 文件位置: C:\Windows\System32\drivers\etc\hosts
echo.
echo 需要添加的内容：
echo 127.0.0.1 localhost
echo 127.0.0.1 bureau-f.localhost
echo 127.0.0.1 chat.localhost
echo 127.0.0.1 board.localhost
echo 127.0.0.1 books.localhost
echo 127.0.0.1 draw.localhost
echo 127.0.0.1 tools.localhost
echo 127.0.0.1 speed.localhost
echo 127.0.0.1 logs.localhost
pause
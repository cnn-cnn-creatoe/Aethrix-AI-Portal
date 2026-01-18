from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # 确保JSON响应正确显示非ASCII字符

# 数据库连接配置（示例使用MySQL）
DB_CONNECTION_STRING = "mysql+pymysql://（数据库地址）"

@app.route('/execute_query', methods=['POST'])
def execute_query():
    """处理POST请求以执行SQL查询。"""
    try:
        data = request.get_json()
        sql_queries = data.get('sql_query')

        if not sql_queries:
            return jsonify({"error": "Missing sql_query parameter"}), 400

        # 建立数据库连接
        conn = pymysql.connect(
            host="(数据库地址)",
            user="数据库用户名",
            password="数据库密码",
            database="数据库名",
            port=端口,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

        cursor = conn.cursor()

        # 分割SQL语句并逐个执行
        for sql_query in sql_queries.split(';'):
            if sql_query.strip():
                cursor.execute(sql_query)

        # 获取结果
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        # 返回状态码200的JSON结果
        return jsonify(results), 200

    except Exception as e:
        app.logger.error(f"发生错误: {e}")  # 记录错误以供调试
        return jsonify({"error": str(e)}), 500  # 返回状态码500作为服务器错误

if __name__ == '__main__':
    # 在指定的主机和端口上运行Flask应用，并启用调试模式
    app.run(host='192.168.8.194', port=5003, debug=True)
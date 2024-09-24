import React, { useState, useEffect } from "react";
import "./App.less";

function App() {
  const [number, setNumber] = useState(35); // 设置一个较大的数来演示
  const [result, setResult] = useState(null);
  const [isWorkerRunning, setIsWorkerRunning] = useState(false);
  console.log(error);
  useEffect(() => {
    // 创建 Worker 实例
    const worker = new Worker(
      new URL("./workers/heavyTaskWorker.js", import.meta.url)
    );

    // 监听来自 Worker 的消息
    worker.onmessage = (event) => {
      setResult(event.data);
      setIsWorkerRunning(false);
      worker.terminate(); // 计算完成后终止 Worker
    };

    // 发送数据到 Worker
    if (number !== null) {
      setIsWorkerRunning(true);
      worker.postMessage(number);
    }

    // 清理 Worker
    return () => {
      worker.terminate();
    };
  }, [number]);

  const handleCalculate = () => {
    setResult(null);
    setNumber(35); // 你可以根据需要调整这个值
  };

  return (
    <div className="App">
      <h1>使用 Web Worker 的 Rsbuild 示例</h1>
      <button onClick={handleCalculate} disabled={isWorkerRunning}>
        {isWorkerRunning ? "计算中..." : "开始计算斐波那契数"}
      </button>
      {result !== null && (
        <p>
          斐波那契数（第 {number} 项）是: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}

export default App;

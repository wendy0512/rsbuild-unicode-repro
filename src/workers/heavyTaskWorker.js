// heavyTaskWorker.js

// 监听来自主线程的消息
self.onmessage = (event) => {
  const number = event.data;
  // 执行耗时的计算任务，例如计算斐波那契数
  const result = fibonacci(number);
  // 将结果发送回主线程
  self.postMessage(result);
};

// 示例：递归计算斐波那契数（注意：这种方法效率低，仅用于演示）
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

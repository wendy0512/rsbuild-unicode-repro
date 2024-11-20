import styled from "styled-components";
import "./App.less";

function App() {
  return (
    <div className="App">
      <h1>使用 Unicode 的 Rsbuild 示例</h1>
      <div>
        <span className="icons iconfont">less中的unicode编码</span>
      </div>
      <div>
        <IconStyleWrapper className="iconfont">
          测试styled-components中的unicode编码
        </IconStyleWrapper>
      </div>
      <div>
        <UnicodeStyleWrapper className="iconfont">
          测试styled-components中的完整unicode编码
        </UnicodeStyleWrapper>
      </div>
    </div>
  );
}

const IconStyleWrapper = styled.span`
  &::after {
    display: inline-block;
    width: 16px;
    height: 16px;
    content: "\e67f";
  }
`;
const UnicodeStyleWrapper = styled.span`
  &::after {
    display: inline-block;
    width: 16px;
    height: 16px;
    content: "\ue67f";
  }
`;

export default App;

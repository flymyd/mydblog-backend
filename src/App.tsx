import './App.css'
import routes, {onRouteBefore} from './router/index';
import RouterGuard from "@/router/RouterGuard";

function App() {
  return <div className="App">
    <RouterGuard
      routers={routes}
      onRouterBefore={onRouteBefore}
      loading={<span>加载中...</span>}
    />
  </div>
}

export default App;

import {FC} from "react";

const Home: FC = () => {
  console.log(import.meta.env)
  return (
    <div>
      <h1>MYD's Blog管理</h1>
      <h1>当前环境：{import.meta.env.MODE}</h1>
      <h1>当前API服务器：{import.meta.env.VITE_API_URL}</h1>
    </div>
  )
}
export default Home;

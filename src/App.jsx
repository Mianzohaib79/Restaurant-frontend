import { ConfigProvider, App as AntdApp } from 'antd'
import Routes from './pages/Routes'

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f97316', // Orange 500
            borderRadius: 16,
            fontFamily: 'Inter, system-ui, sans-serif',
            colorLink: '#f97316',
            colorLinkHover: '#ea580c',
          },
          components: {
            Button: {
              controlHeight: 40,
              fontWeight: 600,
              borderRadius: 12,
            },
            Input: {
              controlHeight: 45,
              borderRadius: 12,
            },
            Card: {
              borderRadiusLG: 24,
            },
          },
        }}
      >
        {/* ⬇️ component={false} lagane se antd aapke layout aur colors ko kharab nahi karega */}
        <AntdApp component={false}>
          <Routes />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}

export default App
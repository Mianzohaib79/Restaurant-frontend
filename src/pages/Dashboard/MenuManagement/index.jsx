import Menu from './Menu'
import { Routes, Route } from 'react-router-dom'
import EditMenu from './EditMenu'

const MenuManagement = () => {
    return (
        <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/edit/:id" element={<EditMenu />} />
        </Routes>
    )
}

export default MenuManagement
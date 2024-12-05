
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import '../../../admin/src/App.css'


const App = () => {
  return (

       <Routes>
      <Route index element={<HomePage />} />
      {/* <Route path="*" element={<Page.Error />} /> */}
    </Routes>
   
   
  );
};

export { App };

import {BrowserRouter, Route, Routes} from "react-router-dom";
import ShowUsers from "./components/ShowUsers";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ShowUsers/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

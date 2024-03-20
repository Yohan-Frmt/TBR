import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Create, Home } from "./Page";
import { Container } from "./Page/Container";
import { UserProvider } from "./Provider";

const App = () => {
    return (
        <div>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={ "lobby/:name" } element={ <Container/> }/>
                        <Route path={ "create" } element={ <Create/> }/>
                        {/*<Route path="join" element={ <Join/> }/>*/ }
                        <Route path={ "/" } element={ <Home/> }/>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
};

export default App;

import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom";
import { Button } from "../Component";

export const Home = () => {
    const navigate: NavigateFunction = useNavigate();
    const { error }: Params<string> = useParams();

    return (
        <>
            { error && (
                <div className="error">{ decodeURIComponent(error) }</div>
            ) }
            <h1>TSR</h1>
            <div className="home">
                <Button title="Create Room" onClick={ () => navigate("/create") }/>
                <Button title="Join Room" onClick={ () => navigate("/join") }/>
            </div>
        </>
    );
};

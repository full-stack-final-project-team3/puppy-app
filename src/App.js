import React from "react";
import {RouterProvider} from "react-router-dom";
import {router} from "./config/user/route-config";

const App = () => {
    return (
            <RouterProvider router={router}/>
    );
};

export default App;

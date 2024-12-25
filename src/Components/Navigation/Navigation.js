import React from "react";

const Navigation = ({onRouteChange}) => {
return(
    <nav style={{display:"flex", justifyContent:"flex-end"}}>
        <p className="b--solid br4 grow pa2 mr3 bg-navy pointer" style={{color:"white"}} onClick={()=> onRouteChange("SignIn")}> Sign Out</p>
    </nav>
);
}

export default Navigation;
import "@/styles/banner.css";
import { useEffect, useState } from "react";
import mountainsImage from "@/assets/mountains.png";

const Banner = () => {
    const [background, setBackground] = useState("");

    useEffect(() => {
        const updateBackground = () => {
            const hour = new Date().getHours();            

            if (hour >= 18 && hour < 19) {
                setBackground("linear-gradient(0deg,#fbd28b 20%, #ff9f40 25%, #f55312 30%, #060557 80%)");
            } else if (hour >= 4 && hour < 6) {
                setBackground("linear-gradient(0deg, #BA381E 70%, #BA861E 80%, #1E9BBA 95%, #4FAEA7 110%)");
            } else if (hour >= 6 && hour < 15) {
                setBackground("linear-gradient(0deg, #86DFFF, #35CAFF)");
            } else if (hour >= 15 && hour < 18) {
                setBackground("linear-gradient(0deg, #7DB2C6, #0C8FBF)");
            } else {
                setBackground("linear-gradient(135deg, #132237, #1c2a3b)");
            }
        };

        updateBackground();

        const interval = setInterval(updateBackground, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner" style={{ background }}>
            
            <img src={mountainsImage} alt="Mountains" className="logo" />
        </div>
    );
    
};

export default Banner;

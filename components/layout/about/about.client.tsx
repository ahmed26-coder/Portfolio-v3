
import About from "./about.chunks";
import { Skills } from "../home/home.client";


const Page = () => {
    
    return (
        <div className="w-full max-w-[1200px] mx-auto px-5 sm:mt-[7%] mt-[22%]">
            <About />
            <Skills isBoxedLayout={true} />
        </div>
    );
};

export default Page;

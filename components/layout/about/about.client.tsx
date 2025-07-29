"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import About from "./about.chunks";

type Skill = {
    id: number;
    title: string;
    img: string;
    description: string;
};

const Page = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            const { data, error } = await supabase.from("Skills").select("*");
            if (error) {
                console.error("Error fetching skills:", error.message);
            } else {
                setSkills(data);
            }
            setLoading(false);
        };

        fetchSkills();
    }, []);

    return (
        <div className="w-full max-w-[1200px] mx-auto px-5 sm:mt-[7%] mt-[22%]">
            <About />
            <div className="border-2 border-gray-300 my-10 dark:border-[#FFFFFF]/6 rounded-lg p-5 sm:p-10">
                <h2 className="text-3xl font-bold text-center sm:text-left">
                    User experiences
                </h2>
                <p className="text-[#999999] text-center sm:text-left">
                    Programs, offices, and experiences that I use
                </p>

                {loading ? (
                    <p className="text-center mt-5 text-gray-500">Loading skills...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                        {skills.map((item) => (
                            <article key={item.id} className="flex gap-4 items-center">
                                {item.title === "Next.js" ? (
                                    <div className="bg-white rounded-full flex items-center justify-center">
                                        <Image
                                            width={50}
                                            height={50}
                                            src={item.img}
                                            alt={item.title}
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        width={50}
                                        height={50}
                                        src={item.img}
                                        alt={item.title}
                                        priority
                                    />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">{item.title}</h2>
                                    <p className="text-[#999999] dark:text-[#FFFFFF]/40">
                                        {item.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;

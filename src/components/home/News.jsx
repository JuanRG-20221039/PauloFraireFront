import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import img1 from "../../assets/img1.png";
import { motion } from 'framer-motion';
import { news } from '../../data/Data'
import { FiArrowRight } from "react-icons/fi";
import clientAxios from '../../config/clientAxios';
import { HiArrowRightCircle } from "react-icons/hi2";

const News = () => {


    const [blog, setBlog] = useState([]);

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const response = await clientAxios.get('/blog/published');
                setBlog(response.data);

            } catch (error) {
                console.log(error);
            }
        }

        getBlogs();
    }, [])


    return (
        <div className=' bg-gradient-to- from-blue-100 to-sky-600'>


            <div className='flex flex-col  mt-10 px-5 py-10 '>
                <h2 className='p-2 text-4xl md:text-5xl sm:text-2xl text-slate-700 text-center uppercase mb-10 font-extrabold border-yellow-500 border-b-4'>Noticias</h2>
                <section className="">

                    <div className=" grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-4 mx-5 mt-5">
                        {
                            blog.slice().reverse().map(({ _id, title, img, date }) => (
                                <div
                                    key={_id}
                                    className={`shadow-xl bg-slate-50 bg-clip-border border-2 border-solid border-slate-200 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105`}
                                >
                                    <div className='flex justify-center'>
                                        <img
                                            loading='lazy' src={img} alt="title" className="w-full object-cover  object-center h-auto md:h-52 lg:h-56 xl:h-60 "
                                        />
                                    </div>
                                    <div className="p-5 bg-slate-50">
                                        <div >
                                            <h2 className=" text-center font-semibold text-xl text-dark-soft md:text-2xl lg:text-[28px] text-orange-600">
                                                {title}
                                            </h2>
                                            <p className="text-dark-light mt-3 text-sm md:text-lg">

                                            </p>
                                        </div>
                                        <div className="flex justify-between flex-nowrap items-center mt-6">
                                            <div className="flex items-center gap-x-2 md:gap-x-2.5">
                                                <div className="flex flex-col">
                                                    <h4 className="  text-gray-400 text-sm md:text-base">
                                                        {date}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-2 flex text-center items-center justify-center'>
                                            <Link
                                                to={`/new-item/${_id}`}
                                                className="w-full flex justify-center gap-x-1 items-center mt-5 lg:mt-0 text-center   px-6 py-2 rounded-sm font-semibold bg-orange-600 text-white hover:bg-orange-800 transition-all duration-300 ease-in-out"
                                            >
                                                <HiArrowRightCircle />
                                                Leer más
                                            </Link>
                                        </div>


                                    </div>
                                </div>

                            ))
                        }
                    </div>

                    <div className="flex justify-center mt-10">
                        {/* <Link className="py-3 px-6 text-sm border border-solid border-gray rounded-lg font-bold "
                        to="/"
                    >
                        Ver más
                    </Link> */}
                    </div>
                </section>
            </div >
        </div >
    )
}

export default News
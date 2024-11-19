import { useState, useEffect } from "react";
import useProfileData from "./hooks/useProfileData";
import { useContext } from "react";


function UserProfile() {

    const {user, profile, userProfile} = useProfileData()
    console.log(userProfile)
    return (
        <section className="w-full overflow-hidden dark:bg-gray-900">
            <div className="flex flex-col">
                {/* Cover Image */}
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
                    alt="User Cover"
                    className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]"
                />

                {/* Profile Image */}
                <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    <img
                        src={userProfile.image}
                        alt="User Profile"
                        className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
                    />

                    {/* FullName */}
                    <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
                        {user.last_name}
                    </h1>
                </div>

                <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                    {/* Description */}
                    {profile && profile.qualifications && profile.experience
                        ?
                        <p className="w-fit text-gray-700 dark:text-gray-400 text-md">
                            {profile.qualifications}
                            <br />
                            {profile.experience}
                        </p>
                        :
                        <p className="w-fit text-gray-700 dark:text-gray-400 text-md"> Hello, {user.first_name}</p>
                    }

                    {/* Detail */}
                    <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                        <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    <div className="flex flex-col pb-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">First Name</dt>
                                        <dd className="text-lg font-semibold">{user.first_name}</dd>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Last Name</dt>
                                        <dd className="text-lg font-semibold">{user.last_name}</dd>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Date Of Birth</dt>
                                        <dd className="text-lg font-semibold">21/02/1997</dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    <div className="flex flex-col pb-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Location</dt>
                                        <dd className="text-lg font-semibold">Nairobi, Kenya</dd>
                                    </div>
                                    <div className="flex flex-col pt-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phone Number</dt>
                                        <dd className="text-lg font-semibold">{userProfile.phone_number}</dd>
                                    </div>
                                    <div className="flex flex-col pt-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                        <dd className="text-lg font-semibold">{user.email}</dd>
                                    </div>
                                    
                                </dl>
                            </div>
                        </div>

                        <div className="my-10 lg:w-[70%] md:h-[14rem] xs:w-full xs:h-[10rem]">
                            <h1 className="w-fit font-serif my-4 pb-1 pr-2 rounded-b-md border-b-4 border-blue-600 dark:border-b-4 dark:border-yellow-600 dark:text-white lg:text-4xl md:text-3xl xs:text-xl">

                            </h1>

                            {/* Location */}
                            {/* <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02028974562!2d38.613328040215286!3d8.963479542403238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1710567234587!5m2!1sen!2set"
                className="rounded-lg w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe> */}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="fixed right-2 bottom-20 flex flex-col rounded-sm bg-gray-200 text-gray-500 dark:bg-gray-200/80 dark:text-gray-700 hover:text-gray-600 hover:dark:text-gray-400">
                        <a href="https://www.linkedin.com/in/samuel-abera-6593a2209/">
                            <div className="p-2 hover:text-primary hover:dark:text-primary">
                                <svg className="lg:w-6 lg:h-6 xs:w-4 xs:h-4 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-1.608 1.608A1.609 1.609 0 0 1 4 6.106a1.61 1.61 0 0 1 1.592-1.592c.882 0 1.608.72 1.608 1.592Zm-3.2 13.396V8.796h3.2v10.706H4Zm17.99-18h-20v20h20v-20Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </a>
                        <a href="https://github.com/samueltech01">
                            <div className="p-2 hover:text-primary hover:dark:text-primary">
                                <svg className="lg:w-6 lg:h-6 xs:w-4 xs:h-4 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.519 2 12.052c0 4.436 2.865 8.191 6.839 9.512.5.092.682-.219.682-.486 0-.24-.009-.874-.014-1.717-2.782.605-3.37-1.342-3.37-1.342-.454-1.168-1.108-1.48-1.108-1.48-.906-.625.069-.612.069-.612 1.002.072 1.53 1.04 1.53 1.04.89 1.538 2.34 1.094 2.91.836.091-.649.35-1.095.636-1.347-2.22-.256-4.555-1.117-4.555-4.973 0-1.098.39-1.996 1.03-2.7-.103-.257-.446-1.288.098-2.686 0 0 .84-.27 2.75 1.029a9.554 9.554 0 0 1 2.5-.34c.847.004 1.7.115 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.546 1.398.203 2.429.1 2.686.641.704 1.03 1.602 1.03 2.7 0 3.867-2.339 4.714-4.566 4.965.36.312.68.929.68 1.873 0 1.35-.012 2.44-.012 2.772 0 .269.18.583.688.483A10.055 10.055 0 0 0 22 12.052C22 6.519 17.523 2 12 2Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserProfile
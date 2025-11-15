import React from "react";
import { FEATURES } from "../../utils/data.js";

const Features = () => {
    return <div id="features" className="">
        <div className="">
            <div className="">
                <div className="">
                    <span className=""></span>
                    <span className="">
                        Features
                    </span>
                </div>
                <h2 className="">
                    Everything you need to
                    <span className="">
                        Create your Ebook
                    </span>
                </h2>
                <p className="">
                    Our Platform is packed with powerful features to help you write,
                    design, and publish your ebook effortlessly.
                </p>
            </div>

            <div className="">
                {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="">
                            <div className=""></div>
                            <div className="">
                                <div className="{`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg shodow-${feature.gradient}/20 group-hover:scale-110 transition-transform duration-300`}">
                                    <Icon className="" />
                                </div>

                                <div>
                                    <h3 className="">
                                        <p className="">
                                            {feature.title}
                                        </p>
                                    </h3>
                                    <p className="">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="">
                                    <span className="">
                                        Learn More
                                        <svg className=""
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >

                                            <path

                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="">
                <p className="">Ready to get started?</p>
                <a
                    href="/signup"
                    className=""
                >
                    <span>Start Creating Today</span>
                    <svg
                        className=""
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </a>
            </div>
        </div>
    </div>
}
export default Features;
import React from "react";

const OrderProgress = ({ steps }) => {
    return (
        <div className="w-full">
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex-1 h-[80px]"
                    >
                        <div className="relative flex flex-col items-center gap-5 z-30">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.completed
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                } `}
                            >
                                {step.completed && (
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    {step.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {step.date}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute h-[2px] w-full top-[17px] ${
                                        steps[index + 1].completed
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                    }`}
                                    style={{ left: "calc(50% + 1rem)" }}
                                ></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderProgress;

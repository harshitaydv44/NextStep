import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 flex flex-col items-center justify-center text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary-600 text-center">
        About <span className="text-black">Next Step</span>
      </h1>
      <p className="max-w-3xl text-center text-lg md:text-xl leading-relaxed">
        <strong className=" text-primary-600">Next Step</strong> is a student-driven platform designed to empower B.Tech students
        by connecting them with curated learning roadmaps and experienced mentors.
        Whether you're interested in <span className="font-semibold">Web Development</span>, <span className="font-semibold">App Development</span>, 
        <span className="font-semibold"> AI/ML</span>, or <span className="font-semibold">AR/VR</span>, this platform provides clear guidance 
        to help you make informed decisions and grow confidently.
      </p>
    </div>
  );
};

export default About;

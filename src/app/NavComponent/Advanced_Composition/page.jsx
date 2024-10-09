"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdvancedComposition = () => {
  const [compositionData, setCompositionData] = useState(null);

  useEffect(() => {
    const fetchCompositionData = async () => {
      try {
        const response = await axios.get("/api/Admin/Advanced_Composition");

        setCompositionData(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching composition data:", error);
      }
    };

    fetchCompositionData();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Advanced Composition in Music
        </h1>

        {compositionData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">
                Defining Composition Structure
              </h2>
              <p className="text-sm">
                {compositionData.Defining_Composition_Structure}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Starting Points</h2>
              <p className="text-sm">{compositionData.Starting_Points}</p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Planning and Parameters</h2>
              <p className="text-sm">
                {compositionData.Planning_and_Parameters}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Techniques and Resources</h2>
              <p className="text-sm">
                {compositionData.Techniques_and_Resources}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Collaboration and Chance</h2>
              <p className="text-sm">
                {compositionData.Collaboration_and_Chance}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Workshops and Education</h2>
              <p className="text-sm">
                {compositionData.Workshops_and_Education}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Advanced Music Theory</h2>
              <p className="text-sm">{compositionData.Advanced_Music_Theory}</p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Experimental Approaches</h2>
              <p className="text-sm">
                {compositionData.Experimental_Approaches}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Cultural Context</h2>
              <p className="text-sm">{compositionData.Cultural_Context}</p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Portfolio Development</h2>
              <p className="text-sm">{compositionData.Portfolio_Development}</p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Performance and Interpretation</h2>
              <p className="text-sm">
                {compositionData.Performance_and_Interpretation}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Technology in Composition</h2>
              <p className="text-sm">
                {compositionData.Technology_in_Composition}
              </p>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">Ethical Considerations</h2>
              <p className="text-sm">
                {compositionData.Ethical_Considerations}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AdvancedComposition;

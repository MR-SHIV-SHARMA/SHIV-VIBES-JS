"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const MusicTheoryComponent = () => {
  const [musicData, setMusicData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/Admin/Basic_Music");
        setMusicData(response.data.data[0]); // Assuming data structure is { success: true, data: [ { ... } ] }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching music theory data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!musicData) {
    return <p>No data available</p>;
  }

  return (
    <div className="bg-gray-900 text-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">{musicData.title}</h1>

      <p className="text-gray-300 mb-6">{musicData.description}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Key Elements</h2>
          <ul className="space-y-2">
            {Object.keys(musicData.key_elements).map((key) => (
              <li key={key}>
                <strong className="block text-lg font-bold">{key}</strong>
                <p className="text-gray-300 mb-1">
                  {musicData.key_elements[key].description}
                </p>
                <p className="italic text-gray-500">
                  {musicData.key_elements[key].quote}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Additional Topics</h2>
          <ul className="space-y-2">
            {Object.keys(musicData.additional_topics).map((key) => (
              <li key={key}>
                <strong className="block text-lg font-bold">{key}</strong>
                <p className="text-gray-300 mb-1">
                  {musicData.additional_topics[key].description}
                </p>
                <p className="italic text-gray-500">
                  {musicData.additional_topics[key].quote}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Tips for Beginners</h2>
          <ul className="list-disc pl-6">
            {musicData.tips_for_beginners.map((tip, index) => (
              <li key={index} className="text-gray-300">
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Resources</h2>
          <ul className="list-disc pl-6">
            {musicData.resources.map((resource, index) => (
              <li key={index} className="text-gray-300">
                {resource}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-gray-300">{musicData.conclusion}</p>
        </section>
      </div>
    </div>
  );
};

export default MusicTheoryComponent;

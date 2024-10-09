"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../../../components/ui/3d-card";
import Link from "next/link";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/Admin/All_Courses");
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-black py-12 pt-24">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold sm:mb-2 text-white">
        All courses ({courses.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {courses.map((course) => (
          <div key={course._id}>
            <Link href={`/NavComponent/courses/${course._id}`} passHref>
              <div className="block cursor-pointer">
                <CardContainer className="inter-var my-4 sm:mx-8 mx-1">
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-1 border">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {course.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                    >
                      {course.description}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <Image
                        src={course.thumbnail}
                        priority={true}
                        height={300}
                        width={400}
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt={course.title}
                      />
                    </CardItem>
                    <div className="flex justify-between items-center mt-4">
                      <CardItem
                        translateZ={20}
                        as="button"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                      >
                        {course.isFree ? "Free" : "Paid"}
                      </CardItem>
                      {!course.isFree && (
                        <CardItem
                          translateZ={20}
                          as="button"
                          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                        >
                          Sign In
                        </CardItem>
                      )}
                    </div>
                  </CardBody>
                </CardContainer>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;

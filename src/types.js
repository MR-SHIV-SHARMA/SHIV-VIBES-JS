// src/types.js

// Define the Video type
export class Video {
  constructor(title, duration, intro, description, videoUrl) {
    this.title = title;
    this.duration = duration;
    this.intro = intro;
    this.description = description;
    this.videoUrl = videoUrl;
  }
}

// Define the VideoDetails type
export class VideoDetails {
  constructor(totalDuration, accessPeriod, videos) {
    this.totalDuration = totalDuration;
    this.accessPeriod = accessPeriod;
    this.videos = videos; // Array of Video objects
  }
}

// Define the Course type
export class Course {
  constructor(id, title, slug, description, price, instructor, isFeatured, isFree, image, videoDetails = null) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.price = price;
    this.instructor = instructor;
    this.isFeatured = isFeatured;
    this.isFree = isFree;
    this.image = image;
    this.videoDetails = videoDetails; // Optional, default is null
  }
}

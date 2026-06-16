// Placeholder Video Learning Service
// Prepared for Rp812 million premium upgrade (Video pembelajaran & streaming features)

const getVideoLink = async (videoId, userId) => {
  // TODO: Verify if user has purchased the package, check access controls
  return {
    video_id: videoId,
    title: "Video Pembelajaran CPNS (Placeholder)",
    streaming_url: "https://video.learningplatform.com/embed/placeholder_video_id"
  };
};

module.exports = {
  getVideoLink
};

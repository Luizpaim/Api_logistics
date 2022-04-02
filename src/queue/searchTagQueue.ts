import Bull from "bull";
const searchTagQueue = new Bull("searchTag", process.env.REDIS_HOST);
export default searchTagQueue;

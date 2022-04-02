import Bull from "bull";
const searchTagCronQueue = new Bull("searchTagCron", process.env.REDIS_HOST);
export default searchTagCronQueue;

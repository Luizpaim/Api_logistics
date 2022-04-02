import Bull from "bull";
const insertFreightQueue = new Bull("insertFreight", process.env.REDIS_HOST);
export default insertFreightQueue;

import logger from "pino";
import moment from "moment";

const log = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${moment().format()}"`,
});

export default log;
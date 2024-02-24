import { automaticUpdatesTask } from "@/app/automatic-updates/tasks/automaticUpdatesTask";
import { Logger } from "@/lib/logger";
import cron from "node-cron";

export const automaticUpdatesCronJob = cron.schedule(
    "0 * * * *",
    // every minute
    // "* * * * *",
    async () => {
        Logger.info("Running automatic updates");
        await automaticUpdatesTask();
    },
    {
        scheduled: false,
        timezone: "Asia/Baghdad"
    }
);
